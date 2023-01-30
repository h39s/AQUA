import {
  IFilter,
  MAX_FREQUENCY,
  MIN_FREQUENCY,
  RESERVED_FILE_NAMES_SET,
} from './constants';

export const roundToPrecision = (value: number, precision: number) => {
  const precisionFactor = 10 ** precision;
  return Math.round(value * precisionFactor) / precisionFactor;
};

export const computeAvgFreq = (filters: IFilter[], index: number) => {
  const lo = index === 0 ? MIN_FREQUENCY : filters[index - 1].frequency;
  const hi =
    index === filters.length ? MAX_FREQUENCY : filters[index].frequency;
  const exponent = (Math.log10(lo) + Math.log10(hi)) / 2;
  return roundToPrecision(10 ** exponent, 0);
};

// Even with the case sensitivity setting set on a folder, Windows will not support
// files of any case with a name equal to one in the reserved file names set. I
// have manually confirmed this.
export const isRestrictedPresetName = (newName: string) =>
  RESERVED_FILE_NAMES_SET.has(newName.toUpperCase());

export const isDuplicatePresetName = (
  newName: string,
  existingNames: string[]
) =>
  existingNames.some(
    (oldValue) => newName.toLowerCase() === oldValue.toLowerCase()
  );
