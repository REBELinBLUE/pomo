/* eslint-disable */
import electron, { ipcMain, app, protocol, BrowserWindow, Menu, Tray } from 'electron';
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib';
import * as path from 'path';
import { format as formatUrl } from 'url';
import zeroPad from './filters/zeroPad';
import minutesRemaining from './filters/minutesRemaining';
import secondsRemaining from './filters/secondsRemaining';
/* eslint-enable */

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
let tray;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });

function createMainWindow() {
  const window = new BrowserWindow({
    width: 430,
    height: 730,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreen: false,
    // titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      backgroundThrottling: false,
    },
  });

  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) {
      window.webContents.openDevTools({
        mode: 'detach',
      });
    }
  } else {
    createProtocol('app');
    //   Load the index.html when not in development
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true,
    }));
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });



  return window;
}

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 10);

  return { x, y };
};

const showWindow = () => {
  const position = getWindowPosition();
  mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
  mainWindow.focus();
};

const toggleWindow = () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow();
    return;
  }

  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
};

app.dock.hide();

// quit application when all windows are closed
app.on('window-all-closed', (event) => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  } else {
    mainWindow.hide();
    event.preventDefault();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
    showWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools();
  }

  mainWindow = createMainWindow();

  tray = new Tray(path.join(__static, 'icon.png'));

  tray.on('click', (event) => {
    toggleWindow();

    // Show devtools when command clicked
    if (mainWindow.isVisible() && event.metaKey) {
      window.webContents.openDevTools({
        mode: 'detach',
      });
    }
  });

  tray.setTitle('');

  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Timer' },
      { label: 'Preferences' },
      { label: 'History' },
      { type: 'separator' },
      {
        label: 'Homepage',
        click() {
          electron.shell.openExternal('http://github.com/REBELinBLUE/pomodoro');
        },
      },
      { role: 'quit' },
    ]);

    tray.popUpContextMenu(contextMenu);
  });
});

ipcMain.on('timer-progress', (event, payload) => {
  const { seconds } = payload;

  tray.setTitle(`${zeroPad(minutesRemaining(seconds))}:${zeroPad(secondsRemaining(seconds))}`);
});
