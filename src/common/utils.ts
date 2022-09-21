import { IFilter, MAX_FREQUENCY, MIN_FREQUENCY } from './constants';

export const roundToPrecision = (value: number, precision: number) => {
  const precisionFactor = 10 ** precision;
  return Math.round(value * precisionFactor) / precisionFactor;
};

export const computeAvgFreq = (filters: IFilter[], id: string) => {
  const findIndex = filters.findIndex((f) => f.id === id);
  const insertIndex =
    findIndex === -1 ? filters.length : filters.findIndex((f) => f.id === id);
  const lo =
    insertIndex === 0 ? MIN_FREQUENCY : filters[insertIndex - 1].frequency;
  const hi =
    insertIndex === filters.length
      ? MAX_FREQUENCY
      : filters[insertIndex].frequency;
  const exponent = (Math.log10(lo) + Math.log10(hi)) / 2;
  return roundToPrecision(10 ** exponent, 0);
};
