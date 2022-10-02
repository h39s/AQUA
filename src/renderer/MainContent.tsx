import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MAX_NUM_FILTERS, MIN_NUM_FILTERS } from 'common/constants';
import FrequencyBand from './components/FrequencyBand';
import { useAquaContext } from './utils/AquaContext';
import './styles/MainContent.scss';
import AddSliderDivider from './components/AddSliderDivider';
import { usePrevious } from './utils/utils';

interface IBoundingBoxMap {
  [key: string]: DOMRect;
}

// codesandbox.io/s/reorder-elements-with-slide-transition-and-react-hooks-flip-forked-wjojyy?file=/src/helpers/calculateBoundingBoxes.js:28-370
export const calculateBoundingBoxes = (children: (HTMLDivElement | null)[]) => {
  const boundingBoxes: IBoundingBoxMap = {};

  children.forEach((child) => {
    if (child) {
      const nodeBoundingBox = child?.getBoundingClientRect();
      boundingBoxes[child.id] = nodeBoundingBox;
    }
  });

  return boundingBoxes;
};

const MainContent = () => {
  const { filters } = useAquaContext();
  const [boundingBox, setBoundingBox] = useState<IBoundingBoxMap>({});
  const wrapperRef = useRef<HTMLDivElement>(null);
  const filterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [prevBoundingBox, clearPrevBoundingBox] =
    usePrevious<IBoundingBoxMap>(boundingBox);

  const updateBoundingBox = () => {
    const newBoundingBox = calculateBoundingBoxes(filterRefs.current);
    setBoundingBox(newBoundingBox);
    filterRefs.current = [];
  };

  useEffect(() => {
    let handler: NodeJS.Timeout;
    const onScroll = () => {
      if (handler) {
        clearTimeout(handler);
      }
      handler = setTimeout(() => {
        // Update bounding boxes when a scroll event ends
        updateBoundingBox();
        // Clear the previous bounding box value to prevent animation due to the scroll
        clearPrevBoundingBox();
      }, 200); // default 200 ms
    };

    const element = wrapperRef.current;
    element?.addEventListener('scroll', onScroll);
    return () => {
      element?.removeEventListener('scroll', onScroll);
    };
  }, [wrapperRef, clearPrevBoundingBox]);

  useLayoutEffect(() => {
    // Update bounding boxes when a frequency value is updated
    updateBoundingBox();
  }, [filters]);

  useEffect(() => {
    const hasPrevBoundingBox =
      prevBoundingBox && Object.keys(prevBoundingBox).length;

    if (hasPrevBoundingBox) {
      filterRefs.current.forEach((child) => {
        if (child) {
          const firstBox = prevBoundingBox[child.id];
          const lastBox = boundingBox[child.id];
          // firstBox will be undefined for new filters
          const changeInX = firstBox ? firstBox.left - lastBox.left : 0;

          if (changeInX) {
            requestAnimationFrame(() => {
              // Before the DOM paints, invert child to old position
              child.style.transform = `translateX(${changeInX}px)`;
              child.style.transition = 'transform 0s';

              requestAnimationFrame(() => {
                // After the previous frame, remove
                // the transistion to play the animation
                child.style.transform = '';
                child.style.transition = 'transform 500ms';
              });
            });
          }
        }
      });
    }
  }, [boundingBox, filterRefs, prevBoundingBox]);

  return (
    <div className="center mainContent">
      <div className="col center bandLabel">
        <span className="rowLabel">Filter Type</span>
        <span className="rowLabel">Frequency (Hz)</span>
        <div className="col">
          <span>+30dB</span>
          <span>0dB</span>
          <span>-30dB</span>
        </div>
        <span className="rowLabel">Gain (dB)</span>
        <span className="rowLabel">Quality</span>
      </div>
      <div ref={wrapperRef} className="bands row center">
        <AddSliderDivider
          sliderIndex={-1}
          isMaxSliderCount={filters.length >= MAX_NUM_FILTERS}
        />
        {filters.map((filter, sliderIndex) => (
          <Fragment key={`slider-${filter.id}`}>
            <FrequencyBand
              sliderIndex={sliderIndex}
              filter={filter}
              isMinSliderCount={filters.length <= MIN_NUM_FILTERS}
              ref={(element) => filterRefs.current.push(element)}
            />
            <AddSliderDivider
              sliderIndex={sliderIndex}
              isMaxSliderCount={filters.length >= MAX_NUM_FILTERS}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
