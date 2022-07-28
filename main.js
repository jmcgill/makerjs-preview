// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const chokidar = require("chokidar");
const moment = require('moment');

let mainWindow = null;
let filename = null;

function reload() {
  console.log('Loading ' + filename);
  mainWindow.loadFile('playground/app.html');
}

function saveFile(format, text, filename) {
  const codeFilename = process.argv[2];

  // Get base path for input file
  const basePath = path.dirname(codeFilename);

  // Get the name (minus extension) of the inputFile
  const baseName = path.basename(codeFilename, '.js');

  // Make a directory to capture outputs
  const dirName = path.join(basePath, baseName);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
  // Save a copy of the code that generated this code.
  fs.writeFileSync(path.join(dirName, filename + '.js'), fs.readFileSync(codeFilename));

  // Save the output
  var buf = new Buffer(text, 'binary');
  fs.writeFileSync(path.join(dirName, filename + '.pdf'), text);
}

function storePosition() {
    const p = path.join(app.getPath('userData'), 'config.json');
    fs.writeFileSync(p, JSON.stringify(mainWindow.getBounds()));
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // nodeIntegration: true,
      // contextIsolation: false
    }
  });
  mainWindow.loadFile('splash.html');

  mainWindow.webContents.openDevTools();

  const p = path.join(app.getPath('userData'), 'config.json');
  if (fs.existsSync(p)) {
    const bounds = JSON.parse(fs.readFileSync(p));
    mainWindow.setBounds(bounds);
  }

  mainWindow.on('move', e => {
    storePosition();
  });

  mainWindow.on('resize', e => {
    storePosition();
  });

  if (process.argv.length > 2) {
    filename = process.argv[2];
    completeStartup();
    return;
  }

    var menu = Menu.buildFromTemplate([
    {
        label: 'App'
    },
        {
            label: 'File',
            submenu: [

                {
                    label: 'New',
                    click() {
                        dialog.showSaveDialog({
                        }).then((e) => {
                            if (e.canceled) {
                                return;
                            }

                            fs.writeFileSync(e.filePath, fs.readFileSync(path.join(app.getAppPath(), 'empty.js')));
                            filename = e.filePath;
                            completeStartup();
                        });
                    }
                },
                {
                    label: 'Open',
                    click() {
                        dialog.showOpenDialog({
                            properties: ['openFile', 'promptToCreate']
                        }).then((e) => {
                            if (e.canceled) {
                                return;
                            }

                            filename = e.filePaths[0];
                            completeStartup();
                        });
                    }
                }
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);
}

function completeStartup() {
  reload();

  const watcher = chokidar.watch(filename, {
    persistent: true
  });

  // On edit, tell the Playground to reload the source
  watcher.on('change', function(path) {
    mainWindow.webContents.send('reload');
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    ipcMain.handle(
        "getLatestCode",
        (event) => {
            return fs.readFileSync(filename, 'utf-8');
        }
    );

    ipcMain.handle(
        "saveFile",
        (event, format, text, filename) => {
            return saveFile(format, text, filename)
        }
    );
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
});