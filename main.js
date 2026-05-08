const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,

    frame: false,
    titleBarStyle: 'hidden',

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },

    icon: path.join(__dirname, 'assets/logo.ico'),
    backgroundColor: '#0a0a0f',
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // IPC controles ventana
  ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
  });

  ipcMain.on('maximize-window', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on('close-window', () => {
    mainWindow.close();
  });
}

app.whenReady().then(createWindow);

// macOS behavior
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// cierre limpio
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});