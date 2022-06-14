import { DefineStepFunction } from 'jest-cucumber';

export const whenSetFrequencyGain = (when: DefineStepFunction) => {
  when(
    /^I set gain of slider of frequency (\d+)Hz to (top|middle|bottom)$/,
    (frequency: number, position: string) => {
      console.log(`frequency: ${frequency}`);
      console.log(`position: ${position}`);
      // TODO use webdriver io to move slider
    }
  );
};

export const givenSetFrequencyGain = (given: DefineStepFunction) => {
  given(
    /^I set gain of slider of frequency (\d+)Hz to (top|middle|bottom)$/,
    (frequency: number, position: string) => {
      console.log(`frequency: ${frequency}`);
      console.log(`position: ${position}`);
      // TODO use webdriver io get slider position
    }
  );
};
