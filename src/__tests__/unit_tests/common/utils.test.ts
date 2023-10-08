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

import {
  getDefaultState,
  IFiltersMap,
  RESERVED_FILE_NAMES_SET,
} from 'common/constants';
import {
  cloneFilters,
  computeAvgFreq,
  isFixedBandSizeEnumValue,
  isRestrictedPresetName,
  roundToPrecision,
} from 'common/utils';
import { sortHelper } from 'renderer/utils/utils';

describe('utils', () => {
  describe('roundToPrecision', () => {
    it('should round to two decimals', () => {
      expect(roundToPrecision(1.2345, 2)).toBe(1.23);
      expect(roundToPrecision(1.2, 2)).toBe(1.2);
      expect(roundToPrecision(9.8765, 2)).toBe(9.88);
    });

    it('should round to integer', () => {
      expect(roundToPrecision(1.2345, 0)).toBe(1);
      expect(roundToPrecision(101.81, 0)).toBe(102);
    });
  });

  describe('computeAvgFreq', () => {
    const filters = Object.values(getDefaultState().filters).sort(sortHelper);
    it('should compute average of first filter and min frequency for index 0', () => {
      expect(computeAvgFreq(null, filters[0])).toBe(6);
    });

    it('should compute average of last filter and max frequency for last index', () => {
      expect(computeAvgFreq(filters[filters.length - 1], null)).toBe(17889);
    });

    it('should compute average of neighbouring filters for intermediary indices', () => {
      // Compute harmonic mean between 64Hz and 125Hz
      expect(computeAvgFreq(filters[1], filters[2])).toBe(89);
      // Compute harmonic mean between 250Hz and 500Hz
      expect(computeAvgFreq(filters[3], filters[4])).toBe(354);
    });
  });

  describe('isRestrictedPresetName', () => {
    it('should return true for restricted names', () => {
      RESERVED_FILE_NAMES_SET.forEach((name) => {
        expect(isRestrictedPresetName(name)).toBe(true);
      });
    });

    it('should return false for non restricted names', () => {
      expect(isRestrictedPresetName('greatest preset of all time')).toBe(false);
    });
  });

  describe('cloneFilters', () => {
    const filtersMap: IFiltersMap = getDefaultState().filters;
    const copy = cloneFilters(filtersMap);
    it('should have same values', () => {
      Object.entries(filtersMap).forEach(([id, filter]) => {
        expect(copy[id]).toStrictEqual(filter);
      });
      Object.entries(copy).forEach(([id, filter]) => {
        expect(filtersMap[id]).toStrictEqual(filter);
      });
    });

    it('should have distinct IFilter objects', () => {
      Object.entries(filtersMap).forEach(([id, filter]) => {
        filter.id = `${id}*`;
      });
      Object.entries(copy).forEach(([id, filter]) => {
        expect(filter.id).toBe(`${id}`);
      });
    });
  });

  describe('isFixedBandSizeEnumValue', () => {
    it('should be true for valid fixed band size values', () => {
      expect(isFixedBandSizeEnumValue(6)).toBeTruthy();
      expect(isFixedBandSizeEnumValue(10)).toBeTruthy();
      expect(isFixedBandSizeEnumValue(15)).toBeTruthy();
      expect(isFixedBandSizeEnumValue(31)).toBeTruthy();
    });

    it('should be false for invalid fixed band size values', () => {
      expect(isFixedBandSizeEnumValue(1)).toBeFalsy();
      expect(isFixedBandSizeEnumValue(-1)).toBeFalsy();
      expect(isFixedBandSizeEnumValue(16)).toBeFalsy();
    });
  });
});
