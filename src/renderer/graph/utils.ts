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

import { FilterTypeEnum, IFilter } from 'common/constants';
import { range } from 'renderer/utils/utils';
import {
  IChartPointData,
  IChartLineDataPointsById,
  GRAPH_START,
  GRAPH_END,
} from './ChartController';

const SAMPLE_FREQUENCY = 96000;
const NUM_STEPS = 1000;

const logStart = Math.log10(GRAPH_START);
const logEnd = Math.log10(GRAPH_END);
const step = (logEnd - logStart) / NUM_STEPS;
const SAMPLE_FREQUENCIES = range(logStart, logEnd + step, step).map(
  (p) => 10 ** p
);

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

// Get curve info for the preAmplification
export const getPreAmpLine = (preAmp: number): IChartPointData[] =>
  SAMPLE_FREQUENCIES.map((f) => {
    return { x: f, y: preAmp };
  });

// Get curve and point info for individual filters
export const getFilterLineData = (filter: IFilter): IChartPointData[] => {
  const tf = getTFCoefficients(filter);

  const data: IChartPointData[] = SAMPLE_FREQUENCIES.map((f) => {
    return { x: f, y: 0 };
  });

  for (let i = 0; i < SAMPLE_FREQUENCIES.length; i += 1) {
    const freqFilterGain = gainAtFrequency(SAMPLE_FREQUENCIES[i], tf);
    data[i].y = freqFilterGain;
  }

  return data;
};

// Get total curve info from filter and point data
export const getCombinedLineData = (
  preAmp: number,
  filterLines: IChartLineDataPointsById
) => {
  const data: IChartPointData[] = SAMPLE_FREQUENCIES.map((f) => {
    return { x: f, y: 0 };
  });

  for (let i = 0; i < SAMPLE_FREQUENCIES.length; i += 1) {
    // Add fixed preamp gain for each sample point
    data[i].y = preAmp;
    Object.values(filterLines).forEach((points) => {
      // Add frequency gain obtained from each filter
      data[i].y += points[i].y;
    });
  }

  return data;
};
