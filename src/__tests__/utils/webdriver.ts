import { remote, RemoteOptions } from 'webdriverio';
import path from 'path';

import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

const options: RemoteOptions = {
  hostname: 'localhost', // Use localhost as chrome driver server
  port: 9515, // "9515" is the port opened by chrome driver.
  capabilities: {
    browserName: 'chrome',
    'goog:chromeOptions': {
      binary: path.join(
        process.env.USERPROFILE ? process.env.USERPROFILE : '',
        'AppData/Local/Programs/aqua/AQUA.exe'
      ),
      args: [],
    },
  },
};

let chromeDriverProcess: ChildProcessWithoutNullStreams | undefined;

export const startChromeDriver = () => {
  if (chromeDriverProcess !== undefined) {
    throw new Error('chromedriver already started.');
  }
  chromeDriverProcess = spawn('chromedriver.exe', ['--port=9515'], {
    shell: true,
    cwd: path.join(
      __dirname,
      '../../../node_modules/electron-chromedriver/bin'
    ),
  });
  return true;
};

export const stopChromeDriver = () => {
  if (chromeDriverProcess === undefined) {
    return true;
  }

  return chromeDriverProcess.kill(9);
};

export default async function getWebDriver() {
  // if (chromeDriverProcess === undefined) {
  //   throw new Error('chrome driver not started.');
  // }
  return remote(options);
}

export type Driver = Awaited<ReturnType<typeof getWebDriver>>;
