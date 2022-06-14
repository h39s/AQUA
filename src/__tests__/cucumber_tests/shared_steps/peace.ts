// shared-steps.js

import { DefineStepFunction } from 'jest-cucumber';

export const givenPeaceIsInstalled = (given: DefineStepFunction) => {
  given('Peace is installed', () => {
    // TODO we can check peace is installed. find a way to install peace
  });
};

export const givenPeaceIsRunning = (given: DefineStepFunction) => {
  given('Peace is running', () => {
    // TODO we can check peace is running. find a way to start it
  });
};

export const thenPeaceFrequencyGain = (then: DefineStepFunction) => {
  then(
    /^Peace should show gain of (\d+)dB for frequency (\d+)Hz$/,
    (gain: number, frequency: number) => {
      console.log(`gain: ${gain}`);
      console.log(`frequency: ${frequency}`);
      // TODO ask peace for gain of a specific frequency
    }
  );
};
