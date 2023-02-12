import {
  createRef,
  Fragment,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MAX_NUM_FILTERS, MIN_NUM_FILTERS } from 'common/constants';
import FrequencyBand from './components/FrequencyBand';
import { useAquaContext } from './utils/AquaContext';
import './styles/MainContent.scss';
import AddSliderDivider from './components/AddSliderDivider';
import SortWrapper from './SortWrapper';
import Spinner from './icons/Spinner';

const MainContent = () => {
  const { filters, isLoading } = useAquaContext();
  const wrapperRef = createRef<HTMLDivElement>();
  const sliderRefs = useRef<Array<HTMLDivElement>>([]);
  const dividerRefs = useRef<Array<HTMLDivElement>>([]);

  useEffect(() => {
    sliderRefs.current = sliderRefs.current.slice(0, filters.length);
    dividerRefs.current = dividerRefs.current.slice(0, filters.length + 1);
  }, [filters]);

  useEffect(() => {
    sliderRefs.current?.forEach((r) => {});
  }, [filters]);

  return isLoading ? (
    <div className="center full row">
      <Spinner />
    </div>
  ) : (
    <div className="center main-content">
      <div className="col center band-label">
        <span className="row-label">Filter Type</span>
        <span className="row-label">Frequency (Hz)</span>
        <div className="col">
          <span>+30dB</span>
          <span>0dB</span>
          <span>-30dB</span>
        </div>
        <span className="row-label">Gain (dB)</span>
        <span className="row-label">Quality</span>
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
              style={{
                position: 'fixed',
                transform: `translateX(${28 + sliderIndex * (28 + 72.47)}px)`,
                'transition-duration': '500ms',
              }}
              key="Test"
            />
            <AddSliderDivider
              sliderIndex={sliderIndex}
              isMaxSliderCount={filters.length >= MAX_NUM_FILTERS}
              style={{
                position: 'fixed',
                transform: `translateX(${(sliderIndex + 1) * (28 + 72.47)}px)`,
                'transition-duration': '500ms',
              }}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
