import { DefineStepFunction } from 'jest-cucumber';
import { Driver } from '__tests__/utils/webdriver';

export const whenSetFrequencyGain = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I set gain of slider of frequency (\d+)Hz to (top|middle|bottom)$/,
    async (frequency: number, position: string) => {
      console.log(`frequency: ${frequency}`);
      console.log(`position: ${position}`);
      const sliderElem = await webdriver.driver.$('#test');
      let endElem;
      if (position === 'top') {
        endElem = await webdriver.driver.$('#testup');
      } else if (position === 'bottom') {
        endElem = await webdriver.driver.$('#testdown');
      }
      sliderElem.dragAndDrop(endElem);
    }
  );
};

export const givenSetFrequencyGain = (
  given: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  given(
    /^I set gain of slider of frequency (\d+)Hz to (top|middle|bottom)$/,
    async (frequency: number, position: string) => {
      console.log(`frequency: ${frequency}`);
      console.log(`position: ${position}`);
      // TODO use webdriver io get slider position
      console.log(webdriver.driver);
    }
  );
};
