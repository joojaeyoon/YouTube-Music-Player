const { app, BrowserWindow, Tray, BrowserView, ipcMain } = require("electron");
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

let mainWindow, view;

const url = "https://music.youtube.com";
const titleBarHeight = 30;

let iconPath = path.join(__dirname, "assets/favicon.ico");

function createWindow() {
  mainWindow = new BrowserWindow({
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
  });
  view = new BrowserView({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile("./template/index.html");
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

  ipcMain.on("save-settings", function() {
    const pos = mainWindow.getPosition();
    const size = mainWindow.getSize();
    conf.x = pos[0];
    conf.y = pos[1];
    conf.width = size[0];
    conf.height = size[1];
    fs.writeFileSync("config.json", JSON.stringify(conf), "utf-8");
  });
  ipcMain.on("quit", function() {
    mainWindow.close();
  });

  mainWindow.on("move", function() {
    //console.log(mainWindow.getPosition());
  });

  // mainWindow.webContents.openDevTools({ mode: "detach" });
  // view.webContents.openDevTools({ mode: "detach" });
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
