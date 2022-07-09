/** GridLine.js */
import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

interface Props {
  type: any;
  scale: any;
  ticks: any;
  size: any;
  transform?: any;
  disableAnimation?: any;
}

const GridLine = ({
  type,
  scale,
  ticks,
  size,
  transform,
  disableAnimation,
}: Props) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const axisGenerator = type === 'vertical' ? d3.axisBottom : d3.axisLeft;
    const axis = axisGenerator(scale).ticks(ticks).tickSize(-size);

    const gridGroup = d3.select(ref.current);
    if (disableAnimation) {
      gridGroup.call(axis);
    } else {
      gridGroup.transition().duration(750).ease(d3.easeLinear).call(axis);
    }
    gridGroup.select('.domain').remove();
    gridGroup.selectAll('text').remove();
    gridGroup.selectAll('line').attr('stroke', 'rgba(255, 255, 255, 0.1)');
  }, [scale, ticks, size, disableAnimation, type]);

  return <g ref={ref} transform={transform} />;
};

GridLine.propTypes = {
  type: PropTypes.oneOf(['vertical', 'horizontal']).isRequired,
};

export default GridLine;
