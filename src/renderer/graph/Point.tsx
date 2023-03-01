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

import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useIsFirstRender } from 'renderer/utils/utils';
import {
  GRAPH_ANIMATE_DURATION,
  IChartPointData,
  INIT_ANIMATE_DURATION,
} from './ChartController';

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

  const isFirstRender = useIsFirstRender();

  const animateFadeIn = useCallback(() => {
    if (ref.current) {
      d3.select(ref.current)
        .transition()
        .duration(INIT_ANIMATE_DURATION)
        .ease(d3.easeLinear)
        .attr('opacity', 1);
    }
  }, []);

  const noneAnimation = useCallback(() => {
    if (ref.current) {
      d3.select(ref.current).attr('opacity', 1);
    }
  }, []);

  // Set initial point location
  const initRender = useCallback(() => {
    if (ref.current) {
      d3.select(ref.current).attr('cx', scaledX).attr('cy', scaledY);
    }
  }, [scaledX, scaledY]);

  // Handle animation for the initial render
  useEffect(() => {
    if (isFirstRender) {
      initRender();
      switch (animation) {
        case AnimationOptionsEnum.FADE_IN:
          animateFadeIn();
          break;
        case AnimationOptionsEnum.NONE:
        default:
          noneAnimation();
          break;
      }
    }
  }, [animateFadeIn, noneAnimation, animation, isFirstRender, initRender]);

  // Handle animation for subsequent renders
  useEffect(() => {
    if (ref.current && !isFirstRender) {
      d3.select(ref.current)
        .transition()
        // Make sure initial animation is overwritten
        .attr('opacity', 1)
        // Add new animation
        .duration(GRAPH_ANIMATE_DURATION)
        .attr('cx', scaledX)
        .attr('cy', scaledY);
    }
  }, [isFirstRender, scaledX, scaledY]);

  return (
    <circle
      ref={ref}
      name={name}
      r={radius}
      fill={color}
      stroke="#ffffff"
      transform={transform}
    />
  );
};

export default Point;
