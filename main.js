// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const chokidar = require("chokidar");
const moment = require('moment');

let mainWindow = null;

function reload() {
  const args = process.argv;
  const filename = process.argv[2];

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

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  if (fs.existsSync('config.json')) {
    const bounds = JSON.parse(fs.readFileSync('config.json'));
    mainWindow.setBounds(bounds);
  }

  mainWindow.on('move', e => {
    fs.writeFileSync('config.json', JSON.stringify(mainWindow.getBounds()));
  });

  mainWindow.on('resize', e => {
    fs.writeFileSync('config.json', JSON.stringify(mainWindow.getBounds()));
  });

  // mainWindow.webContents.openDevTools();
  reload();

  const watcher = chokidar.watch(process.argv[2], {
    persistent: true
  });

  // On edit, tell the Playground to reload the source
  watcher.on('change', function(path) {
    mainWindow.webContents.send('reload');
  });
}

function getLatestCode() {
  const filename = process.argv[2];
  return fs.readFileSync(filename);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
exports.getLatestCode = getLatestCode;
exports.saveFile = saveFile;
