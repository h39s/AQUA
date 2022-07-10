import { DefineStepFunction } from 'jest-cucumber';
import { Driver } from '__tests__/utils/webdriver';
import { FilterTypeEnum, FilterTypeToLabelMap } from 'common/constants';

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

export const whenSetFrequencyGain = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I set gain of slider of frequency (\d+)Hz to (top|bottom)$/,
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

export const givenFrequencyQuality = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^the quality for the band with frequency (\d+)Hz is (\d+(.\d+)?)$/,
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

export const whenSetFrequencyQuality = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I set the quality to (\d+(.\d+)?) for the band with frequency (\d+)Hz$/,
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

export const whenSetFrequencyQualityUsingArrows = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I click on the (up|down) arrow for the quality for frequency (\d+)Hz (\d+) times$/,
    async (direction: string, frequency: number, times: string) => {
      const sliderElems = await webdriver.driver.$('.mainContent').$$('.range');
      for (let i = 0; i < sliderElems.length; i += 1) {
        const element = await sliderElems[i].$('input');
        const name = await element.getAttribute('name');
        if (name === `${frequency}-gain-range`) {
          console.log(direction);
          console.log(times);
          // const coord = { x: 0, y: 0 };
          // if (position === 'top') {
          //   coord.y = -100;
          // } else if (position === 'bottom') {
          //   coord.y = 100;
          // }
          // element.dragAndDrop(coord);
          // // wait 1000 ms for the action.
          // await new Promise((resolve) => setTimeout(resolve, 1000));
          // return;
        }
      }
      throw new Error(`${frequency} Hz gain band not found.`);
    }
  );
};

export const givenFrequencyFilterType = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^the filter type is (\w+) filter for the band with frequency (\d+)Hz$/,
    async (filterType: string, frequency: number) => {
      if (
        Object.values(FilterTypeEnum).findIndex((f) => f === filterType) === -1
      ) {
        throw new Error(`Invalid filter type ${filterType}.`);
      }
      const filterTypeAsEnum = filterType as FilterTypeEnum;
      const dropdownElem = await webdriver.driver
        .$('.mainContent')
        .$(`.dropdown [aria-label="${frequency}-filter-type"]`);

      expect(dropdownElem).not.toBeNull();
      dropdownElem.click();
      // wait 1000 ms for the action.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Need to reselect from driver since these elements didn't exist before clicking on the dropdown
      const filterElement = await webdriver.driver.$(
        `.dropdown li[aria-label="${FilterTypeToLabelMap[filterTypeAsEnum]}"]`
      );
      expect(filterElement).not.toBeNull();
      filterElement.click();
      // wait 1000 ms for the action.
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  );
};

export const whenSetFrequencyFilterType = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I set the filter type to (\w+) filter for the band with frequency (\d+)Hz$/,
    async (filterType: string, frequency: number) => {
      if (
        Object.values(FilterTypeEnum).findIndex((f) => f === filterType) === -1
      ) {
        throw new Error(`Invalid filter type ${filterType}.`);
      }
      const filterTypeAsEnum = filterType as FilterTypeEnum;
      const dropdownElem = await webdriver.driver
        .$('.mainContent')
        .$(`.dropdown [aria-label="${frequency}-filter-type"]`);

      expect(dropdownElem).not.toBeNull();
      dropdownElem.click();
      // wait 1000 ms for the action.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Need to reselect from driver since these elements didn't exist before clicking on the dropdown
      const filterElement = await webdriver.driver.$(
        `.dropdown li[aria-label="${FilterTypeToLabelMap[filterTypeAsEnum]}"]`
      );
      expect(filterElement).not.toBeNull();
      filterElement.click();
      // wait 1000 ms for the action.
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  );
};
