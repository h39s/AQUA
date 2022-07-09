import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

interface Props {
  xScale: any;
  yScale: any;
  color: any;
  data: any;
  isSmooth?: any;
  animation?: any;
}

const Line = ({
  xScale,
  yScale,
  color = 'white',
  data = [],
  isSmooth = false,
  animation = 'none',
}: Props) => {
  const ref = React.useRef<SVGPathElement | null>(null);
  // Define different types of animation that we can use
  const animateLeft = React.useCallback(() => {
    const totalLength = ref.current ? ref.current.getTotalLength() : 100;
    d3.select(ref.current)
      .attr('opacity', 1)
      .attr('stroke-dasharray', `${totalLength},${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(750)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
  }, []);
  const animateFadeIn = React.useCallback(() => {
    d3.select(ref.current)
      .transition()
      .duration(750)
      .ease(d3.easeLinear)
      .attr('opacity', 1);
  }, []);
  const noneAnimation = React.useCallback(() => {
    d3.select(ref.current).attr('opacity', 1);
  }, []);

  React.useEffect(() => {
    console.log(data);
    switch (animation) {
      case 'left':
        animateLeft();
        break;
      case 'fadeIn':
        animateFadeIn();
        break;
      case 'none':
      default:
        noneAnimation();
        break;
    }
  }, [animateLeft, animateFadeIn, noneAnimation, animation, data]);

  // Recalculate line length if scale has changed
  React.useEffect(() => {
    if (animation === 'left') {
      const totalLength = ref.current ? ref.current.getTotalLength() : 100;
      d3.select(ref.current).attr(
        'stroke-dasharray',
        `${totalLength},${totalLength}`
      );
    }
  }, [xScale, yScale, animation]);

  const line = d3
    .line<any>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));

  const d = line(data);

  return (
    <path
      ref={ref}
      // eslint-disable-next-line no-nested-ternary
      d={d?.match(/NaN|undefined/) ? '' : d === null ? undefined : d}
      stroke={color}
      strokeWidth={3}
      fill="none"
      opacity={0}
    />
  );
};

Line.defaultProps = {};

export default Line;
