import { loadFeature, defineFeature } from 'jest-cucumber';
import getRandomValuesPolyPony from 'get-random-values-polypony'; // Need this to fix jest-cucumber's reliance on uuid's getRandomValues
import {
  Driver,
  startChromeDriver,
  stopChromeDriver,
} from '__tests__/utils/webdriver';
import { givenAquaIsNotRunning, whenAquaIsLaunched } from './shared_steps/aqua';
import { whenSetFrequencyGain } from './shared_steps/aquaSlider';
import {
  givenPeaceIsRunning,
  givenPeaceIsInstalled,
  thenPeaceFrequencyGain,
} from './shared_steps/peace';

// shim the getRandomValues function used in uuid which is used by jest-cucumber
// so that it works in electron environment.
getRandomValuesPolyPony.polyfill();
const chromeDriver = startChromeDriver();

const feature = loadFeature(
  './src/__tests__/cucumber_tests/features/set_band_gain.feature'
);
const webdriver: { driver: Driver } = { driver: undefined };

defineFeature(feature, (test) => {
  test('Move slider to bottom', async ({ given, when, then }) => {
    givenPeaceIsInstalled(given);
    givenPeaceIsRunning(given);
    givenAquaIsNotRunning(given);

    whenAquaIsLaunched(when, webdriver, chromeDriver);
    whenSetFrequencyGain(when, webdriver);

    thenPeaceFrequencyGain(then, webdriver);
  }, 30000);
});

afterAll(() => {
  if (webdriver.driver) {
    webdriver.driver.deleteSession();
  }
  stopChromeDriver(chromeDriver);
});
