/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { uid } from 'uid';
import fs from 'fs';
import {
  checkConfigFile,
  fetchSettings,
  flush,
  save,
  updateConfig,
  savePreset,
  fetchPreset,
} from './flush';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { getConfigPath, isEqualizerAPOInstalled } from './registry';
import ChannelEnum from '../common/channels';
import {
  FilterTypeEnum,
  IState,
  IPreset,
  MAX_FREQUENCY,
  MAX_GAIN,
  MAX_NUM_FILTERS,
  MAX_QUALITY,
  MIN_FREQUENCY,
  MIN_GAIN,
  MIN_NUM_FILTERS,
  MIN_QUALITY,
  WINDOW_HEIGHT,
  WINDOW_HEIGHT_EXPANDED,
  WINDOW_WIDTH,
  PRESETS_DIR,
} from '../common/constants';
import { ErrorCode } from '../common/errors';
import { computeAvgFreq } from '../common/utils';
import { TSuccess, TError } from '../renderer/utils/equalizerApi';
import { sortHelper } from '../renderer/utils/utils';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const setWindowDimension = (isExpanded: boolean) => {
  if (mainWindow) {
    if (isExpanded) {
      mainWindow.setMaximumSize(WINDOW_WIDTH, WINDOW_HEIGHT_EXPANDED);
      mainWindow.setSize(WINDOW_WIDTH, WINDOW_HEIGHT_EXPANDED);
      mainWindow.setMinimumSize(WINDOW_WIDTH, WINDOW_HEIGHT_EXPANDED);
    } else {
      mainWindow.setMinimumSize(WINDOW_WIDTH, WINDOW_HEIGHT);
      mainWindow.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
      mainWindow.setMaximumSize(WINDOW_WIDTH, WINDOW_HEIGHT);
    }
  }
};

/** ----- Equalizer APO Implementation ----- */

// Load initial state from local state file
const state: IState = fetchSettings();
let configPath = '';

try {
  // create presets dir if it doesn't exist
  if (!fs.existsSync(PRESETS_DIR)) {
    fs.mkdirSync(PRESETS_DIR);
  }
} catch (e) {
  console.error('Failed to make presets directory!!');
  console.error(e);
  throw e;
}

const retryHelper = async (attempts: number, f: () => unknown) => {
  for (let i = 0; i < attempts; i += 1) {
    try {
      await f();
      return;
    } catch (e) {
      if (i === attempts) {
        throw new Error(`Failed to perform action after ${attempts} retrires`);
      }
      // TODO: maybe add a backoff here?
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }
  }
};

const handleError = (
  event: Electron.IpcMainEvent,
  channel: ChannelEnum | string,
  errorCode: ErrorCode
) => {
  const reply: TError = { errorCode };
  console.log(channel);
  event.reply(channel, reply);
};

const updateConfigPath = async (
  event: Electron.IpcMainEvent,
  channel: ChannelEnum | string
) => {
  try {
    // Retrive configPath assuming EqualizerAPO is installed
    configPath = await getConfigPath();
    // Overwrite the config file if necessary
    if (!checkConfigFile(configPath)) {
      updateConfig(configPath);
    }
  } catch (e) {
    handleError(event, channel, ErrorCode.CONFIG_NOT_FOUND);
    return false;
  }
  return true;
};

const handleUpdateHelper = async <T>(
  event: Electron.IpcMainEvent,
  channel: ChannelEnum | string,
  response: T
) => {
  // Check whether EqualizerAPO is installed every time a change is made
  const isInstalled = await isEqualizerAPOInstalled();
  if (!isInstalled) {
    handleError(event, channel, ErrorCode.EQUALIZER_APO_NOT_INSTALLED);
    return;
  }

  try {
    // Flush changes to EqualizerAPO with a retry in case several requests to write are occuring at the same time
    retryHelper(5, () => flush(state, configPath));
  } catch (e) {
    handleError(event, channel, ErrorCode.FAILURE);
    return;
  }

  // Return a success message of undefined
  const reply: TSuccess<T> = { result: response };
  event.reply(channel, reply);

  // Flush changes to our local state file after informing UI that the changes have been applied
  save(state);
};

const handleUpdate = async (
  event: Electron.IpcMainEvent,
  channel: ChannelEnum | string
) => {
  return handleUpdateHelper<void>(event, channel, undefined);
};

