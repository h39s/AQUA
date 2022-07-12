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

export const startChromeDriver = () => {
  const cwd = path.join(__dirname, '../../../');
  const chromedriverPath = path.join(
    'node_modules/electron-chromedriver/bin',
    'chromedriver.exe'
  );
  return spawn(chromedriverPath, ['--port=9515'], {
    shell: true,
    cwd,
  });
};

export const stopChromeDriver = (
  chromeDriverProcess: ChildProcessWithoutNullStreams
) => {
  return chromeDriverProcess.kill(9);
};

export default async function getWebDriver(
  chromeDriverProcess: ChildProcessWithoutNullStreams
) {
  if (chromeDriverProcess === undefined) {
    throw new Error('chrome driver not started.');
  }
  return remote(options);
}

export type Driver = Awaited<ReturnType<typeof getWebDriver>>;
