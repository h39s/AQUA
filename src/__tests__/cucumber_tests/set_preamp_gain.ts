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
  givenPreampGain,
  whenSetPreampGain,
  whenSetPreampGainUsingArrows,
} from './shared_steps/aquaSlider';
import { thenPreampGain } from './shared_steps/config';
import {
  givenCanWriteToAquaConfig,
  givenEqualizerApoIsInstalled,
} from './shared_steps/equalizerApo';

const chromeDriver = startChromeDriver();

const feature = loadFeature(
  './src/__tests__/cucumber_tests/features/set_preamp_gain.feature'
);
const webdriver: { driver: Driver } = { driver: undefined };

defineFeature(feature, (test) => {
  test('Set preamp gain using the slider', async ({ given, when, then }) => {
    givenEqualizerApoIsInstalled(given);
    givenCanWriteToAquaConfig(given);
    givenAquaIsRunning(given, webdriver, chromeDriver);
    givenEnabledState(given, webdriver);

    whenSetPreampGain(when, webdriver);
    thenPreampGain(then);
  }, 30000);

  test('Set preamp gain using the arrows', async ({ given, when, then }) => {
    givenEqualizerApoIsInstalled(given);
    givenCanWriteToAquaConfig(given);
    givenAquaIsRunning(given, webdriver, chromeDriver);
    givenPreampGain(given, webdriver);
    givenEnabledState(given, webdriver);

    whenSetPreampGainUsingArrows(when, webdriver);
    thenPreampGain(then);
  }, 30000);
});

afterAll(() => {
  if (webdriver.driver) {
    webdriver.driver.deleteSession();
  }
  stopChromeDriver(chromeDriver);
});
