/** MultilineChart.js */
import React, { useEffect } from 'react';
import Line from './Line';
import useController from './MultilineChart.controller';
import GridLine from './GridLine';
import Axis from './Axis';

interface Props {
  data: any;
  dimensions: any;
}

const MultilineChart = ({ data = [], dimensions = {} }: Props) => {
  const { width, height, margin = {} } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const controller = useController({ data, width, height });
  const { yTickFormat, xScale, yScale, yScaleForAxis } = controller;

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <GridLine
          type="vertical"
          scale={xScale}
          ticks={5}
          size={height}
          transform={`translate(0, ${height})`}
        />
        <GridLine
          type="horizontal"
          scale={yScaleForAxis}
          ticks={2}
          size={width}
        />
        <GridLine
          type="horizontal"
          scale={yScale}
          ticks={1}
          size={width}
          disableAnimation
        />
        {data.map((e: any) => (
          <Line
            key={e.name}
            data={e.items}
            xScale={xScale}
            yScale={yScale}
            color={e.color}
          />
        ))}
        <Axis
          type="left"
          scale={yScaleForAxis}
          transform="translate(50, -10)"
          ticks={5}
          tickFormat={yTickFormat}
        />
        <Axis
          type="bottom"
          scale={xScale}
          transform={`translate(10, ${height - height / 6})`}
          ticks={5}
        />
      </g>
    </svg>
  );
};

export default MultilineChart;
