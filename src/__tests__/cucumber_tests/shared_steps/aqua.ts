import { DefineStepFunction } from 'jest-cucumber';
import getWebDriver, { Driver } from '__tests__/utils/webdriver';

export const givenAquaIsNotRunning = (given: DefineStepFunction) => {
  given('Aqua is not running', () => {
    // TODO find out how to check if aqua is not running. find a way to close aqua
  });
};

export const whenAquaIsLaunched = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when('Aqua is launched', async () => {
    webdriver.driver = await getWebDriver();
    // Wait 2 seconds for the app to launch and load screen
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });
};