ipcMain.on(ChannelEnum.HEALTH_CHECK, async (event) => {
  const channel = ChannelEnum.HEALTH_CHECK;
  const res = await updateConfigPath(event, channel);
  if (res) {
    await handleUpdate(event, channel);
  }
});

ipcMain.on(ChannelEnum.LOAD_PRESET, async (event, arg) => {
  const channel = ChannelEnum.LOAD_PRESET;
  const presetName = arg[0];
  console.log(`Loading preset: ${presetName}`);

  // TODO: should we do some str checking here?
  try {
    const presetSettings: IPreset = fetchPreset(presetName);
    state.preAmp = presetSettings.preAmp;
    state.filters = presetSettings.filters;
    await handleUpdate(event, channel);
  } catch (ex) {
    console.log('Failed to read preset: ', presetName);
    console.log(ex);
    handleError(event, channel, ErrorCode.PRESET_FILE_ERROR);
  }
});

ipcMain.on(ChannelEnum.SAVE_PRESET, async (event, arg) => {
  const channel = ChannelEnum.SAVE_PRESET;
  const presetName = arg[0];
  console.log(`Saving preset: ${presetName}`);
  try {
    savePreset(presetName, {
      preAmp: state.preAmp,
      filters: state.filters,
    });
    await handleUpdate(event, channel);
  } catch (e) {
    handleError(event, channel, ErrorCode.PRESET_FILE_ERROR);
  }
});

ipcMain.on(ChannelEnum.DELETE_PRESET, async (event, arg) => {
  const channel = ChannelEnum.DELETE_PRESET;
  const presetName = arg[0];
  const pathToDelete = path.join(PRESETS_DIR, presetName);
  console.log(`Deleting preset: ${presetName} at location ${pathToDelete}`);
  try {
    fs.unlinkSync(pathToDelete);
    await handleUpdate(event, channel);
  } catch (e) {
    console.log('Failed to delete preset');
    console.log(e);
    handleError(event, channel, ErrorCode.PRESET_FILE_ERROR);
  }
});

ipcMain.on(ChannelEnum.GET_PRESET_FILE_LIST, async (event) => {
  const channel = ChannelEnum.GET_PRESET_FILE_LIST;
  console.log(`Getting Preset List`);

  try {
    const fileNames: string[] = fs.readdirSync(PRESETS_DIR);
    console.log(fileNames);
    const reply: TSuccess<string[]> = { result: fileNames };
    event.reply(channel, reply);
  } catch (e) {
    console.error('Failed to get filenames');
    console.error(e);
    handleError(event, channel, ErrorCode.PRESET_FILE_ERROR);
  }
});

ipcMain.on(ChannelEnum.GET_STATE, async (event) => {
  const channel = ChannelEnum.GET_STATE;
  const res = await updateConfigPath(event, channel);
  if (res) {
    const reply: TSuccess<IState> = { result: state };
    event.reply(channel, reply);
  } else {
    handleError(event, channel, ErrorCode.CONFIG_NOT_FOUND);
  }
});

ipcMain.on(ChannelEnum.GET_ENABLE, async (event) => {
  const reply: TSuccess<boolean> = { result: !!state.isEnabled };
  event.reply(ChannelEnum.GET_ENABLE, reply);
});

ipcMain.on(ChannelEnum.SET_ENABLE, async (event, arg) => {
  const value = parseInt(arg[0], 10) || 0;
  state.isEnabled = value !== 0;
  await handleUpdate(event, ChannelEnum.SET_ENABLE);
});

ipcMain.on(ChannelEnum.SET_AUTO_PREAMP, async (event, arg) => {
  // eslint-disable-next-line prefer-destructuring
  state.isAutoPreAmpOn = arg[0];
  await handleUpdate(event, ChannelEnum.SET_AUTO_PREAMP);
});

ipcMain.on(ChannelEnum.SET_GRAPH_VIEW, async (event, arg) => {
  // eslint-disable-next-line prefer-destructuring
  state.isGraphViewOn = arg[0];
  await handleUpdate(event, ChannelEnum.SET_GRAPH_VIEW);
});

ipcMain.on(ChannelEnum.GET_PREAMP, async (event) => {
  const reply: TSuccess<number> = { result: state.preAmp || 0 };
  event.reply(ChannelEnum.GET_PREAMP, reply);
});

