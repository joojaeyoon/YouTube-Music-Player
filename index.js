const { app, BrowserWindow, Tray, Menu, BrowserView } = require("electron");
const path = require("path");

let mainWindow, view;

const url = "https://music.youtube.com";

let iconPath = path.join(__dirname, "assets/favicon.ico");

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 1280,
    height: 720,
    icon: iconPath,
    frame: false,
    titleBarStyle: ""
  });
  view = new BrowserView({
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  mainWindow.loadFile("./template/index.html");
  mainWindow.setBrowserView(view);
  view.webContents.loadURL(url);
  view.setBounds({ x: 0, y: 30, width: 1280, height: 720 - 30 });

  mainWindow.on("resize", function() {
    const windowSize = mainWindow.getSize();
    view.setBounds({
      x: 0,
      y: 30,
      width: windowSize[0],
      height: windowSize[1] - 30
    });
    mainWindow.send("isMaximized", mainWindow.isMaximized());
  });

  // mainWindow.webContents.openDevTools({ mode: "detach" });
  // view.webContents.openDevTools({ mode: "detach" });
}

let tray = null;
app.on("ready", () => {
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true }
  ]);
  tray.setToolTip("YouTube Music Player");
  tray.setContextMenu(contextMenu);
  createWindow();
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  if (mainWindow === null) createWindow();
});
