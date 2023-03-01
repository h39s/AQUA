/*
<AQUA: System-wide parametric audio equalizer interface>
Copyright (C) <2023>  <AQUA Dev Team>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
