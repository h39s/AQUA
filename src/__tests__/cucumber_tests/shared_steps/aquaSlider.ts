import { DefineStepFunction } from 'jest-cucumber';
import { Driver } from '__tests__/utils/webdriver';

export const whenSetFrequencyGain = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I set gain of slider of frequency (\d+)Hz to (top|middle|bottom)$/,
    async (frequency: number, position: string) => {
      const sliderElem = await webdriver.driver.$(
        `[name="${frequency}-range"]`
      );
      const coord = { x: 0, y: 0 };
      if (position === 'top') {
        coord.y = -100;
      } else if (position === 'bottom') {
        coord.y = 100;
      }
      sliderElem.dragAndDrop(coord);
      // wait 500 ms for the action.
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
