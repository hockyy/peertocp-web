/* eslint-env browser */

import * as Y from 'yjs'
import {WebrtcProvider} from "y-webrtc";

import {yCollab, yUndoManagerKeymap} from 'y-codemirror.next'

import * as random from "lib0/random";
import {basicSetup, EditorView} from "codemirror";
import {keymap} from "@codemirror/view";
import {EditorState} from "@codemirror/state";
import {cpp} from "@codemirror/lang-cpp";
import {indentWithTab} from "@codemirror/commands";

const SIGNALLING_SERVER_URL ='ws://192.168.0.102:4444';
const DIST_PATH = '/dist'
const DEFAULT_ROOM = 'welcome-room'
const DEFAULT_USERNAME = 'Anonymous ' + Math.floor(Math.random() * 100)
const connectionStatus = document.getElementById("connection-status")
const connectionButton = document.getElementById("connect-button")
const roomNameInput = document.getElementById("room-name-input")
const usernameInput = document.getElementById("username-input")
let codeMirrorView;
let provider;
let currentState = {}

export const usercolors = [
    {color: '#30bced', light: '#30bced33'},
    {color: '#6eeb83', light: '#6eeb8333'},
    {color: '#ffbc42', light: '#ffbc4233'},
    {color: '#ecd444', light: '#ecd44433'},
    {color: '#ee6352', light: '#ee635233'},
    {color: '#9ac2c9', light: '#9ac2c933'},
    {color: '#8acb88', light: '#8acb8833'},
    {color: '#1be7ff', light: '#1be7ff33'}
]

export const userColor = usercolors[random.uint32() % usercolors.length]

const getEnterState = () => {
    return {
        roomName: roomNameInput.value || DEFAULT_ROOM,
        username: usernameInput.value || DEFAULT_USERNAME,
    };
}

window.addEventListener('load', () => {
    enterRoom(getEnterState())
})


const enterRoom = ({roomName, username}) => {
    currentState = {roomName:roomName, username:username}
    connectionStatus.textContent = roomName
    console.log("Entering room " + roomName)
    const ydoc = new Y.Doc()
    provider = new WebrtcProvider(
        roomName,
        ydoc,
        {
            // awareness: new Awareness(),
            signaling: [SIGNALLING_SERVER_URL]
        }
    )
    provider.awareness.setLocalStateField('user', {
        name: username,
        color: userColor.color,
        colorLight: userColor.light
    })
    const ytext = ydoc.getText('codemirror')
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
    codeMirrorView = new EditorView({state, parent: /** @type {HTMLElement} */ (document.querySelector('#editor'))})
}


connectionButton.addEventListener('click', () => {
    if (provider.shouldConnect) {
        provider.disconnect()
        // provider.destroy()
        connectionButton.textContent = 'Connect'
        connectionButton.classList.replace("btn-danger", "btn-success")
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
        connectionButton.textContent = 'Disconnect'
        connectionButton.classList.replace("btn-success", "btn-danger")
    }
})
