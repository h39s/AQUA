import { DefineStepFunction } from 'jest-cucumber';
import { Driver } from '__tests__/utils/webdriver';

export const whenSetFrequencyGain = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I set gain of slider of frequency (\d+)Hz to (top|middle|bottom)$/,
    async (frequency: number, position: string) => {
      const sliderElems = await webdriver.driver.$('.mainContent').$$('.range');
      for (let i = 0; i < sliderElems.length; i += 1) {
        const element = await sliderElems[i].$('input');
        const name = await element.getAttribute('name');
        if (name === `${frequency}-gain-range`) {
          const coord = { x: 0, y: 0 };
          if (position === 'top') {
            coord.y = -100;
          } else if (position === 'bottom') {
            coord.y = 100;
          }
          element.dragAndDrop(coord);
          // wait 1000 ms for the action.
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return;
        }
      }
      throw new Error(`${frequency} Hz gain band not found.`);
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
