const { remote, ipcRenderer: ipc } = require("electron");

const currentWindow = remote.getCurrentWindow();

let images = [
  "../assets/controls/maximize.png",
  "../assets/controls/unmaximize.png"
];
let img = document.getElementById("toggle");

function Minimize() {
  currentWindow.minimize();
  console.log(remote);
}

function ToggleMaximize() {
  if (img.className === "control max") {
    img.classList.remove("max");
    img.src = images[1];
    currentWindow.maximize();
  } else {
    img.classList.add("max");
    img.src = images[0];
    currentWindow.unmaximize();
  }
}

function Close() {
  currentWindow.hide();
}

ipc.on("isMaximized", function(_, value) {
  if (value) {
    img.classList.remove("max");
    img.src = images[1];
  } else {
    img.classList.add("max");
    img.src = images[0];
  }
});
