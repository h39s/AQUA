import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useIsNotFirstRender } from 'renderer/utils/utils';
import { ChartDataPoint, ChartDataPointWithId } from './ChartController';

export enum AnimationOptionsEnum {
  FADE_IN = 'fadeIn',
  NONE = 'none',
}

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
  const refs = useRef<SVGPathElement[]>([]);
  useEffect(() => {
    refs.current = refs.current.slice(0, data.length);
  }, [data]);

  const animateFadeIn = useCallback(() => {
    refs.current?.forEach((r) =>
      d3
        .select(r)
        .transition()
        .duration(750)
        .ease(d3.easeLinear)
        .attr('opacity', 1)
    );
  }, []);

  const noneAnimation = useCallback(() => {
    refs.current?.forEach((r) => d3.select(r).attr('opacity', 1));
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

  const scaledPointsMap = useMemo(() => {
    const map: { [id: string]: ChartDataPoint } = {};
    scaledPoints.forEach((point) => {
      map[point.id] = { x: point.x, y: point.y };
    });
    return map;
  }, [scaledPoints]);

  const isNotFirstRender = useIsNotFirstRender();

  // TODO: figure out how to best customize when to animate
  //    - either none or fade animate when adding a new point
  //    - no animation when a frequency is changed
  const animatePoints = useMemo(() => isNotFirstRender, [isNotFirstRender]);

  useEffect(() => {
    if (refs.current) {
      refs.current
        ?.filter(({ id }) => id in scaledPointsMap)
        .forEach((r) =>
          // Only animate for subsequent renders
          animatePoints
            ? d3
                .select(r)
                .transition()
                .duration(500)
                .attr('cx', scaledPointsMap[r.id].x)
                .attr('cy', scaledPointsMap[r.id].y)
            : d3
                .select(r)
                .attr('cx', scaledPointsMap[r.id].x)
                .attr('cy', scaledPointsMap[r.id].y)
        );
    }
  }, [animatePoints, scaledPointsMap]);

  return (
    <>
      {scaledPoints.map(({ id }, i) => (
        <circle
          key={id}
          id={id}
          name={name}
          ref={(element) => {
            if (element) {
              refs.current[i] = element;
            }
          }}
          r={4}
          fill={color}
          stroke="#ffffff"
        />
      ))}
    </>
  );
};

export default Points;
