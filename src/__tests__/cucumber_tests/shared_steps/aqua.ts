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

import { ChildProcessWithoutNullStreams } from 'child_process';
import { DefineStepFunction } from 'jest-cucumber';
import getWebDriver, { Driver } from '__tests__/utils/webdriver';

export const givenAquaIsNotRunning = (given: DefineStepFunction) => {
  given('Aqua is not running', () => {
    // TODO find out how to check if aqua is not running. find a way to close aqua
  });
};

export const givenAquaIsRunning = (
  given: DefineStepFunction,
  webdriver: { driver: Driver | undefined },
  chromeDriverProcess: ChildProcessWithoutNullStreams
) => {
  given('Aqua is running', async () => {
    if (webdriver.driver === undefined) {
      webdriver.driver = await getWebDriver(chromeDriverProcess);
      // Wait 10 seconds for the app to launch and load screen
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  });
};

export const whenAquaIsLaunched = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined },
  chromeDriverProcess: ChildProcessWithoutNullStreams
) => {
  when('Aqua is launched', async () => {
    webdriver.driver = await getWebDriver(chromeDriverProcess);
    // Wait 10 seconds for the app to launch and load screen
    await new Promise((resolve) => setTimeout(resolve, 10000));
  });
};

export const givenEnabledState = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^Aqua equalizer state is (enabled|disabled)$/,
    async (state: string) => {
      const desiredState = state === 'enabled';
      const equalizerSwitch = await webdriver.driver.$(
        '.side-bar label[class="switch"][for="equalizerEnabler"]'
      );

      const switchOn = await equalizerSwitch
        .$('[aria-checked="true"]')
        .isExisting();
      if ((desiredState && !switchOn) || (!desiredState && switchOn)) {
        equalizerSwitch.click();
        // wait 1000 ms for the action.
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  );
};

export const whenSetEnabledState = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(/^I toggle the equalizer state$/, async () => {
    const equalizerSwitch = await webdriver.driver.$('.side-bar .switch');
    equalizerSwitch.click();
    // wait 1000 ms for the action.
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
};

export const givenAutoPreAmpState = (
  given: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  given(/^auto pre-amp is (on|off)$/, async (state: string) => {
    const desiredState = state === 'on';
    const equalizerSwitch = await webdriver.driver.$(
      '.side-bar label[class="switch"][for="autoPreAmpEnabler"]'
    );

    const switchOn = await equalizerSwitch
      .$('[aria-checked="true"]')
      .isExisting();
    if ((desiredState && !switchOn) || (!desiredState && switchOn)) {
      equalizerSwitch.click();
      // wait 1000 ms for the action.
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
};
