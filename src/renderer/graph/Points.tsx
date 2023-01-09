import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ChartDataPointWithId } from './ChartController';

export enum AnimationOptionsEnum {
  FADE_IN = 'fadeIn',
  NONE = 'none',
}

interface IPointProps {
  name: string;
  pointData: ChartDataPointWithId;
  radius: number;
  color: string;
  animation?: AnimationOptionsEnum;
  transform?: string;
}

const Point = ({
  name,
  pointData,
  radius,
  color,
  animation,
  transform,
}: IPointProps) => {
  const ref = useRef<SVGCircleElement>(null);
  const { id, x, y } = pointData;

  const animateFadeIn = useCallback(() => {
    if (ref.current) {
      d3.select(ref.current)
        .transition()
        .duration(750)
        .ease(d3.easeLinear)
        .attr('opacity', 1);
    }
  }, []);

  const noneAnimation = useCallback(() => {
    if (ref.current) {
      d3.select(ref.current).attr('opacity', 1);
    }
  }, []);

  useEffect(() => {
    switch (animation) {
      case AnimationOptionsEnum.FADE_IN:
        animateFadeIn();
        break;
      case AnimationOptionsEnum.NONE:
      default:
        noneAnimation();
        break;
    }
  }, [animateFadeIn, noneAnimation, animation]);

  return (
    <circle
      ref={ref}
      key={id}
      id={id}
      name={name}
      r={radius}
      fill={color}
      stroke="#ffffff"
      transform={transform}
      cx={x}
      cy={y}
    />
  );
};

interface IPointsProps {
  name: string;
  xScale: d3.AxisScale<d3.NumberValue>;
  yScale: d3.AxisScale<d3.NumberValue>;
  color: string;
  data: ChartDataPointWithId[];
  animation?: AnimationOptionsEnum;
  transform?: string;
}

const Points = ({
  name,
  xScale,
  yScale,
  color = 'white',
  data = [],
  animation = AnimationOptionsEnum.NONE,
  transform,
}: IPointsProps) => {
  const scaledPoints = useMemo(
    () =>
      data.map(({ x, y, id }) => {
        return {
          x: xScale(x) || 0,
          y: yScale(y) || 0,
          id,
        };
      }),
    [data, xScale, yScale]
  );

  return (
    <>
      {scaledPoints.map((point) => (
        <Point
          key={point.id}
          name={name}
          pointData={point}
          radius={4}
          color={color}
          transform={transform}
          animation={animation}
        />
      ))}
    </>
  );
};

export default Points;
