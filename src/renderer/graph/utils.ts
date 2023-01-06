import { FilterTypeEnum, IFilter } from 'common/constants';
import { range } from 'renderer/utils/utils';
import {
  ChartDataPoint,
  ChartDataPointWithId,
  GRAPH_START,
  GRAPH_END,
} from './ChartController';

const SAMPLE_FREQUENCY = 96000;
const NUM_STEPS = 1000;

interface ITransferFuncCoeffs {
  b0: number;
  b1: number;
  b2: number;
  a1: number;
  a2: number;
}

const getTFCoefficients = (filter: IFilter) => {
  const {
    type: filterType,
    frequency,
    gain: dbGain,
    quality: userQuality,
  } = filter;

  // Handle these filter types differently:
  // 'peak', 'low-shelf-fixed', 'high-shelf-fixed', 'low-shelf-q', 'high-shelf-q', 'low-shelf-db', 'high-shelf-db'
  const specialFilters = new Set([
    FilterTypeEnum.PK,
    FilterTypeEnum.HSC,
    FilterTypeEnum.LSC,
  ]);
  const gainFactor = specialFilters.has(filterType) ? 40 : 20;
  const gain = 10 ** (dbGain / gainFactor);

  const omega = (2 * Math.PI * frequency) / SAMPLE_FREQUENCY;
  const cosine = Math.cos(omega);

  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let a0 = 0;
  let a1 = 0;
  let a2 = 0;
  let alpha = 0;
  let beta = 0;

  let quality = userQuality;

  const shelfFilters = new Set([FilterTypeEnum.HSC, FilterTypeEnum.LSC]);
  if (shelfFilters.has(filterType)) {
    // TODO: add additional shelf filter cases when /if we add them in
    // if (filterType in {'low-shelf-fixed', 'high-shelf-fixed'}){
    //     quality = 0.9
    // } else
    if (
      filterType === FilterTypeEnum.LSC ||
      filterType === FilterTypeEnum.HSC
    ) {
      quality /= 2;
      // } else if ( filterType in {'low-shelf-db', 'high-shelf-db'}){
      //     quality = 1 / (((1/(quality**2))-2)/(gain+1/gain)+1)
    }

    alpha =
      (Math.sin(omega) / 2) *
      Math.sqrt((gain + 1 / gain) * (1 / quality - 1) + 2);
    beta = 2 * Math.sqrt(gain) * alpha;

    // If filter is a low shelf {'low-shelf-fixed', 'low-shelf-q', 'low-shelf-db'}
    if (filterType === FilterTypeEnum.LSC) {
      b0 = gain * (gain + 1 - (gain - 1) * cosine + beta);
      b1 = 2 * gain * (gain - 1 - (gain + 1) * cosine);
      b2 = gain * (gain + 1 - (gain - 1) * cosine - beta);
      a0 = gain + 1 + (gain - 1) * cosine + beta;
      a1 = -2 * (gain - 1 + (gain + 1) * cosine);
      a2 = gain + 1 + (gain - 1) * cosine - beta;
      // If filter is a high shelf {'high-shelf-fixed', 'high-shelf-q', 'high-shelf-q'}
    } else if (filterType === FilterTypeEnum.HSC) {
      b0 = gain * (gain + 1 + (gain - 1) * cosine + beta);
      b1 = -2 * gain * (gain - 1 + (gain + 1) * cosine);
      b2 = gain * (gain + 1 + (gain - 1) * cosine - beta);
      a0 = gain + 1 - (gain - 1) * cosine + beta;
      a1 = 2 * (gain - 1 - (gain + 1) * cosine);
      a2 = gain + 1 - (gain - 1) * cosine - beta;
    }
  } else {
    alpha = Math.sin(omega) / (2 * quality);

    if (filterType === FilterTypeEnum.PK) {
      b0 = 1 + alpha * gain;
      b1 = -2 * cosine;
      b2 = 1 - alpha * gain;
      a0 = 1 + alpha / gain;
      a1 = -2 * cosine;
      a2 = 1 - alpha / gain;
      // TODO: Add these filters back in when we re-enable the filter types
      // } else if ( filterType === FilterTypeEnum.NO){
      //     b0 = 1
      //     b1 = -2*cosine
      //     b2 = 1
      //     a0 = 1+alpha
      //     a1 = -2*cosine
      //     a2 = 1-alpha
      // } else if (filterType === FilterTypeEnum.LPQ){
      //     b0 = (1-cosine)/2
      //     b1 = 1-cosine
      //     b2 = (1-cosine)/2
      //     a0 = 1+alpha;
      //     a1 = -2*cosine;
      //     a2 = 1-alpha;
      // } else if (filterType === FilterTypeEnum.HPQ){
      //     b0 = (1+cosine)/2
      //     b1 = -(1+cosine)
      //     b2 = (1+cosine) /2
      //     a0 = 1+alpha
      //     a1 = -2*cosine
      //     a2 = 1-alpha
      // } else if (filterType === FilterTypeEnum.BP){
      //     b0 = alpha
      //     b1 = 0
      //     b2 = -alpha
      //     a0 = 1+alpha
      //     a1 = -2*cosine
      //     a2 = 1-alpha
      // } else if ( filterType === FilterTypeEnum.AP){
      //     b0 = 1-alpha
      //     b1 = -2*cosine
      //     b2 = 1+alpha
      //     a0 = 1+alpha
      //     a1 = -2*cosine
      //     a2 = 1-alpha
    }
  }

  b0 /= a0;
  b1 /= a0;
  b2 /= a0;
  a1 /= a0;
  a2 /= a0;

  return { b0, b1, b2, a1, a2 } as ITransferFuncCoeffs;
};

