import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import {
  FilterTypeEnum,
  getDefaultFilterWithId,
  IFilter,
  IPresetV2,
  MAX_NUM_FILTERS,
  PREAMP_REGEX,
  FILTER_REGEX,
  IFiltersMap,
} from '../common/constants';

let AUTOEQ_DIR = './resources/autoeq';
if (!app.isPackaged) {
  // dev mode means there is no resources folder and we must access our repo's autoeq folder.
  AUTOEQ_DIR = path.join(__dirname, '../../autoeq');
}

export const getAutoEqDeviceList = () => {
  return fs.readdirSync(AUTOEQ_DIR);
};

export const getAutoEqResponseList = (device: string) => {
  return fs.readdirSync(path.join(AUTOEQ_DIR, device));
};

export const getAutoEqPreset = (device: string, response: string) => {
  let preAmpParsed = 0;
  const filters: IFiltersMap = {};

  const filePath = path.join(AUTOEQ_DIR, device, response);
  const file = fs.readFileSync(filePath, 'utf8');

  file.split('\n').forEach((line, i) => {
    if (Object.keys(filters).length >= MAX_NUM_FILTERS) {
      // Ensure filters doesn't exceed filter count cap
      return;
    }
    const preampMatch = line.match(PREAMP_REGEX);
    if (preampMatch) {
      if (preampMatch.length !== 2) {
        throw new Error(
          `Preamp regex match error for AutoEQ file: ${filePath}`
        );
      }

      try {
        preAmpParsed = parseFloat(preampMatch[1]);
      } catch (err) {
        throw new Error(
          `Preamp float parse error for AutoEQ file: ${filePath}`
        );
      }
      return;
    }

    const filterMatch = line.match(FILTER_REGEX);
    if (filterMatch) {
      if (filterMatch.length !== 5) {
        throw new Error(
          `Filter regex match error on line ${i} for AutoEQ file: ${filePath}`
        );
      }

      const filter: IFilter = getDefaultFilterWithId();
      switch (filterMatch[1]) {
        case 'PK':
          filter.type = FilterTypeEnum.PK;
          break;
        case 'LS':
          filter.type = FilterTypeEnum.LSC;
          break;
        case 'HS':
          filter.type = FilterTypeEnum.HSC;
          break;
        default:
          throw new Error(
            `Filter type not (PK|LS|HS) on line ${i} for AutoEQ file: ${filePath}`
          );
      }
      try {
        filter.frequency = Math.min(parseInt(filterMatch[2], 10), 20000);
        filter.gain = parseFloat(filterMatch[3]);
        filter.quality = parseFloat(filterMatch[4]);
      } catch (err) {
        throw new Error(
          `Filter parameter parse error on line ${i} for AutoEQ file: ${filePath}`
        );
      }
      filters[filter.id] = filter;
    }
    // Ignore any lines which we do not recognize
  });

  const preset: IPresetV2 = {
    preAmp: preAmpParsed,
    filters,
  };

  return preset;
};
