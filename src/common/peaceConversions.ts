// Peace returns numerical values as unsigned integers
// This is the offset for the value -1000, used when fetching gain values
const OVERFLOW_OFFSET = 4294967296;

export const peaceGainOutputToDb = (result: number) => {
  const MAX_GAIN = 30;
  const MIN_GAIN = -30;

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
  const MAX_FREQUENCY = 22050;
  const MIN_FREQUENCY = 10;

  // If gain is larger than the MAX_FREQUENCY, assume that Peace returned an unsigned negative number
  // Since frequency shouldn't be negative, default to the MIN_FREQUENCY
  if (result > MAX_FREQUENCY) {
    return MIN_FREQUENCY;
  }

  // Round up any lower frequency values up to MIN_FREQUENCY
  return Math.max(result, MIN_FREQUENCY);
};
