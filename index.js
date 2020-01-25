const {
  app,
  BrowserWindow,
  Tray,
  BrowserView,
  ipcMain,
  screen
} = require("electron");
const { contextMenu } = require("./Components/TrayMenu");
const path = require("path");
const fs = require("fs");

let conf = {
  x: 0,
  y: 0,
  width: 1280,
  height: 720
};

if (fs.existsSync("config.json")) {
  conf = JSON.parse(fs.readFileSync("config.json"));
} else {
  fs.writeFileSync("config.json", JSON.stringify(conf), "utf-8");
}

let mainWindow, view, miniPlayer;

const url = "https://music.youtube.com";
const titleBarHeight = 30;

let iconPath = path.join(__dirname, "assets/favicon.ico");

const mainWindowConfig = {
  webPreferences: {
    nodeIntegration: true
  },
  width: conf.width,
  height: conf.height,
  x: conf.x,
  y: conf.y,
  icon: iconPath,
  frame: false,
  titleBarStyle: ""
};

function createWindow() {
  mainWindow = new BrowserWindow(mainWindowConfig);
  view = new BrowserView({
    webPreferences: {
      nodeIntegration: true
    }
  });

  // # MiniPlayer Settings
  // miniPlayer = new BrowserWindow({
  //   frame: false,
  //   center: false,
  //   resizable: false,
  //   alwaysOnTop: false,
  //   width: 300,
  //   height: 200,
  //   webPreferences: {
  //     nodeIntegration: true
  //   },
  //   skipTaskbar: true,
  //   autoHideMenuBar: true
  // });

  // miniPlayer.loadFile("./template/mini/index.html");
  mainWindow.loadFile("./template/main/index.html");
  mainWindow.setBrowserView(view);
  view.webContents.loadURL(url);
  view.setBounds({
    x: 0,
    y: 0 + titleBarHeight,
    width: conf.width,
    height: conf.height - titleBarHeight
  });

  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  mainWindow.on("close", function() {
    // Save configuration.
    const pos = mainWindow.getPosition();
    const size = mainWindow.getSize();
    conf.x = pos[0];
    conf.y = pos[1];
    conf.width = size[0];
    conf.height = size[1];
    fs.writeFileSync("config.json", JSON.stringify(conf), "utf-8");
  });

  mainWindow.on("resize", function() {
    const windowSize = mainWindow.getSize();
    view.setBounds({
      x: 0,
      y: 0 + titleBarHeight,
      width: windowSize[0],
      height: windowSize[1] - titleBarHeight
    });
    mainWindow.send("isMaximized", mainWindow.isMaximized());
  });

  ipcMain.on("quit", function() {
    mainWindow.close();
  });

  view.webContents.on("login", function() {
    console.log("Play!!");
  });

  view.webContents.on("dom-ready", () => {
    view.webContents.executeJavaScript(`    
      const {ipcRenderer}=require('electron');
      let sendTitle;
    `);
  });

  view.webContents.on("media-started-playing", function() {
    view.webContents.executeJavaScript(
      `
        sendTitle=setInterval(()=>{
          ipcRenderer.send("Title",document.querySelector("#layout > ytmusic-player-bar \
          > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar \
          > yt-formatted-string").textContent+" - YouTube Music");
        },1000);
    `
    );
  });

  view.webContents.on("media-paused", function() {
    view.webContents.executeJavaScript(`
    clearInterval(sendTitle);
    `);
  });

  mainWindow.webContents.openDevTools({ mode: "detach" });
  view.webContents.openDevTools({ mode: "detach" });

  ipcMain.on("Title", (_, value) => {
    mainWindow.send("titleChanged", value);
  });
}

let tray = null;
app.on("ready", () => {
  tray = new Tray(iconPath);

  tray.setToolTip("YouTube Music Player");
  tray.setContextMenu(contextMenu);

  tray.on("click", function() {
    mainWindow.show();
  });
  createWindow();
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  if (mainWindow === null) createWindow();
});
