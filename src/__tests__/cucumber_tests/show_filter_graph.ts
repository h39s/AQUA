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
  givenBandCount,
  whenSetBandFrequency,
  whenSetFrequencyFilterType,
  whenSetFrequencyGain,
  whenSetFrequencyQuality,
} from './shared_steps/aquaSlider';
import {
  givenChartViewEnabledState,
  thenGraph,
} from './shared_steps/aquaGraph';
import {
  givenCanWriteToAquaConfig,
  givenEqualizerApoIsInstalled,
} from './shared_steps/equalizerApo';

const chromeDriver = startChromeDriver();

const feature = loadFeature(
  './src/__tests__/cucumber_tests/features/show_filter_graph.feature'
);
const webdriver: { driver: Driver } = { driver: undefined };

defineFeature(feature, (test) => {
  test('Apply a single peak filter', async ({ given, when, then }) => {
    givenEqualizerApoIsInstalled(given);
    givenCanWriteToAquaConfig(given);
    givenAquaIsRunning(given, webdriver, chromeDriver);
    givenBandCount(given, webdriver);
    givenChartViewEnabledState(given, webdriver);

    whenSetBandFrequency(when, webdriver);
    whenSetFrequencyGain(when, webdriver);
    whenSetFrequencyQuality(when, webdriver);
    whenSetFrequencyFilterType(when, webdriver);
    thenGraph(then, webdriver);
  }, 50000);
});

afterAll(() => {
  if (webdriver.driver) {
    webdriver.driver.deleteSession();
  }
  stopChromeDriver(chromeDriver);
});
