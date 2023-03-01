/*
<AQUA: System-wide parametric audio equalizer interface>
Copyright (C) <2023>  <AQUA Dev Team>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
