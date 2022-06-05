/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { U } from 'win32-api';
import { InternalEvent } from './api';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import registry from './registry';
import { errors } from '../common/errors';

// See win32 documentation https://docs.microsoft.com/en-us/windows/win32/winmsg/wm-app
const WM_APP = 0x8000;
const user32 = U.load(); // load all apis defined in lib/{dll}/api from user32.dll

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const peaceTitle = 'Peace window messages'; // "Peter's Equalizer APO Configuration Extension (Peace) 1.6.1.2\0"
const peaceLpszWindow = Buffer.from(peaceTitle, 'ucs2');

ipcMain.on('peace', async (event, arg) => {
  const peaceInstalled = await registry.isPeaceInstalled();
  if (!peaceInstalled) {
    event.reply('peace', { error: errors[1] });
  }

  const peaceHWnd = user32.FindWindowExW(0, 0, null, peaceLpszWindow);

  const foundPeace =
    (typeof peaceHWnd === 'number' && peaceHWnd > 0) ||
    (typeof peaceHWnd === 'bigint' && peaceHWnd > 0) ||
    (typeof peaceHWnd === 'string' && peaceHWnd.length > 0);

  if (!foundPeace) {
    event.reply('peace', { error: errors[2] });
  }

  const messageCode = parseInt(arg[0], 10) || 0;
  const wParam = parseInt(arg[1], 10) || 0;
  const lParam = parseInt(arg[2], 10) || 0;

  // Send message to Peace
  try {
    const res = user32.SendMessageW(
      peaceHWnd,
      WM_APP + messageCode,
      wParam,
      lParam
    );
    if (res === 4294967295) {
      event.reply('peace', { error: errors[3] });
    }
    event.reply('peace', { result: res });
  } catch (e) {
    console.log(e);
    event.reply('peace', { error: { short_error: e, solution: '' } });
  }
});

ipcMain.on('internal', (_event, arg) => {
  const id = arg[0] as number;
  switch (id) {
    case InternalEvent.CLOSE:
      app.quit();
      break;
    default:
      break;
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createMainWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createMainWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createMainWindow();
    });
  })
  .catch(console.log);
