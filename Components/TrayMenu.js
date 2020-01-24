const { ipcMain, Menu } = require("electron");

const contextMenu = Menu.buildFromTemplate([
  {
    label: "Quit",
    type: "normal",
    click: function() {
      ipcMain.emit("save-settings");
      ipcMain.emit("quit");
    }
  }
]);

module.exports = { contextMenu };
