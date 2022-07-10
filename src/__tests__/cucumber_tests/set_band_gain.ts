import { loadFeature, defineFeature } from 'jest-cucumber';
import getRandomValuesPolyPony from 'get-random-values-polypony'; // Need this to fix jest-cucumber's reliance on uuid's getRandomValues
import {
  Driver,
  startChromeDriver,
  stopChromeDriver,
} from '__tests__/utils/webdriver';
import { getConfigPath } from 'main/registry';
import { givenAquaIsRunning } from './shared_steps/aqua';
import { whenSetFrequencyGain } from './shared_steps/aquaSlider';
import { thenFrequencyGain } from './shared_steps/config';

// shim the getRandomValues function used in uuid which is used by jest-cucumber
// so that it works in electron environment.
getRandomValuesPolyPony.polyfill();
const chromeDriver = startChromeDriver();

const feature = loadFeature(
  './src/__tests__/cucumber_tests/features/set_band_gain.feature'
);
const webdriver: { driver: Driver } = { driver: undefined };
let configPath: string;

beforeAll(async () => {
  configPath = await getConfigPath();
});

defineFeature(feature, (test) => {
  test('Move slider to bottom', async ({ given, when, then }) => {
    givenAquaIsRunning(given, webdriver, chromeDriver);

    whenSetFrequencyGain(when, webdriver);
    thenFrequencyGain(then, webdriver, configPath);
  }, 30000);
});

afterAll(() => {
  if (webdriver.driver) {
    webdriver.driver.deleteSession();
  }
  stopChromeDriver(chromeDriver);
});
