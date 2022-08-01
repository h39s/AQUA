/* eslint-disable @typescript-eslint/no-unused-vars */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../../renderer/App';
import { Channels } from '../../main/api';

describe('App', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'electron', {
      get: () => ({
        ipcRenderer: {
          sendMessage: (_channel: Channels, _args: unknown[]) => {},
          on: (_channel: Channels, _func: (...args: unknown[]) => void) => {},
          once: (_channel: Channels, _func: (...args: unknown[]) => void) => {},
          removeListener: (
            _channel: Channels,
            _func: (...args: unknown[]) => void
          ) => {},
          closeApp: () => {},
        },
      }),
    });
  });

  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
