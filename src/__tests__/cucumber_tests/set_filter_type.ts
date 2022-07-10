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
import {
  givenFrequencyFilterType,
  whenSetFrequencyFilterType,
} from './shared_steps/aquaSlider';
import { thenFrequencyFilterType } from './shared_steps/config';
import {
  givenCanWriteToAquaConfig,
  givenEqualizerApoIsInstalled,
} from './shared_steps/equalizerApo';

const chromeDriver = startChromeDriver();

const feature = loadFeature(
  './src/__tests__/cucumber_tests/features/set_filter_type.feature'
);
const webdriver: { driver: Driver } = { driver: undefined };
// let configPath: string;

// beforeAll(async () => {
//   configPath = await getConfigPath();
//   console.log(configPath);
// });

defineFeature(feature, (test) => {
  test('Select a new filter type using a mouse', async ({
    given,
    when,
    then,
  }) => {
    givenEqualizerApoIsInstalled(given);
    givenCanWriteToAquaConfig(given);
    givenAquaIsRunning(given, webdriver, chromeDriver);
    givenFrequencyFilterType(given, webdriver);

    whenSetFrequencyFilterType(when, webdriver);
    thenFrequencyFilterType(then, webdriver);
  }, 30000);
});

afterAll(() => {
  if (webdriver.driver) {
    webdriver.driver.deleteSession();
  }
  stopChromeDriver(chromeDriver);
});
