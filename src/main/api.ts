import { ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = string;

const sendMessage = (channel: Channels, args: unknown[]) => {
  ipcRenderer.send(channel, args);
};

const on = (channel: Channels, func: (...args: unknown[]) => void) => {
  const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
    func(...args);
  ipcRenderer.on(channel, subscription);

  return () => ipcRenderer.removeListener(channel, subscription);
};

const once = (channel: Channels, func: (...args: unknown[]) => void) => {
  ipcRenderer.once(channel, (_event, ...args) => func(...args));
};

const removeListener = (
  channel: Channels,
  func: (...args: unknown[]) => void
) => {
  ipcRenderer.removeListener(channel, (_event, ...args) => func(...args));
};

const closeApp = () => {
  ipcRenderer.send('quit-app', []);
};

export default {
  ipcRenderer: {
    sendMessage,
    on,
    once,
    removeListener,
    closeApp,
  },
};
