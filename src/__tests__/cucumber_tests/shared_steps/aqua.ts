import { DefineStepFunction } from 'jest-cucumber';

export const givenAquaIsNotRunning = (given: DefineStepFunction) => {
  given('Aqua is not running', () => {
    // TODO find out how to check if aqua is not running. find a way to close aqua
  });
};

export const whenAquaIsLaunched = (when: DefineStepFunction) => {
  when('Aqua is launched', () => {
    // Use spectron to launch
  });
};
