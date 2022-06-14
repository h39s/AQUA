import webdriverio, { RemoteOptions } from 'webdriverio';

const options: RemoteOptions = {
  hostname: 'localhost', // Use localhost as chrome driver server
  port: 9515, // "9515" is the port opened by chrome driver.
  capabilities: {
    browserName: 'chrome',
    'goog:chromeOptions': {
      binary: '/Path-to-Your-App/electron', // Path to your Electron binary.
      args: [
        /* cli arguments */
      ], // Optional, perhaps 'app=' + /path/to/your/app/
    },
  },
};

export default async function getWebDriver() {
  return webdriverio.remote(options);
}
