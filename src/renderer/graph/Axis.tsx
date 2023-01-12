import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { GrayScaleEnum } from '../styles/color';

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
        axisGroup.transition().duration(750).ease(d3.easeLinear).call(axis);
      }
      axisGroup.select('.domain').remove();
      axisGroup.selectAll('line').remove();
      axisGroup
        .selectAll('text')
        .attr('opacity', 1)
        .attr('color', GrayScaleEnum.WHITE)
        .attr('font-size', '0.75rem');
    }
  }, [scale, tickValues, tickFormat, disableAnimation, type]);

  return <g name="axis-frequency" ref={ref} transform={transform} />;
};

export default Axis;
