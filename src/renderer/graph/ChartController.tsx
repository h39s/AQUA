import { useMemo } from 'react';
import * as d3 from 'd3';

export interface ChartDataPoint {
  x: number;
  y: number;
}

export interface Padding {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface ChartData {
  name: string;
  color: string; // #ffffff, white, rgba(255, 255, 255, 0.5)
  items: ChartDataPoint[];
}

interface IChartControllerProps {
  data: ChartData[];
  width: number;
  height: number;
  padding: Padding;
}

const useController = ({
  data,
  width,
  height,
  padding,
}: IChartControllerProps) => {
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
        .domain([10, 25000])
        .range([padding.left, width - padding.right]),
    [padding.left, padding.right, width]
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
        .domain([-40, 40])
        .range([height - padding.bottom, padding.top]),
    [height, padding.bottom, padding.top]
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
