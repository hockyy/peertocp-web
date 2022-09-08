/* eslint-env browser */

import * as Y from 'yjs'
import {WebrtcProvider} from "y-webrtc";
import {yCollab, yUndoManagerKeymap} from 'y-codemirror.next'

import {basicSetup, EditorView} from "codemirror";
import {keymap} from "@codemirror/view";
import {EditorState} from "@codemirror/state";
import {cpp} from "@codemirror/lang-cpp";
import {indentWithTab} from "@codemirror/commands";

const SIGNALLING_SERVER_URL = 'ws://103.167.137.77:4444';
const WEBSOCKET_SERVER_URL = 'ws://103.167.137.77:4443';

const DIST_PATH = '/dist'
const DEFAULT_ROOM = 'welcome-room'
const DEFAULT_USERNAME = 'Anonymous ' + Math.floor(Math.random() * 100)
const roomStatus = document.getElementById("room-status")
const connectionStatus = document.getElementById("connection-status")
const peersStatus = document.getElementById("peers-status")
const connectionButton = document.getElementById("connect-button")
const roomNameInput = document.getElementById("room-name-input")
const usernameInput = document.getElementById("username-input")
const spawnButton = document.getElementById("spawn-button")

let codeMirrorView;
let provider;
let currentState = {}

const randomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const color = "#" + randomColor;
  const light = color + "33";
  return {color, light}
}

const STATUS_COLORS = ["#a83232", "#32a852"]

export const userColor = randomColor()

const getEnterState = () => {
  return {
    roomName: roomNameInput.value || DEFAULT_ROOM,
    username: usernameInput.value || DEFAULT_USERNAME,
  };
}

window.addEventListener('load', () => {
  enterRoom(getEnterState())
})

const getPeersString = (peers) => {
  const ret = document.createElement("ul")
  peers.forEach((val, key) => {
    const cur = document.createElement("li");
    cur.innerHTML = (`${key} - ${val.user.name}\n`)
    cur.style.color = `${val.user.color}`
    ret.appendChild(cur)
  })
  return ret;
}

const enterRoom = ({roomName, username}) => {
  currentState = {roomName: roomName, username: username}
  roomStatus.textContent = roomName
  console.log("Entering room " + roomName)
  const ydoc = new Y.Doc()
  provider = new WebsocketProvider(
      WEBSOCKET_SERVER_URL,
      roomName,
      ydoc
  )
  provider.awareness.setLocalStateField('user', {
    name: username,
    color: userColor.color,
    colorLight: userColor.light
  })
  const ytext = ydoc.getText('codemirror')
  provider.awareness.on("change", (status) => {
    peersStatus.innerHTML = (getPeersString(
        provider.awareness.getStates())).innerHTML
  })
  const state = EditorState.create({
    doc: ytext.toString(),
    extensions: [
      keymap.of([
        ...yUndoManagerKeymap,
        indentWithTab
      ]),
      basicSetup,
      cpp(),
      yCollab(ytext, provider.awareness)
      // oneDark
    ]
  })
  codeMirrorView = new EditorView({
    state,
    parent: /** @type {HTMLElement} */ (document.querySelector('#editor'))
  })
}

connectionButton.addEventListener('click', () => {
  if (provider.shouldConnect) {
    provider.disconnect()
    // provider.destroy()
    connectionButton.textContent = 'Connect'
    connectionButton.classList.replace("btn-danger", "btn-success")
    connectionStatus.textContent = "Offline"
    connectionStatus.style.color = STATUS_COLORS[0]
    peersStatus.innerHTML = ""
  } else {
    const enterState = getEnterState()
    console.log(enterState)
    if (enterState !== currentState) {
      provider.destroy()
      codeMirrorView.destroy()
      enterRoom(enterState)
    } else {
      provider.connect()
    }
    connectionStatus.textContent = "Online"
    connectionStatus.style.color = STATUS_COLORS[1]
    connectionButton.textContent = 'Disconnect'
    connectionButton.classList.replace("btn-success", "btn-danger")
  }
})

spawnButton.addEventListener("click", () => {
  const python = child.exec('python3', ['script1.py'])
  let dataToSend;
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend)
  });
})