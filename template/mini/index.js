const { remote, ipcRenderer: ipc } = require("electron");

const currentWindow = remote.getCurrentWindow();

const title = document.querySelector("head > title");
const img = document.getElementById("img");
const song = document.getElementById("song");
const author = document.getElementById("author");

const playImg = document.getElementsByClassName("play")[0];

function changePlayState(isPlay) {
  if (isPlay) {
    playImg.src = playImg.src.replace("pause", "start");
    playImg.classList.remove("pause");
    playImg.classList.add("start");
  } else {
    playImg.src = playImg.src.replace("start", "pause");
    playImg.classList.remove("start");
    playImg.classList.add("pause");
  }
}

function playButtonClicked() {
  if (playImg.classList.contains("pause")) {
    changePlayState(true);
  } else {
    changePlayState(false);
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

  if (state) event.target.style.backgroundColor = "transparent";
  else event.target.style.backgroundColor = "gray";
  currentWindow.setAlwaysOnTop(!state);
}

function minButton() {
  currentWindow.minimize();
}

function closeButton() {
  currentWindow.hide();
}

function maxButton() {
  ipc.send("max");
}

ipc.on("info", function(_, info) {
  title.textContent = info.song;
  img.src = info.src;
  song.textContent = info.song;
  author.textContent = info.author;
});

ipc.on("play", function(_, isPlaying) {
  if (isPlaying && playImg.classList.contains("start")) {
    changePlayState(false);
  } else if (!isPlaying) {
    changePlayState(true);
  }
});
