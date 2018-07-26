import { installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'; // eslint-disable-line
import { ipcMain, app, protocol, Tray, Notification } from 'electron'; // eslint-disable-line
import * as path from 'path';
import createMainWindow, { positionWindowBelowTray } from './electron/window';
import isDevelopment from './electron/isDevelopment';
import zeroPad from './filters/zeroPad';
import minutesRemaining from './filters/minutesRemaining';
import secondsRemaining from './filters/secondsRemaining';
import contextMenu from './electron/contextMenu';
// const hid = require('node-hid');

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
let tray;

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

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools();
  }


  //console.log(hid.devices());

  mainWindow = createMainWindow();

  tray = new Tray(path.join(__static, 'icon.png'));
  tray.setTitle('00:00');
  tray.on('click', toggleWindow);
  tray.on('right-click', () => tray.popUpContextMenu(contextMenu));
});

app.dock.hide();

ipcMain.on('timer-init', (event, payload) => {
  const { msTotal } = payload;
  setTitleCounter(msTotal);
});

ipcMain.on('timer-progress', (event, payload) => {
  const { msRemaining } = payload;
  setTitleCounter(msRemaining);
});

ipcMain.on('timer-stopped', (event, payload) => {
  let title = 'It\'s time to get back to work!';
  let body = '🔥🔥🔥🔥🔥🔥';
  if (payload.isWork) {
    title = 'It\'s time for a break';
    body = '🎉🎉🎉🎉🎉🎉';
  }

  const myNotification = new Notification({
    title,
    body,
  });

  myNotification.show();
  myNotification.onclick = () => {
    console.log('should start the timer');
  };
});
