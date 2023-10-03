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
  IFiltersMap,
  IFilter,
  MAX_FREQUENCY,
  MIN_FREQUENCY,
  RESERVED_FILE_NAMES_SET,
  FixedBandSizeEnum,
} from './constants';

export const roundToPrecision = (value: number, precision: number) => {
  const precisionFactor = 10 ** precision;
  return Math.round(value * precisionFactor) / precisionFactor;
};

export const computeAvgFreq = (
  leftFilter: IFilter | null,
  rightFilter: IFilter | null
) => {
  const lo = leftFilter ? leftFilter.frequency : MIN_FREQUENCY;
  const hi = rightFilter ? rightFilter.frequency : MAX_FREQUENCY;
  const exponent = (Math.log10(lo) + Math.log10(hi)) / 2;
  return roundToPrecision(10 ** exponent, 0);
};

// Even with the case sensitivity setting set on a folder, Windows will not support
// files of any case with a name equal to one in the reserved file names set. I
// have manually confirmed this.
export const isRestrictedPresetName = (newName: string) =>
  RESERVED_FILE_NAMES_SET.has(newName.toUpperCase());

export const cloneFilters = (filters: IFiltersMap) => {
  const filtersClone: IFiltersMap = {};
  Object.entries(filters).forEach(([id, filter]) => {
    filtersClone[id] = { ...filter };
  });
  return filtersClone;
};

export const isFixedBandSizeEnumValue = (value: number) =>
  Object.values(FixedBandSizeEnum)
    .filter((key) => !Number.isNaN(Number(key)))
    .some((enumValue) => enumValue === value);
