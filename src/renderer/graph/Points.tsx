import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ChartDataPoint, ChartDataPointWithId } from './ChartController';

export enum AnimationOptionsEnum {
  LEFT = 'left',
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
  // Define different types of animation that we can use
  const animateLeft = useCallback(() => {
    // const totalLength = refs.current ? refs.current.getTotalLength() : 100;
    refs.current?.forEach((r) =>
      d3
        .select(r)
        .attr('opacity', 1)
        // .attr('stroke-dasharray', `${totalLength},${totalLength}`)
        // .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(750)
        .ease(d3.easeLinear)
    );
    // .attr('stroke-dashoffset', 0);
  }, []);

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

  useEffect(() => {
    if (refs.current) {
      refs.current
        ?.filter(({ id }) => id in scaledPointsMap)
        .forEach((r) =>
          d3
            .select(r)
            .transition()
            .duration(500)
            .attr('cx', scaledPointsMap[r.id].x)
            .attr('cy', scaledPointsMap[r.id].y)
        );
    }
  }, [scaledPointsMap]);

  return (
    <>
      {scaledPoints.map(({ id }) => (
        <circle
          key={id}
          id={id}
          name={name}
          ref={(element) => {
            if (element) {
              refs.current.push(element);
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
