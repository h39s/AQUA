import { createRoot } from 'react-dom/client';
import App from './App';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.on('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg, 'once');
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
