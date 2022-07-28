// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronApi', {
  getLatestCode: () => ipcRenderer.invoke('getLatestCode'),
  saveFile: (format, text, filename) => ipcRenderer.invoke('saveFile', format, text, filename),
  onReload: (callback) => ipcRenderer.on('reload', callback)
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
});
