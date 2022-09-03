/* eslint-env browser */

import * as Y from 'yjs'
import {WebrtcProvider} from "y-webrtc";

import {yCollab, yUndoManagerKeymap} from 'y-codemirror.next'

import * as random from "lib0/random";
import {basicSetup, EditorView} from "codemirror";
import {javascript} from "@codemirror/lang-javascript";
import {keymap} from "@codemirror/view";
import {EditorState} from "@codemirror/state";
import {cpp} from "@codemirror/lang-cpp";
import {indentWithTab} from "@codemirror/commands";

const DIST_PATH = '/dist'
const DEFAULT_ROOM = 'welcome-room'
const connectionStatus = document.getElementById("connection-status")
const connectionButton = document.getElementById("y-connect-btn")
const roomNameInput = document.getElementById("room-name-input")
let codeMirrorView;
let provider;
let currentRoom;

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

const enterRoom = (roomName) => {
    currentRoom = roomName
    connectionStatus.textContent = roomName
    console.log("Entering room " + roomName)
    const ydoc = new Y.Doc()
    provider = new WebrtcProvider(
        roomName,
        ydoc,
        {
            // awareness: new Awareness(),
            signaling: ['ws://192.168.0.102:4444']
        }
    )
    provider.awareness.setLocalStateField('user', {
        name: 'Anonymous ' + Math.floor(Math.random() * 100),
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

window.addEventListener('load', () => {
    enterRoom(DEFAULT_ROOM)
})

connectionButton.addEventListener('click', () => {
    if (provider.shouldConnect) {
        provider.disconnect()
        // provider.destroy()
        connectionButton.textContent = 'Connect'
    } else {
        const roomName = roomNameInput.value || DEFAULT_ROOM
        console.log(roomName)
        if (roomName !== currentRoom) {
            provider.destroy()
            codeMirrorView.destroy()
            enterRoom(roomName ? roomName : DEFAULT_ROOM)
        } else {
            provider.connect()
        }
        connectionButton.textContent = 'Disconnect'
    }
})