import { DEFAULT_STATE } from 'common/constants';
import { computeAvgFreq, roundToPrecision } from 'common/utils';

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
    const filters = [...DEFAULT_STATE.filters];
    it('should compute average of first filter and min frequency for index 0', () => {
      expect(computeAvgFreq(filters, 0)).toBe(6);
    });

    it('should compute average of last filter and max frequency for last index', () => {
      expect(computeAvgFreq(filters, filters.length)).toBe(17889);
    });

    it('should compute average of neighbouring filters for intermediary indices', () => {
      // Compute harmonic mean between 64Hz and 125Hz
      expect(computeAvgFreq(filters, 2)).toBe(89);
      // Compute harmonic mean between 250Hz and 500Hz
      expect(computeAvgFreq(filters, 4)).toBe(354);
    });
  });
});
