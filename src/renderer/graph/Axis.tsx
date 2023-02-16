import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { useIsFirstRender } from 'renderer/utils/utils';
import { GrayScaleEnum } from '../styles/color';
import {
  GRAPH_ANIMATE_DURATION,
  INIT_ANIMATE_DURATION,
} from './ChartController';

interface IAxisProps {
  type: 'bottom' | 'left';
  scale: d3.AxisScale<d3.NumberValue>;
  tickValues: number[];
  transform?: string;
  tickFormat?: (domainValue: d3.NumberValue) => string;
  disableAnimation?: boolean;
}

const Axis = ({
  type,
  scale,
  tickValues,
  transform,
  tickFormat,
  disableAnimation,
}: IAxisProps) => {
  const ref = useRef<SVGGElement>(null);
  const isFirstRender = useIsFirstRender();
  useEffect(() => {
    const axisGenerator = type === 'left' ? d3.axisLeft : d3.axisBottom;
    const axis = tickFormat
      ? axisGenerator(scale).tickValues(tickValues).tickFormat(tickFormat)
      : axisGenerator(scale).tickValues(tickValues);

    if (ref.current) {
      const axisGroup = d3.select(ref.current);
      if (disableAnimation) {
        axisGroup.call(axis);
      } else {
        const duration = isFirstRender
          ? INIT_ANIMATE_DURATION
          : GRAPH_ANIMATE_DURATION;
        axisGroup
          .transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .call(axis);
      }
      axisGroup.select('.domain').remove();
      axisGroup.selectAll('line').remove();
      axisGroup
        .selectAll('text')
        .attr('opacity', 1)
        .attr('color', GrayScaleEnum.WHITE)
        .attr('font-size', '0.75rem');
    }
  }, [scale, tickValues, tickFormat, disableAnimation, type, isFirstRender]);

  return <g name="axis-frequency" ref={ref} transform={transform} />;
};

export default Axis;
