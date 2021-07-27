
import { Exponent, EXPONENT_CSS_STYLES, Panel } from "@repcomm/exponent-ts";

import { Text } from "./text";
import { WebPlayer } from "./webplayer";

EXPONENT_CSS_STYLES.mount(document.head);

const STYLES = new Exponent()
.make("style")
.setTextContent(`
body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
  display: flex;

  color: white;
  font-family: 'Courier New', Courier, monospace;

  background-color: #555154;
}

#container {
  flex-direction: column;
}

.exponent-text {
  width: 100%;
}
.exponent-edit {
  min-width: 0;
  min-height: 0;
  border: none;
}

.webplayer-title {
  text-align: center;
  align-self: center;
  max-height: 1em;
  margin-top: 1em;
}

.webplayer {
	flex: 10;
	background-color: #353134;
	margin: 5%;
	border-radius: 1em;
  flex-direction: column;
}
.webplayer-frame {
	border: none;
	background-color: #241f23;
	margin: 2em;
	border-radius: 1em;
}

.infofield {
	background-color: #241f23;
	max-height: 2em;
	margin: 1em;
	border-radius: 0.5em;
	overflow: hidden;
	font-size: large;
}
.infofield-edit {
	background-color: #423c40;
	color: inherit;
	text-align: center;
	font-size: inherit;
}
.infofield-label {
	text-align: center;
	align-self: center;
  cursor: pointer;
}

`)
.mount(document.head);

const container = new Panel()
.setId("container")
.mount(document.body);

const player = new WebPlayer ()
.setId("player")
.mount(container);


