import { installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'; // eslint-disable-line
import { ipcMain, app, protocol, Tray, Notification, nativeImage } from 'electron'; // eslint-disable-line
import * as path from 'path';
import createMainWindow, { positionWindowBelowTray } from './electron/mainWindow';
import isDevelopment from './electron/isDevelopment';
import light from './electron/light';
import zeroPad from './filters/zeroPad';
import minutesRemaining from './filters/minutesRemaining';
import secondsRemaining from './filters/secondsRemaining';
import contextMenu from './electron/contextMenu';

// FIXME: https://github.com/electron/electron/blob/v0.36.10/docs/api/app.md#appmakesingleinstancecallback

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
let tray;
let timeout;
const filled = nativeImage.createFromPath(path.join(__static, 'filled.png'));
const inverted = nativeImage.createFromPath(path.join(__static, 'invert.png'));
// const emptied = nativeImage.createFromPath(path.join(__static, 'empty.png'));

const showWindow = () => {
  positionWindowBelowTray(mainWindow, tray);
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

const setTitleCounter = (msTotal) => {
  const seconds = (msTotal / 1000);

  tray.setTitle(`${zeroPad(minutesRemaining(seconds))}:${zeroPad(secondsRemaining(seconds))}`);
};

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });

// // quit application when all windows are closed
// app.on('window-all-closed', (event) => {
//   // on macOS it is common for applications to stay open until the user explicitly quits
//   if (process.platform !== 'darwin') {
//     app.quit();
//   } else {
//     mainWindow.hide();
//     event.preventDefault();
//   }
// });
//
// app.on('activate', () => {
//   // on macOS it is common to re-create a window even after all windows have been closed
//   if (mainWindow === null) {
//     mainWindow = createMainWindow();
//     showWindow();
//   }
// });

app.on('quit', () => {
  light.reset();
});

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools();
  }

  light.connect();
  light.setColour('orange');

  mainWindow = createMainWindow();

  tray = new Tray(filled); // FIXME: Figure out how to move these to the resources dir
  tray.setPressedImage(inverted);
  tray.setTitle('00:00');
  tray.on('click', toggleWindow);
  tray.on('right-click', () => tray.popUpContextMenu(contextMenu));
});

app.dock.hide();

ipcMain.on('timer-started', (event, payload) => {
  clearTimeout(timeout);

  if (payload.isWork) {
    light.setColour('red');
    // tray.setImage(filled);
    return;
  }

  // tray.setImage(emptied);

  light.setColour('green');
});

ipcMain.on('timer-skipped', () => {
  light.setColour('orange');
});

ipcMain.on('timer-interrupted', () => {
  // Police lights
  light.setPattern('police');

  timeout = setTimeout(() => {
    // Orange
    light.setColour('orange');
  }, 5000);
});

ipcMain.on('timer-init', (event, payload) => {
  const { msTotal } = payload;
  setTitleCounter(msTotal);
});

ipcMain.on('timer-progress', (event, payload) => {
  const { msRemaining } = payload;
  setTitleCounter(msRemaining);
});

ipcMain.on('timer-stopped', (event, payload) => {
  light.setColour('orange');

  let title = 'It\'s time to get back to work!';
  let body = '🔥🔥🔥🔥🔥🔥';
  // tray.setImage(emptied);
  if (payload.isWork) {
    title = 'It\'s time for a break';
    body = '🎉🎉🎉🎉🎉🎉';
    // tray.setImage(filled);
  }

  const myNotification = new Notification({
    title,
    body,
    silent: true,
  });

  myNotification.show();
  myNotification.onclick = () => {
    console.log('should start the timer');
  };
});
