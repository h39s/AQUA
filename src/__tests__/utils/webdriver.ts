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
        // __dirname,
        // '..',
        // '..',
        // '..',
        // 'release',
        // 'build',
        // 'AQUA 0.0.2.exe'
        'C:/Users/milkr/AppData/Local/Programs/aqua/AQUA.exe'
      ), // Path to your Electron binary.
      args: [
        /* cli arguments */
      ], // Optional, perhaps 'app=' + /path/to/your/app/
    },
  },
};

let chromeDriverProcess: ChildProcessWithoutNullStreams | undefined;

export const startChromeDriver = () => {
  if (chromeDriverProcess !== undefined) {
    throw new Error('chromedriver already started.');
  }
  console.log(__dirname);
  chromeDriverProcess = spawn('ls', ['--url-base=wd/hub', '--port=9515']);
  console.log(chromeDriverProcess);
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

export type Driver = ReturnType<typeof getWebDriver>;
