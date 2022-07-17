/** MultilineChart.controller.js */
import { useMemo } from 'react';
import * as d3 from 'd3';

interface DataElement {
  x: any;
  y: any;
}

export interface ChartData {
  name: string;
  color: string; // #ffffff
  items: DataElement[];
}

interface IChartControllerProps {
  data: ChartData[];
  width: number;
  height: number;
}

const useController = ({ data, width, height }: IChartControllerProps) => {
  const xMin = useMemo(
    () => d3.min(data, ({ items }) => d3.min(items, ({ x }) => x)),
    [data]
  );

  const xMax = useMemo(
    () => d3.max(data, ({ items }) => d3.max(items, ({ x }) => x)),
    [data]
  );

  const xScale = useMemo(
    () => d3.scaleTime().domain([xMin, xMax]).range([0, width]),
    [xMin, xMax, width]
  );

  const xScaleFreq = useMemo(
    () =>
      d3
        .scaleLog()
        .domain([20, 20000])
        .range([width * 0.1, 0.9 * width]),
    [width]
  );

  const yMin = useMemo(
    () => d3.min(data, ({ items }) => d3.min(items, ({ y }) => y)),
    [data]
  );

  const yMax = useMemo(
    () => d3.max(data, ({ items }) => d3.max(items, ({ y }) => y)),
    [data]
  );

  const yScale = useMemo(() => {
    const indention = (yMax - yMin) * 0.5;
    return d3
      .scaleLinear()
      .domain([yMin - indention, yMax + indention])
      .range([height, 0]);
  }, [height, yMin, yMax]);

  const yScaleGain = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([-30, 30])
        .range([0.8 * height, 0]),
    [height]
  );

  const yScaleForAxis = useMemo(
    () => d3.scaleBand().domain([yMin, yMax]).range([height, 0]),
    [height, yMin, yMax]
  );

  const yTickFormat = (domainValue: d3.NumberValue, _index: number) =>
    `${domainValue > 0 ? '+' : ''}${d3.format('.2')(domainValue)}dB`;

  return {
    yTickFormat,
    xScale,
    xScaleFreq,
    yScale,
    yScaleGain,
    yScaleForAxis,
    xMin,
    xMax,
    yMin,
    yMax,
  };
};

export default useController;
