const fs = require("fs");
const path = require("path");

let iconPath = path.join(__dirname, "../assets/favicon.ico");

const conf = {};
let mainConf = {
  x: 0,
  y: 0,
  width: 1280,
  height: 720
};
let miniConf = {
  x: 0,
  y: 0,
  width: 300,
  height: 200
};

if (fs.existsSync("./config.json")) {
  const conf = JSON.parse(fs.readFileSync("./config.json"));
  mainConf = conf.main;
  miniConf = conf.mini;
} else {
  conf.main = mainConf;
  conf.mini = miniConf;
  fs.writeFileSync("./config.json", JSON.stringify(conf), "utf-8");
}

// MainWindow Configuration
const mainWindowConfig = {
  webPreferences: {
    nodeIntegration: true
  },
  width: mainConf.width,
  height: mainConf.height,
  x: mainConf.x,
  y: mainConf.y,
  icon: iconPath,
  frame: false,
  titleBarStyle: ""
};

// MiniPlayer Configuration
const miniPlayerConfig = {
  frame: false,
  center: false,
  resizable: false,
  alwaysOnTop: false,
  width: miniConf.width,
  height: miniConf.height,
  x: miniConf.x,
  y: miniConf.y,
  webPreferences: {
    nodeIntegration: true
  },
  autoHideMenuBar: true,
  icon: iconPath
};

// View Configuration
const viewConfig = {
  webPreferences: {
    nodeIntegration: true
  }
};

module.exports = {
  mainWindowConfig,
  miniPlayerConfig,
  viewConfig,
  iconPath
};