ipcMain.on(ChannelEnum.SET_PREAMP, async (event, arg) => {
  const channel = ChannelEnum.SET_PREAMP;
  const gain = parseFloat(arg[0]) || 0;

  if (gain < MIN_GAIN || gain > MAX_GAIN) {
    handleError(event, channel, ErrorCode.INVALID_PARAMETER);
    return;
  }

  state.preAmp = gain;
  await handleUpdate(event, channel);
});

ipcMain.on(ChannelEnum.GET_FILTER_GAIN, async (event, arg) => {
  const channel = ChannelEnum.GET_FILTER_GAIN;
  const filterIndex = parseInt(arg[0], 10) || 0;

  // Filter index must be within the length of the filters array
  if (filterIndex < 0 || filterIndex >= state.filters.length) {
    handleError(event, channel + filterIndex, ErrorCode.INVALID_PARAMETER);
    return;
  }

  const reply: TSuccess<number> = {
    result: state.filters[filterIndex].gain || 0,
  };
  event.reply(channel + filterIndex, reply);
});

ipcMain.on(ChannelEnum.SET_FILTER_GAIN, async (event, arg) => {
  const channel = ChannelEnum.SET_FILTER_GAIN;
  const filterIndex = parseInt(arg[0], 10) || 0;
  const gain = parseFloat(arg[1]) || 0;

  // Filter index must be within the length of the filters array
  if (filterIndex < 0 || filterIndex >= state.filters.length) {
    handleError(event, channel + filterIndex, ErrorCode.INVALID_PARAMETER);
    return;
  }

  if (gain < MIN_GAIN || gain > MAX_GAIN) {
    handleError(event, channel + filterIndex, ErrorCode.INVALID_PARAMETER);
    return;
  }

  state.filters[filterIndex].gain = gain;
  await handleUpdate(event, channel + filterIndex);
});

ipcMain.on(ChannelEnum.GET_FILTER_FREQUENCY, async (event, arg) => {
  const channel = ChannelEnum.GET_FILTER_FREQUENCY;
  const filterIndex = parseInt(arg[0], 10) || 0;

  // Filter index must be within the length of the filters array
  if (filterIndex < 0 || filterIndex >= state.filters.length) {
    handleError(event, channel + filterIndex, ErrorCode.INVALID_PARAMETER);
    return;
  }

  const reply: TSuccess<number> = {
    result: state.filters[filterIndex].frequency || 10,
  };
  event.reply(channel + filterIndex, reply);
});

ipcMain.on(ChannelEnum.SET_FILTER_FREQUENCY, async (event, arg) => {
  const channel = ChannelEnum.SET_FILTER_FREQUENCY;
  const filterIndex = parseInt(arg[0], 10) || 0;
  const frequency = parseInt(arg[1], 10) || 0;

  // Filter index must be within the length of the filters array
  if (filterIndex < 0 || filterIndex >= state.filters.length) {
    handleError(event, channel + filterIndex, ErrorCode.INVALID_PARAMETER);
    return;
  }

  if (frequency < MIN_FREQUENCY || frequency > MAX_FREQUENCY) {
    handleError(event, channel + filterIndex, ErrorCode.INVALID_PARAMETER);
    return;
  }

  state.filters[filterIndex].frequency = frequency;
  state.filters.sort(sortHelper);
  await handleUpdate(event, channel + filterIndex);
});

ipcMain.on(ChannelEnum.GET_FILTER_QUALITY, async (event, arg) => {
  const channel = ChannelEnum.GET_FILTER_QUALITY;
  const filterIndex = parseInt(arg[0], 10) || 0;

  // Filter index must be within the length of the filters array
  if (filterIndex < 0 || filterIndex >= state.filters.length) {
    handleError(event, channel + filterIndex, ErrorCode.INVALID_PARAMETER);
    return;
  }

  const reply: TSuccess<number> = {
    result: state.filters[filterIndex].quality || 10,
  };
  event.reply(channel + filterIndex, reply);
});

ipcMain.on(ChannelEnum.SET_FILTER_QUALITY, async (event, arg) => {
  const channel = ChannelEnum.SET_FILTER_QUALITY;
  const filterIndex = parseInt(arg[0], 10) || 0;
  const quality = parseFloat(arg[1]) || 0;

  // Filter index must be within the length of the filters array
  if (filterIndex < 0 || filterIndex >= state.filters.length) {
    handleError(event, channel + filterIndex, ErrorCode.INVALID_PARAMETER);
    return;
  }

  if (quality < MIN_QUALITY || quality > MAX_QUALITY) {
    handleError(event, channel + filterIndex, ErrorCode.INVALID_PARAMETER);
    return;
  }

  state.filters[filterIndex].quality = quality;
  await handleUpdate(event, channel + filterIndex);
});

