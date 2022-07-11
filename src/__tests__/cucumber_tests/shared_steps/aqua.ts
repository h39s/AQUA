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
      const equalizerSwitch = await webdriver.driver.$('.sideBar .switch');

      const enabledInput = await equalizerSwitch.$('[aria-checked="1"]');
      if (
        (desiredState && enabledInput === null) ||
        (!desiredState && enabledInput !== null)
      ) {
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
    const equalizerSwitch = await webdriver.driver.$('.sideBar .switch');
    equalizerSwitch.click();
    // wait 1000 ms for the action.
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
};
