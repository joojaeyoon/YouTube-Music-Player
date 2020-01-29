const Initialize = `
      const {ipcRenderer}=require('electron');
      let sendTitle;
      const info={};
      
      const song=document.querySelector("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string");
      const previousButton=document.querySelector("#left-controls > div > paper-icon-button.previous-button.style-scope.ytmusic-player-bar");
      const playButton=document.querySelector("#play-pause-button");
      const nextButton=document.querySelector("#left-controls > div > paper-icon-button.next-button.style-scope.ytmusic-player-bar");
      const thumbUp=document.querySelector("#like-button-renderer > paper-icon-button.like.style-scope.ytmusic-like-button-renderer");
      const thumbDown=document.querySelector("#like-button-renderer > paper-icon-button.dislike.style-scope.ytmusic-like-button-renderer");
      const time=document.querySelector("#left-controls > span");
      const progress=document.querySelector("#progress-bar");      
  `;

const GetInfo = `
      info.src=document.getElementById("thumbnail").children[0].src;
      info.song=document.querySelector("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string").textContent;
      info.author=document.querySelector("#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > span > span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string").textContent;
      info.like=thumbUp.getAttribute("aria-pressed");
      info.time=time.textContent;
      info.progress=Number(progress.getAttribute("aria-valuenow"))/Number(progress.getAttribute("aria-valuemax")) * 100;
      ipcRenderer.send("info",info);
        `;

const SendTitle = `
    sendTitle=setInterval(()=>{
      ipcRenderer.send("Title",song.textContent+" - YouTube Music");
    },1000);
  `;

const ClearInterval = `
    clearInterval(sendTitle);
    ipcRenderer.send("Title","YouTube Music");
  `;

const MiniInit = `
  let minSize=(Math.min(window.innerWidth,window.innerHeight)*0.6).toString()+"px";
        
  img.style.width=minSize;
  img.style.height=minSize;
`;

const MiniResize = `
  minSize=(Math.min(window.innerWidth,window.innerHeight)*0.6).toString()+"px";

  img.style.width=minSize;
  img.style.height=minSize;
`;

const Next = `nextButton.click();`;

const Previous = `previousButton.click();`;

const Play = `playButton.click();`;

const ThumbUp = `thumbUp.click();`;

const ThumbDown = `thumbDown.click();`;

module.exports = {
  Initialize,
  GetInfo,
  SendTitle,
  ClearInterval,
  MiniInit,
  MiniResize,
  Next,
  Previous,
  Play,
  ThumbDown,
  ThumbUp
};
