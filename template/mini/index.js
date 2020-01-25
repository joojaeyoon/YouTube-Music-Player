const { ipcRenderer: ipc } = require("electron");

const img = document.getElementById("img");
const song = document.getElementById("song");
const author = document.getElementById("author");

ipc.on("mini", function(_, info) {
  img.src = info.src;
  song.textContent = info.song;
  author.textContent = info.author;
});
