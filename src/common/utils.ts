import {
  Filters,
  IFilter,
  MAX_FREQUENCY,
  MIN_FREQUENCY,
  RESERVED_FILE_NAMES_SET,
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

export const cloneFilters = (filters: Filters) => {
  const filtersClone: Filters = {};
  Object.entries(filters).forEach(([id, filter]) => {
    filtersClone[id] = filter;
  });
  return filtersClone;
};
