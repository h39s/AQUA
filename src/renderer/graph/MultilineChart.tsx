/** MultilineChart.js */
import { useMemo } from 'react';
import Axis from './Axis';
import Curve from './Curve';
import GridLine from './GridLine';
import useController, { ChartData } from './MultilineChart.controller';

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
  const { yTickFormat, xScale, xScaleFreq, yScale, yScaleGain } = useController(
    { data, width, height }
  );

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margins.left},${margins.top})`}>
        <GridLine
          type="vertical"
          scale={xScaleFreq}
          tickValues={[20, 100, 200, 1000, 2000, 10000, 20000]}
          size={0.9 * height}
          transform={`translate(10, ${0.9 * height})`}
        />
        <GridLine
          type="vertical"
          scale={xScaleFreq}
          tickValues={[
            40, 60, 80, 120, 140, 160, 180, 400, 600, 800, 1200, 1400, 1600,
            1800, 4000, 6000, 8000, 12000, 14000, 16000, 18000,
          ]}
          size={0.85 * height}
          transform={`translate(10, ${0.875 * height})`}
        />
        <GridLine
          type="horizontal"
          scale={yScaleGain}
          tickValues={[-30, -20, -10, 10, 20, 30]}
          size={width}
          transform="translate(50, 10)"
        />
        <GridLine
          type="horizontal"
          scale={yScaleGain}
          tickValues={[0]}
          size={width}
          color="#F7844F"
          transform="translate(50, 10)"
        />
        {data.map((e: ChartData) => (
          <Curve
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
