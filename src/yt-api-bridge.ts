
export type YoutubePlayerEventType = "";

export declare module YT {
  interface PlayerState {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  }
  interface PlayerOptions {
    height?: string;
    width?: string;
    videoId?: string;
    playerVars?: {
      playsinline: number;
    },
    events: {
      onReady: Function;
      onStateChange: Function;
    }

  }
  class Player {
    constructor (element?: string|HTMLIFrameElement, opts?: YT.PlayerOptions);
    cueVideoById(videoId: string, startSeconds: number): void;
    playerInfo: {
      videoData: {
        author: string;
        title: string;
      }
    }
    cueVideoById (id: string, startSeconds: number);
    cueVideoById(opts: {id: string, startSeconds: number, endSeconds: number});
    loadVideoById(id: string, startSeconds: number);
    loadVideoById(opts: {id: string, startSeconds: number, endSeconds: number});
    playVideo();
    pauseVideo();
    stopVideo();
    seekTo(seconds: number, allowSeekAhead: boolean);
    nextVideo();
    previousVideo();
    mute();
    unMute();
    /**Between 0 and 100*/
    setVolume (v: number);
    getVolume();
    setSize(w: number, h: number);
    setLoop (loopPlaylist: boolean);
    setShuffle (shufflePlaylist: boolean);
    getVideoLoadedFraction(): number;
    /**See YoutubePlayerStateMap */
    getPlayerState (): number;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoUrl (): string;
    getVideoEmbedCode(): string;
    getPlaylist(): Array<any>;
    getPlaylistIndex (): number;
    addEventListener (type: string, cb: any);
    removeEventListener (type: string, cb: any);
    destroy();
    getIframe(): HTMLIFrameElement;
  }
}

function isLoaded (): boolean {
  return window["YT"];
}


var resolvers: Array<(create: createYoutubePlayerType) => void> = resolvers || new Array();
function runSafe () {
  if (!isLoaded()) {
    runOnce();
  }
}
runSafe();

function runOnce () {
  let tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  // Replace the 'ytplayer' element with an <iframe> and
  // YouTube player after the API code downloads.
  // let player;
  window["onYouTubeIframeAPIReady"] = function onYouTubeIframeAPIReady() {
    // player = new YT.Player('ytplayer', {
    //   height: '360',
    //   width: '640',
    //   videoId: 'M7lc1UVf-VE'
    // });
    console.log("Youtube API ready, resolving resolvers");
    for (let _resolve of resolvers) {
      _resolve(createYoutubePlayer);
    }
  }

}

export interface createYoutubePlayerType {
  (element: string|HTMLIFrameElement, playerOptions: YT.PlayerOptions): YT.Player;
}

export const createYoutubePlayer: createYoutubePlayerType = (element, playerOptions) => {
  return new YT.Player(element, playerOptions);
}

export async function getYoutubePlayerAPI (): Promise<createYoutubePlayerType> {
  return new Promise(async (_resolve, _reject)=>{
    if (isLoaded()) {
      _resolve(createYoutubePlayer);
    } else {
      resolvers.push(_resolve);
    }
  });
}
