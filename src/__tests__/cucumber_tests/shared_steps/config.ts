import fs from 'fs';
import path from 'path';

import { AQUA_CONFIG_FILENAME } from 'main/flush';
import { DefineStepFunction } from 'jest-cucumber';
import { Driver } from '__tests__/utils/webdriver';
import { getConfigPath } from 'main/registry';

interface FilterSettings {
  on: boolean | null;
  type: string | null;
  freq: number;
  gain: number;
  quality: number;
}

interface AquaConfig {
  device: string | null;
  channel: string | null;
  preamp: number;
  filters: Record<number, FilterSettings>;
}

export const readAquaConfig = (configPath: string) => {
  const filePath = path.join(configPath, AQUA_CONFIG_FILENAME);
  console.log(filePath);
  const content = fs.readFileSync(filePath, {
    encoding: 'utf8',
  });
  const lines = content.split('\n\r');
  const state: AquaConfig = {
    device: null,
    channel: null,
    preamp: NaN,
    filters: {},
  };
  lines.forEach((line) => {
    if (line === '') {
      return;
    }
    if (line.indexOf('Device: ') !== -1) {
      state.device = line.substring('Device: '.length);
    } else if (line.indexOf('Channel: ') !== -1) {
      state.channel = line.substring('Channel: '.length);
    } else if (line.indexOf('PreAmp: ') !== -1) {
      state.preamp = parseFloat(
        line.substring('PreAamp: '.length, line.length - 2)
      );
      if (Number.isNaN(state.preamp)) {
        throw new Error(`Invalid preAmp line "${line}"`);
      }
    } else if (line.indexOf('Filter') !== -1) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) {
        throw new Error(`Invalid filter line "${line}"`);
      }
      const filterIndex = parseInt(
        line.substring('Filter'.length, colonIndex),
        10
      );
      if (Number.isNaN(filterIndex)) {
        throw new Error(`Invalid filter index in line "${line}"`);
      }
      const settings = line.substring(colonIndex + 2).split(' ');
      const parsedSetting: FilterSettings = {
        on: null,
        type: null,
        freq: NaN,
        gain: NaN,
        quality: NaN,
      };
      if (settings[0] === 'ON') {
        parsedSetting.on = true;
      } else if (settings[0] === 'OFF') {
        parsedSetting.on = false;
      } else {
        throw new Error(`Invalid filter status ${settings[0]}`);
      }

      // eslint-disable-next-line prefer-destructuring
      parsedSetting.type = settings[1];
      parsedSetting.freq = parseInt(settings[3], 10);
      if (Number.isNaN(parsedSetting.freq)) {
        throw new Error(`Invalid filter freq parsed "${settings[3]}"`);
      }
      parsedSetting.gain = parseFloat(settings[6]);
      if (Number.isNaN(parsedSetting.gain)) {
        throw new Error(`Invalid filter gain parsed "${settings[6]}"`);
      }
      parsedSetting.quality = parseFloat(settings[9]);
      if (Number.isNaN(parsedSetting.quality)) {
        throw new Error(`Invalid filter quality parsed "${settings[9]}"`);
      }
      state.filters[filterIndex] = parsedSetting;
    } else {
      throw new Error(`Invalid config line ${line}`);
    }
  });
  console.log(state);
  return state;
};

export const thenConfigFile = (then: DefineStepFunction) => {
  then(
    /^Aqua config file should be (empty|non-empty)$/,
    async (state: string) => {
      const isEmpty = state === 'empty';
      const configPath = await getConfigPath();
      const config = readAquaConfig(configPath);
      const matchObject = isEmpty
        ? {
            device: null,
            channel: null,
            preamp: NaN,
            filters: {},
          }
        : {
            device: expect.any(String),
            channel: expect.any(String),
            preamp: expect.any(Number),
            filters: expect.any(Object),
          };
      expect(config).toMatchObject(matchObject);
    }
  );
};

export const thenBandCount = (then: DefineStepFunction) => {
  then(
    /^Aqua config file should show (\d+) frequency bands$/,
    async (count: string) => {
      const configPath = await getConfigPath();
      const config = readAquaConfig(configPath);
      expect(Object.keys(config.filters).length).toBe(parseInt(count, 10));
    }
  );
};

export const thenFrequencyGain = (
  then: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  then(
    /^Aqua config file should show gain of (-?\d+)dB for frequency (\d+)Hz$/,
    async (gain: string, frequency: string) => {
      const sliderElems = await webdriver.driver.$('.mainContent').$$('.range');
      for (let i = 0; i < sliderElems.length; i += 1) {
        const element = await sliderElems[i].$('input');
        const name = await element.getAttribute('name');
        if (name === `${frequency}-gain-range`) {
          const configPath = await getConfigPath();
          const config = readAquaConfig(configPath);
          expect(config.filters[i].gain).toBe(parseInt(gain, 10));
          return;
        }
      }
      throw new Error(`${frequency} Hz gain band not found.`);
    }
  );
};

export const thenFrequencyQuality = (
  then: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  then(
    /^Aqua config file should show a quality of (\d+.?\d+) for the band with frequency (\d+)Hz$/,
    async (quality: string, frequency: string) => {
      const sliderElems = await webdriver.driver.$('.mainContent').$$('.range');
      for (let i = 0; i < sliderElems.length; i += 1) {
        const element = await sliderElems[i].$('input');
        const name = await element.getAttribute('name');
        if (name === `${frequency}-gain-range`) {
          const configPath = await getConfigPath();
          const config = readAquaConfig(configPath);
          expect(config.filters[i].quality).toBe(parseFloat(quality));
          return;
        }
      }
      throw new Error(`${frequency} Hz gain band not found.`);
    }
  );
};

export const thenFrequencyFilterType = (
  then: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  then(
    /^Aqua config file should show the (\w+) filter type for the band with frequency (\d+)Hz$/,
    async (filterType: string, frequency: string) => {
      const sliderElems = await webdriver.driver.$('.mainContent').$$('.range');
      for (let i = 0; i < sliderElems.length; i += 1) {
        const element = await sliderElems[i].$('input');
        const name = await element.getAttribute('name');
        if (name === `${frequency}-gain-range`) {
          const configPath = await getConfigPath();
          const config = readAquaConfig(configPath);
          expect(config.filters[i].type).toBe(filterType);
          return;
        }
      }
      throw new Error(`${frequency} Hz gain band not found.`);
    }
  );
};

export const thenBandFrequency = (then: DefineStepFunction) => {
  then(
    /^Aqua config file should show a frequency of (\d+)Hz for band (\d+)$/,
    async (frequency: string, bandIndex: number) => {
      const configPath = await getConfigPath();
      const config = readAquaConfig(configPath);
      expect(config.filters[bandIndex - 1].freq).toBe(parseInt(frequency, 10));
    }
  );
};

export const thenPreAmpGain = (then: DefineStepFunction) => {
  then(
    /^Aqua config should show a preamp gain of (-?\d+(\.\d+)?)dB$/,
    async (gain: string) => {
      const configPath = await getConfigPath();
      const config = readAquaConfig(configPath);
      expect(config.preamp).toBe(parseFloat(gain));
    }
  );
};
