const { app, BrowserWindow, Tray, BrowserView, ipcMain } = require("electron");
const { contextMenu } = require("./src/Components/TrayMenu");
const { GetInfo } = require("./src/Components/GetInfo");
const {
  mainWindowConfig,
  miniPlayerConfig,
  viewConfig,
  iconPath
} = require("./src/Init");
const fs = require("fs");

let mainWindow, view, miniPlayer;
let tray = null;
let currentSong = "";

const url = "https://music.youtube.com";
const titleBarHeight = 30;

function createWindow() {
  mainWindow = new BrowserWindow(mainWindowConfig);
  miniPlayer = new BrowserWindow(miniPlayerConfig);
  view = new BrowserView(viewConfig);

  miniPlayer.loadFile("./template/mini/index.html");
  miniPlayer.hide();
  mainWindow.loadFile("./template/main/index.html");
  mainWindow.setBrowserView(view);
  view.webContents.loadURL(url);
  view.setBounds({
    x: 0,
    y: 0 + titleBarHeight,
    width: mainWindowConfig.width,
    height: mainWindowConfig.height - titleBarHeight
  });

  mainWindow.on("closed", function() {
    view = null;
    miniPlayer = null;
    mainWindow = null;
  });

  mainWindow.on("close", function() {
    // Save configuration.
    const conf = { main: {}, mini: {} };
    const names = ["main", "mini"];
    const windows = [mainWindow, miniPlayer];

    for (var i = 0; i < names.length; i++) {
      const pos = windows[i].getPosition();
      const size = windows[i].getSize();
      conf[names[i]].x = pos[0];
      conf[names[i]].y = pos[1];
      conf[names[i]].width = size[0];
      conf[names[i]].height = size[1];
    }
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

  miniPlayer.webContents.on("dom-ready", function() {
    miniPlayer.webContents.executeJavaScript(`
      let minSize=(Math.min(window.innerWidth,window.innerHeight)*0.6).toString()+"px";
      
      img.style.width=minSize;
      img.style.height=minSize;
    `);
  });

  miniPlayer.on("resize", function() {
    miniPlayer.webContents.executeJavaScript(`
      minSize=(Math.min(window.innerWidth,window.innerHeight)*0.6).toString()+"px";
      
      img.style.width=minSize;
      img.style.height=minSize;
    `);
  });

  view.webContents.on("dom-ready", function() {
    view.webContents.executeJavaScript(`    
      const {ipcRenderer}=require('electron');
      let sendTitle;
      const info={};
      
      const song=document.querySelector("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string");
      const previousButton=document.querySelector("#left-controls > div > paper-icon-button.previous-button.style-scope.ytmusic-player-bar");
      const playButton=document.querySelector("#play-pause-button");
      const nextButton=document.querySelector("#left-controls > div > paper-icon-button.next-button.style-scope.ytmusic-player-bar");
      const thumbUp=document.querySelector("#like-button-renderer > paper-icon-button.like.style-scope.ytmusic-like-button-renderer");
      const thumbDown=document.querySelector("#like-button-renderer > paper-icon-button.dislike.style-scope.ytmusic-like-button-renderer");
      const time=document.querySelector("#left-controls > span");
      const progress=document.querySelector("#progress-bar");      
    `);
  });

  view.webContents.on("media-started-playing", function() {
    view.webContents.executeJavaScript(`
        sendTitle=setInterval(()=>{
          ipcRenderer.send("Title",song.textContent+" - YouTube Music");
        },1000);
    `);
    miniPlayer.send("play", true);
  });

  view.webContents.on("media-paused", function() {
    view.webContents.executeJavaScript(`
      clearInterval(sendTitle);
      ipcRenderer.send("Title","YouTube Music");
    `);
    miniPlayer.send("play", false);
  });

  ipcMain.on("Title", function(_, title) {
    GetInfo(view.webContents);
    if (currentSong !== title) {
      currentSong = title;
      mainWindow.send("titleChanged", title);
    }
  });

  ipcMain.on("minimode", function() {
    mainWindow.hide();
    miniPlayer.show();
  });

  ipcMain.on("quit", function() {
    app.quit();
  });

  ipcMain.on("info", function(_, info) {
    miniPlayer.send("info", info);
  });

  ipcMain.on("mini", function() {
    miniPlayer.show();
  });

  ipcMain.on("max", function() {
    mainWindow.show();
    miniPlayer.hide();
  });

  ipcMain.on("next", function() {
    view.webContents.executeJavaScript(`
      nextButton.click();
    `);
  });

  ipcMain.on("previous", function() {
    view.webContents.executeJavaScript(`
      previousButton.click();
    `);
  });

  ipcMain.on("play", function() {
    view.webContents.executeJavaScript(`
      playButton.click();
    `);
  });

  ipcMain.on("thumbup", function() {
    view.webContents.executeJavaScript(`
      thumbUp.click();
    `);
  });

  ipcMain.on("thumbdown", function() {
    view.webContents.executeJavaScript(`
      thumbDown.click();
    `);
  });

  // mainWindow.webContents.openDevTools({ mode: "detach" });
  // miniPlayer.webContents.openDevTools({ mode: "detach" });
  // view.webContents.openDevTools({ mode: "detach" });
}

app.on("ready", function() {
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
