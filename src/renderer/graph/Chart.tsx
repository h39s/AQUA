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

import { useMemo } from 'react';
import { ColorEnum } from '../styles/color';
import Axis from './Axis';
import GridLine from './GridLine';
import useController, { IChartCurveData, IMarginLike } from './ChartController';
import Curve from './Curve';

export interface ChartDimensions {
  height: number;
  width: number;
  margins: IMarginLike;
}

interface IChartProps {
  data: IChartCurveData[];
  dimensions: ChartDimensions;
}

const Chart = ({ data = [], dimensions }: IChartProps) => {
  const { width, height, margins } = dimensions;
  const svgWidth = useMemo(
    () => Math.max(width - margins.left - margins.right, 0),
    [width, margins]
  );
  const svgHeight = useMemo(
    () => Math.max(height - margins.top - margins.bottom, 0),
    [height, margins]
  );

  const padding = useMemo(() => {
    return {
      left: 50,
      top: 0,
      right: 0,
      bottom: 30,
    };
  }, []);

  const chartWidth = useMemo(
    () =>
      Math.max(
        width - margins.left - margins.right - padding.left - padding.right,
        0
      ),
    [width, margins, padding]
  );
  const chartHeight = useMemo(
    () =>
      Math.max(
        height - margins.top - margins.bottom - padding.top - padding.bottom,
        0
      ),
    [height, margins, padding]
  );

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
        margin: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`,
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
        color={ColorEnum.COMPLEMENTARY}
        transform={`translate(${padding.left}, 0)`}
      />
      {data.map((e: IChartCurveData) => (
        <Curve key={e.id} data={e} xScale={xScaleFreq} yScale={yScaleGain} />
      ))}
      <clipPath id="chart-clip-path">
        <rect x={padding.left} width={chartWidth} height={chartHeight} />
      </clipPath>
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
