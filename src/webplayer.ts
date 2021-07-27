
import { Panel } from "@repcomm/exponent-ts";
import { IFrame } from "./iframe";
import { InfoField } from "./infofield";

import { Text } from "./text";

import { Queue } from "./queue";
import { getYoutubePlayerAPI, YT } from "./yt-api-bridge";

export interface WebPlayerItem {
  type: "youtube",
  contentId: string;
}

function resolveWebPlayerItemUrl(item: WebPlayerItem): string {
  let host = window.location.host;

  switch (item.type) {
    case "youtube":
      return `https://www.youtube.com/embed/${item.contentId}?autoplay=1&enablejsapi=1&origin=http://${host}`
    default:
      throw `Unhandled web player item type "${item.type}"`
  }
}

export interface WebPlayerMessageJson {
  type: "load",
  contentId?: string;
}

export class WebPlayer extends Panel {
  private title: Text;

  private fieldPlayerName: InfoField;
  private fieldNonce: InfoField;
  private fieldAudioTitle: InfoField;
  private fieldSocketStatus: InfoField;

  private frame: IFrame;
  private youtubePlayer: YT.Player;

  private itemQueue: Queue<WebPlayerItem>;

  private socket: WebSocket;

  constructor() {
    super();

    this.addClasses("webplayer");

    this.title = new Text()
      .addClasses("webplayer-title")
      .setTextContent("Crystal Oscillator")
      .setId("title")
      .setFontSize("large")
      .mount(this);

    this.fieldPlayerName = new InfoField()
      .setValue("Unknown")
      .setLabel("Player Name")
      .setEditable(false)
      .mount(this);

    let params = (new URL(document.location.href)).searchParams;

    // let undetectedNonce = "not detected";
    let undetectedNonce = Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16);

    let nonce = params.get("nonce") || undetectedNonce;

    this.fieldNonce = new InfoField()
      .setValue(nonce)
      .setLabel("Nonce")
      .setEditable(false)
      .mount(this);

    this.fieldAudioTitle = new InfoField()
      .setValue("")
      .setLabel("Title")
      .setEditable(false)
      .mount(this);

    this.fieldSocketStatus = new InfoField()
      .setValue("Uninitialized")
      .setLabel("WebSocket Status")
      .setEditable(false)
      .mount(this)
      .on("click", (evt)=>{
        this.fieldSocketStatus.setValue("Connecting");
        setTimeout(()=>{
          if (!this.isSocketOpen()) this.connectSocket();
        }, 1000);
      });

    this.frame = new IFrame()
      .addClasses("webplayer-frame")
      .setAutoPlay(true)
      .setSource(
        resolveWebPlayerItemUrl({
          type:"youtube",
          contentId: "5zexmRxxJlY"
      }))
      .mount(this);

    getYoutubePlayerAPI().then((create) => {
      console.log("Creating youtube player");

      this.youtubePlayer = create(this.frame.element, {
        // height: "360",
        // width: "640",
        // videoId: "5zexmRxxJlY",
        playerVars: {
          playsinline: 1
        },
        events: {
          onReady: (evt) => {
            console.log("Ready", evt);
            this.youtubePlayer.pauseVideo();

          },
          onStateChange: (evt) => {
            this.fieldAudioTitle.setValue(this.youtubePlayer.playerInfo.videoData.title);
            console.log("Change");
          }
        }
      });

      console.log(this.youtubePlayer);

      // this.frame.on("click", ()=>{
      //   this.frame.setSource(
      //     resolveWebPlayerItemUrl({ type: "youtube", contentId: "5zexmRxxJlY" })
      //   );
      // });
    });

    this.itemQueue = new Queue();
    
    this.connectSocket();
  }
  isSocketOpen (): boolean {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }
  isSocketClosed (): boolean {
    return this.socket && this.socket.readyState !== WebSocket.CLOSED;
  }
  destroySocket () {
    if (this.socket) this.socket.close();
    this.socket = null;
  }
  connectSocket () {
    //destroy old socket
    if (!this.isSocketClosed()) this.destroySocket();

    let host = window.location.hostname;
    let port = 10209;
    let clientUrl = `ws://${host}:${port}`;
    console.log("Attempting connect to", clientUrl);
    this.socket = new WebSocket(clientUrl);

    this.fieldSocketStatus.setValue("Connecting");

    this.socket.addEventListener("close", (evt)=>{
      this.fieldSocketStatus.setValue(`Closed: ${evt.code}`);
    });
    this.socket.addEventListener("error", (evt)=>{
      this.fieldSocketStatus.setValue("Error");
    });
    this.socket.addEventListener("message", (evt)=>{
      console.log(evt);
      let msg: WebPlayerMessageJson;
      try {
        msg = JSON.parse(evt.data);
      } catch (ex) {
        //TODO - prolly do something here
        console.warn(ex);
      }

      switch (msg.type) {
        case "load":
          this.youtubePlayer.loadVideoById(msg.contentId, 0);
          break;
      }
      console.log(msg);
    });
    this.socket.addEventListener("open", (evt)=>{
      this.fieldSocketStatus.setValue("Connected");
    });
  }
  get items(): Queue<WebPlayerItem> {
    return this.itemQueue;
  }
}
