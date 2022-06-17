import { DefineStepFunction } from 'jest-cucumber';
import getWebDriver, { Driver } from '__tests__/utils/webdriver';

// let webdriver: Driver;

export const givenAquaIsNotRunning = (given: DefineStepFunction) => {
  given('Aqua is not running', () => {
    // TODO find out how to check if aqua is not running. find a way to close aqua
  });
};

export const whenAquaIsLaunched = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when('Aqua is launched', () => {
    webdriver.driver = getWebDriver();
    console.log(webdriver);
  });
};

// export const getDriver = () => {
//   console.log(webdriver);
//   return webdriver;
// };
