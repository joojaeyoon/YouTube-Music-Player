const { remote, ipcRenderer: ipc } = require("electron");

const currentWindow = remote.getCurrentWindow();

const img = document.getElementById("img");
const song = document.getElementById("song");
const author = document.getElementById("author");

function playButtonClicked(event) {
  if (event.target.classList.contains("pause")) {
    event.target.src = event.target.src.replace("pause", "start");
    event.target.classList.remove("pause");
    event.target.classList.add("start");
  } else {
    event.target.src = event.target.src.replace("start", "pause");
    event.target.classList.remove("start");
    event.target.classList.add("pause");
  }
  ipc.send("play");
}

function nextButton() {
  ipc.send("next");
}

function previousButton() {
  ipc.send("previous");
}

function pinButton(event) {
  const state = currentWindow.isAlwaysOnTop();

  if (state) {
    event.target.style.backgroundColor = "transparent";
  } else {
    event.target.style.backgroundColor = "gray";
  }
  currentWindow.setAlwaysOnTop(!state);
}

function minButton() {
  currentWindow.minimize();
}

function closeButton() {
  currentWindow.hide();
}

ipc.on("mini", function(_, info) {
  img.src = info.src;
  song.textContent = info.song;
  author.textContent = info.author;
});
