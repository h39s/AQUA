/*
 * @jest-environment node
 */
// This is necessary so that jest and regedit works correctly in the test environment
// Specifically, functions getRandomValues and setImmediate become well defined.

import { loadFeature, defineFeature } from 'jest-cucumber';
import {
  Driver,
  startChromeDriver,
  stopChromeDriver,
} from '__tests__/utils/webdriver';
import { givenAquaIsRunning } from './shared_steps/aqua';
import { whenSetFrequencyGain } from './shared_steps/aquaSlider';
import { thenFrequencyGain } from './shared_steps/config';

const chromeDriver = startChromeDriver();

const feature = loadFeature(
  './src/__tests__/cucumber_tests/features/set_band_gain.feature'
);
const webdriver: { driver: Driver } = { driver: undefined };
// let configPath: string;

// beforeAll(async () => {
//   configPath = await getConfigPath();
//   console.log(configPath);
// });

defineFeature(feature, (test) => {
  test('Move slider to bottom', async ({ given, when, then }) => {
    givenAquaIsRunning(given, webdriver, chromeDriver);

    whenSetFrequencyGain(when, webdriver);
    thenFrequencyGain(then, webdriver);
  }, 30000);
});

afterAll(() => {
  if (webdriver.driver) {
    webdriver.driver.deleteSession();
  }
  stopChromeDriver(chromeDriver);
});
