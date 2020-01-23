const { app, BrowserWindow } = require("electron");
const path = require("path");
const { Initialize } = require("./src/init");

let mainWindow;

const url = "https://music.youtube.com";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, "assets/Youtube-music-128.png"),
    frame: false,
    titleBarStyle: ""
  });

  mainWindow.loadURL(url);
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
  Initialize(mainWindow.webContents);
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  if (mainWindow === null) createWindow();
});
