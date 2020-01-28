function GetInfo(webcontents) {
  webcontents.executeJavaScript(
    `
            info.src=document.getElementById("thumbnail").children[0].src;
            info.song=document.querySelector("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string").textContent;
            info.author=document.querySelector("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > span > span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string").textContent;
            info.like=thumbUp.getAttribute("aria-pressed");
            info.time=time.textContent;
            info.progress=Number(progress.getAttribute("aria-valuenow"))/Number(progress.getAttribute("aria-valuemax")) * 100;
            ipcRenderer.send("info",info);
        `
  );
}

module.exports = { GetInfo };
