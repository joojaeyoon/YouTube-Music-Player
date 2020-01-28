const { ipcMain, Menu, shell } = require("electron");

const contextMenu = Menu.buildFromTemplate([
  {
    label: "Github",
    type: "normal",
    click: function() {
      shell.openExternal("https://github.com/wow1548/YouTube-Music-Player");
    },
    icon: "./assets/GitHub-Mark-16px.png"
  },
  {
    label: "Quit",
    type: "normal",
    click: function() {
      ipcMain.emit("quit");
    }
  }
]);

module.exports = { contextMenu };
