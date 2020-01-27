function GetInfo(webcontents) {
  webcontents.executeJavaScript(
    `
            info.src=document.getElementById("thumbnail").children[0].src;
            info.song=document.querySelector("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string").textContent;
            info.author=document.querySelector("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > span > span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string").textContent;
            ipcRenderer.send("info",info);
        `
  );
}

module.exports = { GetInfo };
