/* eslint-env browser */

import * as Y from 'yjs'
import {MonacoBinding} from 'y-monaco'
import * as monaco from 'monaco-editor'
import {WebrtcProvider} from "y-webrtc";

const DIST_PATH = '/dist'
const connectionStatus = document.getElementById("connection-status")
const connectionButton = document.getElementById("y-connect-btn")
const roomNameInput = document.getElementById("room-name-input")
let monacoBinding;
let provider;
let editor = monaco.editor.create(document.getElementById('monaco-editor'), {
    language: 'cpp',
    theme: 'vs-dark'
});

// @ts-ignore
window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        if (label === 'json') {
            return `${DIST_PATH}/json.worker.bundle.js`
        }
        if (label === 'css') {
            return `${DIST_PATH}/css.worker.bundle.js`
        }
        if (label === 'html') {
            return `${DIST_PATH}/html.worker.bundle.js`
        }
        if (label === 'typescript' || label === 'javascript') {
            return `${DIST_PATH}/ts.worker.bundle.js`
        }
        return `${DIST_PATH}/editor.worker.bundle.js`
    }
}

const enterRoom = (roomName) => {
    console.log("Entering room " + roomName)
    const ydoc = new Y.Doc()
    provider = new WebrtcProvider(roomName, ydoc, {signaling: ['ws://192.168.0.102:4444']})
    const ytext = ydoc.getText('monaco')
    monacoBinding = new MonacoBinding(ytext, editor.getModel(), new Set([editor]), provider.awareness)
}

window.addEventListener('load', () => {
    enterRoom('welcome-room')
})

connectionButton.addEventListener('click', () => {
    if (provider.shouldConnect) {
        provider.disconnect()
        provider.destroy()
        connectionButton.textContent = 'Connect'
    } else {
        const roomName = roomNameInput.value
        enterRoom(roomName ? roomName : 'welcome-room')
        provider.connect()
        connectionButton.textContent = 'Disconnect'
    }
})