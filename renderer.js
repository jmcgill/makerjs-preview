// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// const { ipcRenderer } = require('electron');
// const main = remote.require('./main.js');
// const $ = require('../jquery.min');
// const prompt = require('electron-prompt');

window.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

window.addEventListener('DOMContentLoaded', () => {
    window.electronApi.onReload((_event, value) => {
        MakerJsPlayground.runCodeFromEditor();
    })
});

async function getLatestCode() {
    const code = await window.electronApi.getLatestCode();
    console.log(code);
    return code;
    // return main.getLatestCode();
}

function snapshot() {
    var request = {
        format: MakerJsPlaygroundExport.ExportFormat.Pdf,
        formatTitle: 'PDF',
        model: MakerJsPlayground.getProcessedModel(),
        options: {
            origin: [10, 10],

        }
    };
    MakerJsPlayground.exportOnWorkerThread(request);
}

function saveFile(format, text) {
    // prompt({title: "Save", label: "What should this be saved as?"}).then((filename) => {
    //     console.log('Filename is ', filename);
    //     window.electronApi.saveFile(format, text, filename);
    // });
}
