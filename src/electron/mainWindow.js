import { createProtocol } from 'vue-cli-plugin-electron-builder/lib/index'; // eslint-disable-line
import { BrowserWindow, screen } from 'electron'; // eslint-disable-line
import * as path from 'path';
import { format as formatUrl } from 'url';
import isDevelopment from './isDevelopment';

export default function createMainWindow() {
  let appWindow = new BrowserWindow({
    width: 435,
    height: 730,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreen: false,
    show: false,
    // titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      backgroundThrottling: false,
    },
  });

  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    appWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);

    if (!process.env.IS_TEST) {
      appWindow.webContents.openDevTools({
        mode: 'detach',
      });
    }
  } else {
    createProtocol('app');
    //   Load the index.html when not in development
    appWindow.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true,
    }));
  }

  appWindow.on('closed', () => {
    appWindow = null;
  });

  appWindow.on('blur', () => {
    if (!appWindow.webContents.isDevToolsOpened()) {
      appWindow.hide();
    }
  });

  appWindow.webContents.on('devtools-opened', () => {
    appWindow.focus();
    setImmediate(() => {
      appWindow.focus();
    });
  });

  return appWindow;
}

export const positionWindowBelowTray = (window, tray) => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();
  // const cursorPosition = screen.getCursorScreenPoint();
  // FIXME: This is so that the tray position is correct on portrait screen.
  //        This has been fixed in electron https://github.com/electron/electron/pull/13162
  //        But for some reason still isn't working
  const { workArea } = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());

  // Center window horizontally below the tray icon
  // const x = Math.round((trayBounds.x + (trayBounds.width / 2)) - (windowBounds.width / 2));
  const x = Math.round((trayBounds.x + (trayBounds.width / 2)) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  // const y = Math.round(trayBounds.y + trayBounds.height + 10);
  const y = Math.round(workArea.y + 10);

  window.setPosition(x, y, false);
};