ipcMain.on(ChannelEnum.GET_FILTER_TYPE, async (event, arg) => {
  const channel = ChannelEnum.GET_FILTER_TYPE;
  const filterIndex = parseInt(arg[0], 10) || 0;

  // Filter index must be within the length of the filters array
  if (filterIndex < 0 || filterIndex >= state.filters.length) {
    handleError(event, channel + filterIndex, ErrorCode.INVALID_PARAMETER);
    return;
  }

  const reply: TSuccess<string> = {
    result: state.filters[filterIndex].type,
  };
  event.reply(channel + filterIndex, reply);
});

ipcMain.on(ChannelEnum.SET_FILTER_TYPE, async (event, arg) => {
  const channel = ChannelEnum.SET_FILTER_TYPE;
  const filterIndex = parseInt(arg[0], 10) || 0;
  const filterType = arg[1];

  // Filter index must be within the length of the filters array
  if (filterIndex < 0 || filterIndex >= state.filters.length) {
    handleError(event, channel + filterIndex, ErrorCode.INVALID_PARAMETER);
    return;
  }

  if (!Object.values(FilterTypeEnum).includes(filterType)) {
    handleError(event, channel + filterIndex, ErrorCode.INVALID_PARAMETER);
    return;
  }

  state.filters[filterIndex].type = filterType as FilterTypeEnum;
  await handleUpdate(event, channel + filterIndex);
});

ipcMain.on(ChannelEnum.GET_FILTER_COUNT, async (event) => {
  const reply: TSuccess<number> = {
    result: state.filters.length,
  };
  event.reply(ChannelEnum.GET_FILTER_COUNT, reply);
});

ipcMain.on(ChannelEnum.ADD_FILTER, async (event, arg) => {
  const channel = ChannelEnum.ADD_FILTER;
  const insertIndex: number = arg[0];

  // Cannot exceed the maximum number of filters
  if (state.filters.length === MAX_NUM_FILTERS) {
    handleError(event, channel, ErrorCode.INVALID_PARAMETER);
    return;
  }

  const frequency = computeAvgFreq(state.filters, insertIndex);
  const filterId = uid(8);
  state.filters
    .splice(insertIndex, 0, {
      id: filterId,
      frequency,
      gain: 0,
      quality: 1,
      type: FilterTypeEnum.PK,
    })
    .sort(sortHelper);
  await handleUpdateHelper(event, channel, filterId);
});

ipcMain.on(ChannelEnum.REMOVE_FILTER, async (event, arg) => {
  const channel = ChannelEnum.REMOVE_FILTER;
  const filterIndex: number = arg[0];

  // Filter index must be within the length of the filters array
  if (filterIndex < 0 || filterIndex >= state.filters.length) {
    handleError(event, channel, ErrorCode.INVALID_PARAMETER);
    return;
  }

  // Cannot fall below the minimum number of filters
  if (state.filters.length === MIN_NUM_FILTERS) {
    handleError(event, channel, ErrorCode.INVALID_PARAMETER);
    return;
  }

  state.filters.splice(filterIndex, 1);
  await handleUpdate(event, channel);
});

ipcMain.on(ChannelEnum.SET_WINDOW_SIZE, async (event, arg) => {
  const channel = ChannelEnum.SET_WINDOW_SIZE;
  setWindowDimension(arg[0]);

  const reply: TSuccess<void> = { result: undefined };
  event.reply(channel, reply);
});

ipcMain.on('quit-app', () => {
  app.quit();
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
    width: WINDOW_WIDTH,
    minWidth: WINDOW_WIDTH,
    maxWidth: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minHeight: WINDOW_HEIGHT,
    maxHeight: WINDOW_HEIGHT,
    icon: getAssetPath('icon.png'),
    resizable: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#1c313a',
      symbolColor: '#ffffff',
      height: 28,
    },
  });

  setWindowDimension(state.isGraphViewOn);

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

    if (isDebug) {
      // When in debug mode, show dev tools after the app loads
      mainWindow.webContents.openDevTools();
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
      if (mainWindow === null) {
        createMainWindow();
      }
    });
  })
  .catch(console.log);
