/* eslint-env browser */

import * as Y from 'yjs'
import {MonacoBinding} from 'y-monaco'
import * as monaco from 'monaco-editor'
import {WebrtcProvider} from "y-webrtc";

const DIST_PATH = '/dist'

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

window.addEventListener('load', () => {
    const ydoc = new Y.Doc()
    const provider = new WebrtcProvider('webrtc-test', ydoc, {signaling: ['ws://localhost:4444']})
    const ytext = ydoc.getText('monaco')

    var editor = monaco.editor.create(document.getElementById('monaco-editor'), {
        language: 'cpp',
        theme: 'vs-dark'
    });
    const monacoBinding = new MonacoBinding(ytext, editor.getModel(), new Set([editor]), provider.awareness)

    const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'))
    connectBtn.addEventListener('click', () => {
        if (provider.shouldConnect) {
            provider.disconnect()
            connectBtn.textContent = 'Connect'
        } else {
            provider.connect()
            connectBtn.textContent = 'Disconnect'
        }
    })

    // @ts-ignore
    window.example = {provider, ydoc, ytext, monacoBinding}
})