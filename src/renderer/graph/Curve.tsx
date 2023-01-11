import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ChartDataPoint } from './ChartController';

export enum AnimationOptionsEnum {
  LEFT = 'left',
  FADE_IN = 'fadeIn',
  NONE = 'none',
}

interface ICurveProps {
  name: string;
  xScale: d3.AxisScale<d3.NumberValue>;
  yScale: d3.AxisScale<d3.NumberValue>;
  color: string;
  width: number;
  data: ChartDataPoint[];
  animation?: AnimationOptionsEnum;
  transform?: string;
}

const Curve = ({
  name,
  xScale,
  yScale,
  color = 'white',
  width = 3,
  data = [],
  animation = AnimationOptionsEnum.NONE,
  transform,
}: ICurveProps) => {
  const ref = useRef<SVGPathElement>(null);
  // Define different types of animation that we can use
  const animateLeft = useCallback(() => {
    const totalLength = ref.current ? ref.current.getTotalLength() : 100;
    d3.select(ref.current)
      .attr('opacity', 1)
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(750)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
  }, []);

  const animateFadeIn = useCallback(() => {
    d3.select(ref.current)
      .transition()
      .duration(750)
      .ease(d3.easeLinear)
      .attr('opacity', 1);
  }, []);

  const noneAnimation = useCallback(() => {
    d3.select(ref.current).attr('opacity', 1);
  }, []);

  useEffect(() => {
    switch (animation) {
      case AnimationOptionsEnum.LEFT:
        animateLeft();
        break;
      case AnimationOptionsEnum.FADE_IN:
        animateFadeIn();
        break;
      case AnimationOptionsEnum.NONE:
      default:
        noneAnimation();
        break;
    }
  }, [animateLeft, animateFadeIn, noneAnimation, animation]);

  // Recalculate line length if scale or data has changed
  useEffect(() => {
    const totalLength = ref.current ? ref.current.getTotalLength() : 100;
    d3.select(ref.current).attr(
      'stroke-dasharray',
      `${totalLength} ${totalLength}`
    );
  }, [xScale, yScale, data]);

  const line = useMemo(
    () =>
      d3
        .line<ChartDataPoint>()
        .x(({ x }) => xScale(x) || 0)
        .y(({ y }) => yScale(y) || 0),
    [xScale, yScale]
  );

  const d = useMemo(() => line(data), [data, line]);

  return (
    <path
      name={name}
      ref={ref}
      stroke={color}
      strokeWidth={width}
      fill="none"
      opacity={0}
      d={d || ''}
      transform={transform}
    />
  );
};

export default Curve;
