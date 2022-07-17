import { useMemo } from 'react';
import * as d3 from 'd3';

export interface ChartDataPoint {
  x: number;
  y: number;
}

export interface ChartData {
  name: string;
  color: string; // #ffffff
  items: ChartDataPoint[];
}

interface IChartControllerProps {
  data: ChartData[];
  width: number;
  height: number;
}

const useController = ({ data, width, height }: IChartControllerProps) => {
  const xMin = useMemo(
    () => d3.min(data, ({ items }) => d3.min(items, ({ x }) => x)) || 0,
    [data]
  );

  const xMax = useMemo(
    () => d3.max(data, ({ items }) => d3.max(items, ({ x }) => x)) || 0,
    [data]
  );

  const xScaleFreq = useMemo(
    () =>
      d3
        .scaleLog()
        .domain([20, 20000])
        .range([width * 0.1, 0.95 * width]),
    [width]
  );

  const yMin = useMemo(
    () => d3.min(data, ({ items }) => d3.min(items, ({ y }) => y)) || 0,
    [data]
  );

  const yMax = useMemo(
    () => d3.max(data, ({ items }) => d3.max(items, ({ y }) => y)) || 0,
    [data]
  );

  const yScaleGain = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([-30, 30])
        .range([0.8 * height, 0.05 * height]),
    [height]
  );

  const yTickFormat = (domainValue: d3.NumberValue) =>
    `${domainValue > 0 ? '+' : ''}${d3.format('.2')(domainValue)}dB`;

  return {
    yTickFormat,
    xScaleFreq,
    yScaleGain,
    xMin,
    xMax,
    yMin,
    yMax,
  };
};

export default useController;
