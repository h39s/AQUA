import * as d3 from 'd3';
import { SecondaryColorEnum } from 'renderer/styles/color';
import { IChartCurveData } from './ChartController';
import Line, { AnimationOptionsEnum as LineAnimationOptionsEnum } from './Line';
import Point, {
  AnimationOptionsEnum as PointAnimationOptionsEnum,
} from './Point';

interface ICurveProps {
  xScale: d3.AxisScale<d3.NumberValue>;
  yScale: d3.AxisScale<d3.NumberValue>;
  data: IChartCurveData;
}

const Curve = ({ xScale, yScale, data }: ICurveProps) => {
  const { name, line, controlPoint } = data;

  return (
    <>
      <Line
        name={name}
        data={line.points}
        xScale={xScale}
        yScale={yScale}
        color={line.color}
        strokeWidth={line.strokeWidth}
        animation={LineAnimationOptionsEnum.LEFT}
      />
      {controlPoint && (
        <Point
          name={name}
          data={controlPoint}
          xScale={xScale}
          yScale={yScale}
          color={SecondaryColorEnum.DEFAULT}
          radius={4}
          animation={PointAnimationOptionsEnum.FADE_IN}
        />
      )}
    </>
  );
};

export default Curve;
