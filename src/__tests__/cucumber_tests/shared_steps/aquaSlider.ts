import { DefineStepFunction } from 'jest-cucumber';
import { Driver } from '__tests__/utils/webdriver';
import { FilterTypeEnum, FilterTypeToLabelMap } from 'common/constants';

export const givenBandCount = (
  given: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  given(/^there are (\d+) frequency bands$/, async (count: number) => {
    let sliderElems = await webdriver.driver.$('.mainContent').$$('.range');
    let sliderLength = sliderElems.length;
    const addButton = await webdriver.driver.$(
      '.mainContent [aria-label="Add Equalizer Slider"]'
    );
    const removeButton = await webdriver.driver.$(
      '.mainContent [aria-label="Remove Equalizer Slider"]'
    );

    while (sliderLength > count) {
      removeButton.click();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      do {
        sliderElems = await webdriver.driver.$('.mainContent').$$('.range');
      } while (sliderElems.length === sliderLength);
      sliderLength = sliderElems.length;
    }

    while (sliderLength < count) {
      addButton.click();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      do {
        sliderElems = await webdriver.driver.$('.mainContent').$$('.range');
      } while (sliderElems.length === sliderLength);
      sliderLength = sliderElems.length;
    }
  });
};

export const whenChangeBandCount = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(/^I click to (add|remove) a frequency band$/, async (action: string) => {
    const isAdd = action === 'add';

    if (isAdd) {
      const addButton = await webdriver.driver.$(
        '.mainContent [aria-label="Add Equalizer Slider"]'
      );
      addButton.click();
    } else {
      const removeButton = await webdriver.driver.$(
        '.mainContent [aria-label="Remove Equalizer Slider"]'
      );
      removeButton.click();
    }

    // wait 1000 ms for the action.
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
};

// ====================================

const setFrequencyGain = async (
  webdriver: { driver: Driver | undefined },
  frequency: number,
  position: string
) => {
  const element = await webdriver.driver.$(
    `.mainContent input[name="${frequency}-gain-range"]`
  );
  const coord = { x: 0, y: 0 };
  if (position === 'top') {
    coord.y = -100;
  } else if (position === 'bottom') {
    coord.y = 100;
  }
  element.dragAndDrop(coord);
  // wait 1000 ms for the action.
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export const whenSetFrequencyGain = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I set gain of slider of frequency (\d+)Hz to (top|bottom)$/,
    async (frequency: number, position: string) => {
      await setFrequencyGain(webdriver, frequency, position);
    }
  );
};

export const whenSetFrequencyGainWithText = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I set gain of slider of frequency (\d+)Hz to (\d+)db$/,
    async (frequency: number, gain: string) => {
      const inputElement = await webdriver.driver.$(
        `.mainContent label[for="${frequency}-gain-number"] input`
      );
      await inputElement.setValue(parseInt(gain, 10));
      await inputElement.keys('Tab');
      // wait 1000 ms for the action.
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  );
};

// ====================================

const setFrequencyQuality = async (
  webdriver: { driver: Driver | undefined },
  frequency: number,
  quality: string
) => {
  const inputElement = await webdriver.driver.$(
    `.mainContent label[for="${frequency}-quality"] input`
  );
  await inputElement.setValue(parseFloat(quality));
  await inputElement.keys('Tab');
  // wait 1000 ms for the action.
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export const givenFrequencyQuality = (
  given: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  given(
    /^the quality for the band with frequency (\d+)Hz is (\d+(?:.\d+)?)$/,
    async (frequency: number, quality: string) => {
      await setFrequencyQuality(webdriver, frequency, quality);
    }
  );
};

export const whenSetFrequencyQuality = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I set the quality to (\d+(?:.\d+)?) for the band with frequency (\d+)Hz$/,
    async (quality: string, frequency: number) => {
      await setFrequencyQuality(webdriver, frequency, quality);
    }
  );
};

