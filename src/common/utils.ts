import { IFilter, MAX_FREQUENCY, MIN_FREQUENCY } from './constants';

export const roundToPrecision = (value: number, precision: number) => {
  const precisionFactor = 10 ** precision;
  return Math.round(value * precisionFactor) / precisionFactor;
};

export const computeAvgFreq = (filters: IFilter[], insertIndex: number) => {
  const lo =
    insertIndex === 0 ? MIN_FREQUENCY : filters[insertIndex - 1].frequency;
  const hi =
    insertIndex === filters.length
      ? MAX_FREQUENCY
      : filters[insertIndex].frequency;
  return roundToPrecision((lo + hi) / 2, 1);
};
