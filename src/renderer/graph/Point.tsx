import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { IChartPointData } from './ChartController';

export enum AnimationOptionsEnum {
  FADE_IN = 'fadeIn',
  NONE = 'none',
}

interface IPointProps {
  name: string;
  xScale: d3.AxisScale<d3.NumberValue>;
  yScale: d3.AxisScale<d3.NumberValue>;
  data: IChartPointData;
  radius: number;
  color: string;
  animation?: AnimationOptionsEnum;
  transform?: string;
}

const Point = ({
  name,
  xScale,
  yScale,
  data,
  radius,
  color,
  animation,
  transform,
}: IPointProps) => {
  const ref = useRef<SVGCircleElement>(null);
  const { x, y } = data;

  const scaledX = useMemo(() => xScale(x) || 0, [x, xScale]);
  const scaledY = useMemo(() => yScale(y) || 0, [y, yScale]);

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
      name={name}
      r={radius}
      fill={color}
      stroke="#ffffff"
      transform={transform}
      cx={scaledX}
      cy={scaledY}
    />
  );
};

export default Point;
