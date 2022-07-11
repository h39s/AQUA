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
import { givenAquaIsRunning, givenEnabledState } from './shared_steps/aqua';
import {
  givenBandFrequency,
  whenSetBandFrequency,
  whenSetBandFrequencyUsingArrows,
} from './shared_steps/aquaSlider';
import { thenBandFrequency } from './shared_steps/config';
import {
  givenCanWriteToAquaConfig,
  givenEqualizerApoIsInstalled,
} from './shared_steps/equalizerApo';

const chromeDriver = startChromeDriver();

const feature = loadFeature(
  './src/__tests__/cucumber_tests/features/set_band_frequency.feature'
);
const webdriver: { driver: Driver } = { driver: undefined };

defineFeature(feature, (test) => {
  test('Set a new frequency using the input field', async ({
    given,
    when,
    then,
  }) => {
    givenEqualizerApoIsInstalled(given);
    givenCanWriteToAquaConfig(given);
    givenAquaIsRunning(given, webdriver, chromeDriver);
    givenEnabledState(given, webdriver);

    whenSetBandFrequency(when, webdriver);
    thenBandFrequency(then);
  }, 30000);

  test('Set a new frequency using the arrow buttons', async ({
    given,
    when,
    then,
  }) => {
    givenEqualizerApoIsInstalled(given);
    givenCanWriteToAquaConfig(given);
    givenAquaIsRunning(given, webdriver, chromeDriver);
    givenBandFrequency(given, webdriver);
    givenEnabledState(given, webdriver);

    whenSetBandFrequencyUsingArrows(when, webdriver);
    thenBandFrequency(then);
  }, 30000);
});

afterAll(() => {
  if (webdriver.driver) {
    webdriver.driver.deleteSession();
  }
  stopChromeDriver(chromeDriver);
});
