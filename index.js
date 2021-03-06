const { app, BrowserWindow, Tray, BrowserView, ipcMain } = require("electron");
const { contextMenu } = require("./src/Components/TrayMenu");
const { previewTooltip, icons } = require("./src/Components/Preview");
const executes = require("./src/Components/Executes");
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
let isplaying = false;

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

  //Set Preview buttons
  mainWindow.setThumbarButtons(previewTooltip);
  miniPlayer.setThumbarButtons(previewTooltip);

  mainWindow.on("closed", function() {
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
    miniPlayer.webContents.executeJavaScript(executes.MiniInit);
  });

  miniPlayer.on("resize", function() {
    miniPlayer.webContents.executeJavaScript(executes.MiniResize);
  });

  view.webContents.on("dom-ready", function() {
    view.webContents.executeJavaScript(executes.Initialize);
  });

  view.webContents.on("media-started-playing", function() {
    view.webContents.executeJavaScript(executes.SendTitle);
    previewTooltip[2].icon = icons.pause;
    mainWindow.setThumbarButtons(previewTooltip);
    miniPlayer.setThumbarButtons(previewTooltip);
    miniPlayer.send("play", true);
    isplaying = true;
  });

  view.webContents.on("media-paused", function() {
    if (view.isDestroyed()) {
      return;
    }
    previewTooltip[2].icon = icons.play;
    mainWindow.setThumbarButtons(previewTooltip);
    miniPlayer.setThumbarButtons(previewTooltip);
    view.webContents.executeJavaScript(executes.ClearInterval);
    isplaying = false;
  });

  ipcMain.on("Title", function(_, title) {
    view.webContents.executeJavaScript(executes.GetInfo);
    if (currentSong !== title) {
      currentSong = title;
      mainWindow.send("titleChanged", title);
    }
  });

  ipcMain.on("minimode", function() {
    mainWindow.hide();
    miniPlayer.show();
    miniPlayer.setThumbarButtons(previewTooltip);
  });

  ipcMain.on("quit", function() {
    view.destroy();
    app.quit();
  });

  ipcMain.on("info", function(_, info) {
    mainWindow.setThumbnailToolTip(info.song);
    miniPlayer.send("info", info);
  });

  ipcMain.on("mini", function() {
    miniPlayer.show();
  });

  ipcMain.on("max", function() {
    mainWindow.show();
    miniPlayer.hide();
    mainWindow.setThumbarButtons(previewTooltip);
  });

  ipcMain.on("next", function() {
    view.webContents.executeJavaScript(executes.Next);
  });

  ipcMain.on("previous", function() {
    view.webContents.executeJavaScript(executes.Previous);
  });

  ipcMain.on("play", function() {
    view.webContents.executeJavaScript(executes.Play);

    if (isplaying) previewTooltip[2].icon = icons.pause;
    else previewTooltip[2].icon = icons.play;

    mainWindow.setThumbarButtons(previewTooltip);
    miniPlayer.setThumbarButtons(previewTooltip);
  });

  ipcMain.on("thumbup", function() {
    view.webContents.executeJavaScript(executes.ThumbUp);
    if (previewTooltip[4].icon === icons.thumbup)
      previewTooltip[4].icon = icons.thumbup_filled;
    else previewTooltip[4].icon = icons.thumbup;

    mainWindow.setThumbarButtons(previewTooltip);
    miniPlayer.setThumbarButtons(previewTooltip);
  });

  ipcMain.on("thumbdown", function() {
    view.webContents.executeJavaScript(executes.ThumbDown);
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
