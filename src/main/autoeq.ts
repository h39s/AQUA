/*
<AQUA: System-wide parametric audio equalizer interface>
Copyright (C) <2023>  <AQUA Dev Team>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
if (!!app && !app.isPackaged) {
  // dev mode means there is no resources folder and we must access our repo's autoeq folder.
  AUTOEQ_DIR = path.join(__dirname, '../../autoeq');
}

export const getAutoEqDeviceList = (autoeqDir: string = AUTOEQ_DIR) => {
  return fs.readdirSync(autoeqDir);
};

export const getAutoEqResponseList = (
  device: string,
  autoeqDir: string = AUTOEQ_DIR
) => {
  return fs.readdirSync(path.join(autoeqDir, device));
};

export const getAutoEqPreset = (
  device: string,
  response: string,
  autoeqDir: string = AUTOEQ_DIR
) => {
  let preAmpParsed = 0;
  const filters: IFiltersMap = {};

  const filePath = path.join(autoeqDir, device, response);
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
