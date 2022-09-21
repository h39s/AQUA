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
import {
  givenAquaIsRunning,
  givenAutoPreAmpState,
  givenEnabledState,
} from './shared_steps/aqua';
import {
  givenBandCount,
  whenSetBandFrequency,
  whenSetFrequencyGainWithText,
  whenSetFrequencyQuality,
} from './shared_steps/aquaSlider';
import {
  givenCanWriteToAquaConfig,
  givenEqualizerApoIsInstalled,
} from './shared_steps/equalizerApo';
import { thenPreAmpGain } from './shared_steps/config';
import { givenChartViewEnabledState } from './shared_steps/aquaGraph';

const chromeDriver = startChromeDriver();

const feature = loadFeature(
  './src/__tests__/cucumber_tests/features/auto_preamp.feature'
);
const webdriver: { driver: Driver } = { driver: undefined };

defineFeature(feature, (test) => {
  test('Apply auto pre-amp', async ({ given, when, then }) => {
    givenEqualizerApoIsInstalled(given);
    givenCanWriteToAquaConfig(given);
    givenAquaIsRunning(given, webdriver, chromeDriver);
    givenEnabledState(given, webdriver);
    givenChartViewEnabledState(given, webdriver);
    givenBandCount(given, webdriver);
    givenAutoPreAmpState(given, webdriver);

    whenSetBandFrequency(when, webdriver);
    whenSetBandFrequency(when, webdriver);
    whenSetFrequencyQuality(when, webdriver);
    whenSetFrequencyQuality(when, webdriver);
    whenSetFrequencyGainWithText(when, webdriver);
    whenSetFrequencyGainWithText(when, webdriver);
    thenPreAmpGain(then);
  }, 50000);
});

afterAll(() => {
  if (webdriver.driver) {
    webdriver.driver.deleteSession();
  }
  stopChromeDriver(chromeDriver);
});
