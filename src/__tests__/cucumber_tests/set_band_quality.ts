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
  givenFrequencyQuality,
  whenSetFrequencyQuality,
  whenSetFrequencyQualityUsingArrows,
} from './shared_steps/aquaSlider';
import { thenFrequencyQuality } from './shared_steps/config';
import {
  givenCanWriteToAquaConfig,
  givenEqualizerApoIsInstalled,
} from './shared_steps/equalizerApo';

const chromeDriver = startChromeDriver();

const feature = loadFeature(
  './src/__tests__/cucumber_tests/features/set_band_quality.feature'
);
const webdriver: { driver: Driver } = { driver: undefined };

defineFeature(feature, (test) => {
  test('Select a new quality using the input field', async ({
    given,
    when,
    then,
  }) => {
    givenEqualizerApoIsInstalled(given);
    givenCanWriteToAquaConfig(given);
    givenAquaIsRunning(given, webdriver, chromeDriver);
    givenBandFrequency(given, webdriver);
    givenEnabledState(given, webdriver);

    whenSetFrequencyQuality(when, webdriver);
    thenFrequencyQuality(then, webdriver);
  }, 30000);

  test('Select a new quality using the arrow buttons', async ({
    given,
    when,
    then,
  }) => {
    givenEqualizerApoIsInstalled(given);
    givenCanWriteToAquaConfig(given);
    givenAquaIsRunning(given, webdriver, chromeDriver);
    givenBandFrequency(given, webdriver);
    givenFrequencyQuality(given, webdriver);
    givenEnabledState(given, webdriver);

    whenSetFrequencyQualityUsingArrows(when, webdriver);
    thenFrequencyQuality(then, webdriver);
  }, 30000);
});

afterAll(() => {
  if (webdriver.driver) {
    webdriver.driver.deleteSession();
  }
  stopChromeDriver(chromeDriver);
});
