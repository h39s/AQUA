import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

interface IGridLineProps {
  type: 'vertical' | 'horizontal';
  scale: d3.AxisScale<d3.NumberValue>;
  tickValues: number[];
  size: number;
  transform?: string;
  color?: string;
  disableAnimation?: boolean;
}

const GridLine = ({
  type,
  scale,
  tickValues,
  size,
  transform,
  color = 'rgba(255, 255, 255, 0.5)',
  disableAnimation,
}: IGridLineProps) => {
  const ref = useRef<SVGGElement>(null);
  useEffect(() => {
    const axisGenerator = type === 'vertical' ? d3.axisBottom : d3.axisLeft;
    const axis = axisGenerator(scale).tickValues(tickValues).tickSize(-size);

    if (ref.current) {
      const gridGroup = d3.select(ref.current);
      if (disableAnimation) {
        gridGroup.call(axis);
      } else {
        gridGroup.transition().duration(750).ease(d3.easeLinear).call(axis);
      }
      gridGroup.select('.domain').remove();
      gridGroup.selectAll('text').remove();
      gridGroup.selectAll('line').attr('stroke', color);
    }
  }, [scale, tickValues, size, disableAnimation, type, color]);

  return <g ref={ref} transform={transform} />;
};

export default GridLine;