export const whenSetFrequencyQualityUsingArrows = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I click on the (up|down) arrow for the quality for frequency (\d+)Hz (\d+) times$/,
    async (direction: string, frequency: number, times: number) => {
      const element = await webdriver.driver.$(
        `.mainContent label[for="${frequency}-quality"]`
      );
      const button = await element.$(`.arrow-${direction}`);
      for (let i = 0; i < times; i += 1) {
        await button.click();
        // wait 500 ms for the action. necessary
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  );
};

// ====================================

const setFrequencyFilterType = async (
  webdriver: { driver: Driver | undefined },
  frequency: number,
  filterType: string
) => {
  if (Object.values(FilterTypeEnum).findIndex((f) => f === filterType) === -1) {
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
};

export const givenFrequencyFilterType = (
  given: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  given(
    /^the filter type is (\w+) filter for the band with frequency (\d+)Hz$/,
    async (filterType: string, frequency: number) => {
      await setFrequencyFilterType(webdriver, frequency, filterType);
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
      await setFrequencyFilterType(webdriver, frequency, filterType);
    }
  );
};

// ====================================

const setBandFrequency = async (
  webdriver: { driver: Driver | undefined },
  bandIndex: number,
  frequency: number
) => {
  const inputElement = await webdriver.driver
    .$$('.band')
    [bandIndex - 1].$$('label')[0]
    .$('input');
  await inputElement.setValue(frequency);
  await inputElement.keys('Tab');
  // wait 1000 ms for the action.
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export const givenBandFrequency = (
  given: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  given(
    /^the frequency of band (\d+) is (\d+)Hz$/,
    async (bandIndex: number, frequency: number) => {
      await setBandFrequency(webdriver, bandIndex, frequency);
    }
  );
};

export const whenSetBandFrequency = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I set the frequency of band (\d+) to (\d+)Hz$/,
    async (bandIndex: number, frequency: number) => {
      await setBandFrequency(webdriver, bandIndex, frequency);
    }
  );
};

export const whenSetBandFrequencyUsingArrows = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I click on the (up|down) arrow of band (\d+) (\d+) times$/,
    async (direction: string, bandIndex: number, times: number) => {
      const button = await webdriver.driver
        .$$('.band')
        [bandIndex - 1].$(`.arrow-${direction}`);

      for (let i = 0; i < times; i += 1) {
        await button.click();
        // wait 500 ms for the action. necessary
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  );
};

// ====================================

const setPreampGain = async (
  webdriver: { driver: Driver | undefined },
  position: string
) => {
  const element = await webdriver.driver.$(
    '.sideBar input[name="Pre-Amplification Gain (dB)-range"]'
  );
  const coord = { x: 0, y: 0 };
  if (position === 'top') {
    coord.y = -100;
  } else if (position === 'bottom') {
    coord.y = 100;
  }
  element.dragAndDrop(coord);
  // wait 1000 ms for the action.
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

const setPreampGainNumber = async (
  webdriver: { driver: Driver | undefined },
  gain: number
) => {
  const inputElement = await webdriver.driver.$(
    '.sideBar input[name="Pre-Amplification Gain (dB)-number"]'
  );
  await inputElement.setValue(gain);
  await inputElement.keys('Tab');
  // wait 1000 ms for the action.
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export const givenPreampGain = (
  given: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  given(/^the preamp gain is (-?\d+)dB$/, async (gain: number) => {
    await setPreampGainNumber(webdriver, gain);
  });
};

export const whenSetPreampGain = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I set gain of the preamp slider to the (top|bottom)$/,
    async (position: string) => {
      await setPreampGain(webdriver, position);
    }
  );
};

export const whenSetPreampGainUsingArrows = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(
    /^I click on the (up|down) arrow for the preamp gain (\d+) times$/,
    async (direction: string, times: number) => {
      const button = await webdriver.driver
        .$('.sideBar')
        .$(`.arrow-${direction}`);

      for (let i = 0; i < times; i += 1) {
        await button.click();
        // wait 500 ms for the action. necessary
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  );
};
