import { useMemo } from 'react';
import Axis from './Axis';
import Curve, { AnimationOptionsEnum } from './Curve';
import GridLine from './GridLine';
import useController, { ChartData } from './ChartController';

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

const Chart = ({ data = [], dimensions }: IChartProps) => {
  const { width, height, margins } = dimensions;
  const svgWidth = useMemo(
    () => width - margins.left - margins.right,
    [width, margins]
  );
  const svgHeight = useMemo(
    () => height - margins.top - margins.bottom,
    [height, margins]
  );

  const padding = {
    left: 50,
    top: 0,
    right: 0,
    bottom: 30,
  };

  const { xTickFormat, yTickFormat, xScaleFreq, yScaleGain } = useController({
    data,
    width: svgWidth,
    height: svgHeight,
    padding,
  });

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{
        margin: `${dimensions.margins.top}px ${dimensions.margins.right}px ${dimensions.margins.bottom}px ${dimensions.margins.left}px`,
      }}
    >
      <GridLine
        type="vertical"
        scale={xScaleFreq}
        tickValues={[20, 100, 200, 1000, 2000, 10000, 20000]}
        size={svgHeight - padding.bottom}
        transform={`translate(0, ${svgHeight - padding.bottom})`}
      />
      <GridLine
        type="vertical"
        scale={xScaleFreq}
        tickValues={[
          40, 60, 80, 120, 140, 160, 180, 400, 600, 800, 1200, 1400, 1600, 1800,
          4000, 6000, 8000, 12000, 14000, 16000, 18000,
        ]}
        size={svgHeight - padding.bottom - 20}
        transform={`translate(0, ${svgHeight - padding.bottom - 10})`}
      />
      <GridLine
        type="horizontal"
        scale={yScaleGain}
        tickValues={[-30, -20, -10, 10, 20, 30]}
        size={svgWidth - padding.left}
        transform={`translate(${padding.left}, 0)`}
      />
      <GridLine
        type="horizontal"
        scale={yScaleGain}
        tickValues={[0]}
        size={width - margins.left - margins.right}
        color="#F7844F"
        transform={`translate(${padding.left}, 0)`}
      />
      {data.map((e: ChartData) => (
        <Curve
          key={e.name}
          name={e.name}
          data={e.items}
          xScale={xScaleFreq}
          yScale={yScaleGain}
          color={e.color}
          animation={AnimationOptionsEnum.LEFT}
        />
      ))}
      <Axis
        type="left"
        scale={yScaleGain}
        transform={`translate(${padding.left}, 0)`}
        tickValues={[-30, -20, -10, 0, 10, 20, 30]}
        tickFormat={yTickFormat}
      />
      <Axis
        type="bottom"
        scale={xScaleFreq}
        transform={`translate(0, ${svgHeight - padding.bottom})`}
        tickValues={[20, 100, 200, 1000, 2000, 10000, 20000]}
        tickFormat={xTickFormat}
      />
    </svg>
  );
};

export default Chart;