const gainAtFrequency = (f: number, c: ITransferFuncCoeffs) => {
  const { b0, b1, b2, a1, a2 } = c;
  const phi = Math.sin((2 * Math.PI * f) / (2 * SAMPLE_FREQUENCY)) ** 2;
  const numerator =
    (b0 + b1 + b2) ** 2 -
    4 * (b0 * b1 + 4 * b0 * b2 + b1 * b2) * phi +
    16 * b0 * b2 * phi * phi;
  const denominator =
    (1 + a1 + a2) ** 2 -
    4 * (a1 + 4 * a2 + a1 * a2) * phi +
    16 * a2 * phi * phi;

  return 10 * Math.log10(numerator / denominator);
};

interface IFreqData {
  id: string;
  frequency: number;
}

export const getSpecificPoints = (
  filter: IFilter,
  freqData: IFreqData[]
): ChartDataPointWithId[] => {
  const tf = getTFCoefficients(filter);

  const points: ChartDataPointWithId[] = freqData.map(({ id, frequency }) => {
    return { x: frequency, y: gainAtFrequency(frequency, tf), id };
  });

  return points;
};

export const getFilterPoints = (
  filter: IFilter,
  freqData: IFreqData[]
): {
  data: ChartDataPoint[];
  points: ChartDataPointWithId[];
} => {
  const tf = getTFCoefficients(filter);

  const logStart = Math.log10(GRAPH_START);
  const logEnd = Math.log10(GRAPH_END);
  const step = (logEnd - logStart) / NUM_STEPS;

  // TODO: consider hard coding frequencies maybe
  const sampleFrequencies = range(logStart, logEnd + step, step).map(
    (p) => 10 ** p
  );
  const data: ChartDataPoint[] = sampleFrequencies.map((f) => {
    return { x: f, y: 0 };
  });

  for (let i = 0; i < sampleFrequencies.length; i += 1) {
    const freqFilterGain = gainAtFrequency(sampleFrequencies[i], tf);
    data[i].y = freqFilterGain;
  }

  const points: ChartDataPointWithId[] = freqData.map(({ id, frequency }) => {
    return { x: frequency, y: gainAtFrequency(frequency, tf), id };
  });

  return { data, points };
};

export const getTotalPoints = (
  preAmp: number,
  filterLines: ChartDataPoint[][],
  freqPoints: ChartDataPointWithId[][]
) => {
  const logStart = Math.log10(GRAPH_START);
  const logEnd = Math.log10(GRAPH_END);
  const step = (logEnd - logStart) / NUM_STEPS;

  // Get sampling frequencies for rendering the line
  const sampleFrequencies = range(logStart, logEnd + step, step).map(
    (p) => 10 ** p
  );
  const frequencies = freqPoints[0].map(({ x }) => x);
  const data: ChartDataPoint[] = sampleFrequencies.map((f) => {
    return { x: f, y: 0 };
  });

  for (let i = 0; i < sampleFrequencies.length; i += 1) {
    // Add fixed preamp gain for each sample point
    data[i].y = preAmp;
    for (let j = 0; j < filterLines.length; j += 1) {
      // Add frequency gain obtained from each filter
      data[i].y += filterLines[j][i].y;
    }
  }

  const points: ChartDataPointWithId[] = frequencies.map((f) => {
    return { x: f, y: 0, id: '' };
  });

  for (let i = 0; i < freqPoints[0].length; i += 1) {
    // Add fixed preamp gain for each sample point
    points[i].id = freqPoints[0][i].id;
    points[i].y = preAmp;
    for (let j = 0; j < freqPoints.length; j += 1) {
      points[i].y += freqPoints[j][i].y;
    }
  }

  return { data, points };
};

export const getDataPoints = (preAmp: number, filters: IFilter[]) => {
  const tfs = filters.map((f) => getTFCoefficients(f));
  const filterGains: number[][] = Array(tfs.length).fill(
    Array(NUM_STEPS + 1).fill(0)
  );
  const totalGains: number[] = Array(NUM_STEPS + 1).fill(0);

  const logStart = Math.log10(GRAPH_START);
  const logEnd = Math.log10(GRAPH_END);
  const step = (logEnd - logStart) / NUM_STEPS;
  const frequencies = range(logStart, logEnd + step, step).map((p) => 10 ** p);
  const data: ChartDataPoint[] = frequencies.map((f) => {
    return { x: f, y: 0 };
  });

  for (let i = 0; i < frequencies.length; i += 1) {
    totalGains[i] = preAmp;
    for (let j = 0; j < tfs.length; j += 1) {
      const freqFilterGain = gainAtFrequency(frequencies[i], tfs[j]);
      filterGains[j][i] = freqFilterGain;
      totalGains[i] += freqFilterGain;
    }
    data[i].y = totalGains[i];
  }

  return data;
};
