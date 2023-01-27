import { createRef, Fragment } from 'react';
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
        <SortWrapper wrapperRef={wrapperRef}>
          {filters.map((filter, sliderIndex) => (
            <Fragment key={`slider-${filter.id}`}>
              <FrequencyBand
                sliderIndex={sliderIndex}
                filter={filter}
                isMinSliderCount={filters.length <= MIN_NUM_FILTERS}
                ref={createRef()}
              />
              <AddSliderDivider
                sliderIndex={sliderIndex}
                isMaxSliderCount={filters.length >= MAX_NUM_FILTERS}
              />
            </Fragment>
          ))}
        </SortWrapper>
      </div>
    </div>
  );
};

export default MainContent;
