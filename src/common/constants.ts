import { clamp } from '../renderer/utils/utils';

/** ----- Application Constants ----- */

export const MAX_GAIN = 30;
export const MIN_GAIN = -30;

export const MAX_FREQUENCY = 20000; // Peace's actual limit is 22050
export const MIN_FREQUENCY = 10; // graph input's limit is 10 Hz
export const MAX_QUALITY = 999.999;
export const MIN_QUALITY = 0.001;

export const MAX_NUM_FILTERS = 20; // TODO: Investigate an appropriate value for this
export const MIN_NUM_FILTERS = 1;

// Need to use LPQ and HPQ to allow users to adjust quality for low/high pass filters
// Need to use LSC and HSC to allow users to adjust quality for low/high shelf filters
export enum FilterTypeEnum {
  PEAK = 'PK', // Peak ["PK",True,True] - Implemented
  LPQ = 'LPQ', // Low Pass ["LPQ",False,True] - Implemented
  HPQ = 'HPQ', // High Pass ["HPQ",False,True] - Implemented
  BP = 'BP', // Band Pass ["BP",False,True]
  NO = 'NO', // Notch ["NO",False,True] - Implemented
  AP = 'AP', // All Pass ["AP",False,True]
  LSC = 'LSC', // Low Shelf ["LSC",True,True] - Implemented
  HSC = 'HSC', // High Shelf ["HSC",True,True] - Implemented
  BWLP = 'BWLP', // Butterworth Low Pass ["BWLP",False,True]
  BWHP = 'BWHP', // Butterworth High Pass ["BWHP",False,True]
  LRLP = 'LRLP', // Linkwitz Riley Low Pass ["LRLP",False,True]
  LRHP = 'LRHP', // Linkwitz Riley High Pass["LRHP",False,True]
  LSCQ = 'LSCQ', // Low Shelf Q?? ["LSCQ",True,True]
  HSCQ = 'HSCQ', // High Shelf Q?? ["HSCQ",True,True]
}

/** ----- Peace specific ----- */

// Peace returns numerical values as unsigned integers
// This is the offset for the value -1000, used when fetching gain values
const OVERFLOW_OFFSET = 4294967296;

export const peaceGainOutputToDb = (result: number) => {
  // If gain is larger than MAX_GAIN, assume that Peace returned an unsigned negative number
  // If after adjusting for the unsigned number gives a positive value, default to -30
  if (result / 1000 > MAX_GAIN && (result - OVERFLOW_OFFSET) / 1000 > 0) {
    return MIN_GAIN;
  }

  const gain =
    result / 1000 > MAX_GAIN
      ? (result - OVERFLOW_OFFSET) / 1000 // Unsigned negative case
      : result / 1000; // Positive value case

  // Round up any lower gain values up to MIN_GAIN
  return Math.max(gain, MIN_GAIN);
};

export const peaceFrequencyOutputToNormal = (result: number) => {
  return clamp(result, MIN_FREQUENCY, MAX_FREQUENCY);
};

export const peaceQualityOutputToNormal = (result: number) => {
  return clamp(result, MIN_FREQUENCY, MAX_FREQUENCY) / 1000;
};
