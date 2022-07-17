/** MultilineChart.js */
import { useMemo } from 'react';
import Line from './Line';
import useController, { ChartData } from './MultilineChart.controller';
import GridLine from './GridLine';
import Axis from './Axis';

interface Margins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface ChartDimensions {
  height: number;
  width: number;
  margins: Margins;
}

interface IChartProps {
  data: ChartData[];
  dimensions: ChartDimensions;
}

const MultilineChart = ({ data = [], dimensions }: IChartProps) => {
  const { width, height, margins } = dimensions;
  const svgWidth = useMemo(
    () => width + margins.left + margins.right,
    [width, margins]
  );
  const svgHeight = useMemo(
    () => height + margins.top + margins.bottom,
    [height, margins]
  );
  const { yTickFormat, xScale, xScaleFreq, yScale, yScaleGain, yScaleForAxis } =
    useController({ data, width, height });

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margins.left},${margins.top})`}>
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
        {data.map((e: ChartData) => (
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
          scale={yScaleGain}
          transform="translate(50, 10)"
          ticks={7}
          tickFormat={yTickFormat}
        />
        <Axis
          type="bottom"
          scale={xScaleFreq}
          transform={`translate(10, ${height - margins.bottom})`}
          ticks={7}
        />
      </g>
    </svg>
  );
};

export default MultilineChart;
