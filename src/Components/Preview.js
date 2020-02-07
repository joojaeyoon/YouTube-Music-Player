const path = require("path");
const { ipcMain: ipc } = require("electron");

const icons = {
  thumbdown: path.join(
    __dirname,
    "../../assets/controls/thumb_down_outline_white.png"
  ),
  previouse: path.join(
    __dirname,
    "../../assets/controls/skip_previous_white.png"
  ),
  play: path.join(__dirname, "../../assets/controls/start_white.png"),
  pause: path.join(__dirname, "../../assets/controls/pause_white.png"),
  next: path.join(__dirname, "../../assets/controls/skip_next_white.png"),
  thumbup: path.join(
    __dirname,
    "../../assets/controls/thumb_up_outline_white.png"
  ),
  thumbup_filled: path.join(
    __dirname,
    "../../assets/controls/thumb_up_filled_white.png"
  )
};

const previewTooltip = [
  {
    tooltip: "Thumb down",
    icon: icons.thumbdown,
    click() {
      ipc.emit("thumbdown");
    }
  },
  {
    tooltip: "Previous",
    icon: icons.previouse,
    click() {
      ipc.emit("previous");
    }
  },
  {
    tooltip: "Play",
    icon: icons.play,
    click() {
      ipc.emit("play");
    }
  },
  {
    tooltip: "Next",
    icon: icons.next,
    click() {
      ipc.emit("next");
    }
  },
  {
    tooltip: "Thumb up",
    icon: icons.thumbup,
    click() {
      ipc.emit("thumbup");
    }
  }
];

module.exports = { previewTooltip, icons };
