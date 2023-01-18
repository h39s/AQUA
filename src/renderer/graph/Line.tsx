import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useIsFirstRender } from 'renderer/utils/utils';
import {
  GRAPH_ANIMATE_DURATION,
  IChartPointData,
  INIT_ANIMATE_DURATION,
} from './ChartController';

export enum AnimationOptionsEnum {
  LEFT = 'left',
  FADE_IN = 'fadeIn',
  NONE = 'none',
}

interface ILineProps {
  name: string;
  xScale: d3.AxisScale<d3.NumberValue>;
  yScale: d3.AxisScale<d3.NumberValue>;
  color: string;
  strokeWidth: number;
  data: IChartPointData[];
  animation?: AnimationOptionsEnum;
  transform?: string;
}

const Line = ({
  name,
  xScale,
  yScale,
  color = 'white',
  strokeWidth = 3,
  data = [],
  animation = AnimationOptionsEnum.NONE,
  transform,
}: ILineProps) => {
  const ref = useRef<SVGPathElement>(null);
  const isFirstRender = useIsFirstRender();

  const line = useMemo(
    () =>
      d3
        .line<IChartPointData>()
        .x(({ x }) => xScale(x) || 0)
        .y(({ y }) => yScale(y) || 0),
    [xScale, yScale]
  );

  const d = useMemo(() => line(data), [data, line]);

  // Define different types of animation that we can use
  const animateLeft = useCallback(() => {
    const totalLength = ref.current ? ref.current.getTotalLength() : 100;
    d3.select(ref.current)
      .attr('opacity', 1)
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(INIT_ANIMATE_DURATION)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
  }, []);

  const animateFadeIn = useCallback(() => {
    d3.select(ref.current)
      .transition()
      .duration(INIT_ANIMATE_DURATION)
      .ease(d3.easeLinear)
      .attr('opacity', 1);
  }, []);

  const noneAnimation = useCallback(() => {
    d3.select(ref.current).attr('opacity', 1);
  }, []);

  // Set initial path attribute
  const initRender = useCallback(() => {
    d3.select(ref.current).attr('d', d);
  }, [d]);

  // Handle animation for the initial render
  useEffect(() => {
    if (isFirstRender) {
      initRender();
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
    }
  }, [
    animateLeft,
    animateFadeIn,
    noneAnimation,
    animation,
    isFirstRender,
    initRender,
  ]);

  // Handle animation for subsequent renders
  useEffect(() => {
    if (ref.current && !isFirstRender) {
      // Recalculate line length if scale or data has changed
      const totalLength = ref.current ? ref.current.getTotalLength() : 100;
      d3.select(ref.current)
        // Adjust line length to match new curve
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .transition()
        // Make sure initial animation is overwritten
        .attr('opacity', 1)
        .attr('stroke-dashoffset', 0)
        // Add new animation
        .duration(GRAPH_ANIMATE_DURATION)
        .attr('d', d);
    }
  }, [d, isFirstRender]);

  return (
    <path
      name={name}
      ref={ref}
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      opacity={0}
      transform={transform}
    />
  );
};

export default Line;
