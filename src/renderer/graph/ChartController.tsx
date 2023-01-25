import { useMemo } from 'react';
import * as d3 from 'd3';
import { Color } from 'renderer/styles/color';

export const GRAPH_START = 10;
export const GRAPH_END = 25000;

export const INIT_ANIMATE_DURATION = 750;
export const GRAPH_ANIMATE_DURATION = 100;

export interface IMarginLike {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface IChartPointData {
  x: number;
  y: number;
}

export interface IChartLineDataPointsById {
  [id: string]: IChartPointData[];
}

export interface IChartCurveData {
  id: string;
  name: string;
  line: {
    color: Color;
    strokeWidth: number;
    points: IChartPointData[];
  };
  controlPoint?: IChartPointData;
}

interface IChartControllerProps {
  data: IChartCurveData[];
  width: number;
  height: number;
  padding: IMarginLike;
}

const useController = ({
  data,
  width,
  height,
  padding,
}: IChartControllerProps) => {
  const xMin = useMemo(
    () => d3.min(data, ({ line }) => d3.min(line.points, ({ x }) => x)) || 0,
    [data]
  );

  const xMax = useMemo(
    () => d3.max(data, ({ line }) => d3.max(line.points, ({ x }) => x)) || 0,
    [data]
  );

  const xScaleFreq = useMemo(
    () =>
      d3
        .scaleLog()
        .domain([GRAPH_START, GRAPH_END])
        .range([padding.left, width - padding.right]),
    [padding.left, padding.right, width]
  );

  const yMin = useMemo(
    () => d3.min(data, ({ line }) => d3.min(line.points, ({ y }) => y)) || 0,
    [data]
  );

  const yMax = useMemo(
    () => d3.max(data, ({ line }) => d3.max(line.points, ({ y }) => y)) || 0,
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

  const xTickFormat = (domainValue: d3.NumberValue) =>
    `${d3.format('~s')(domainValue)} Hz`;

  const yTickFormat = (domainValue: d3.NumberValue) =>
    `${domainValue > 0 ? '+' : ''}${d3.format('.2')(domainValue)} dB`;

  return {
    xTickFormat,
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
