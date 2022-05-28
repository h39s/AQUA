import api from 'main/api';

declare global {
  interface Window {
    electron: typeof api;
  }
}

export {};
