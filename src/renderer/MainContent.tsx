import { createRef, Fragment } from 'react';
import { MAX_NUM_FILTERS, MIN_NUM_FILTERS } from 'common/constants';
import FrequencyBand from './components/FrequencyBand';
import { useAquaContext } from './utils/AquaContext';
import './styles/MainContent.scss';
import AddSliderDivider from './components/AddSliderDivider';
import SortWrapper from './SortWrapper';

const MainContent = () => {
  const { filters, isLoading } = useAquaContext();
  const wrapperRef = createRef<HTMLDivElement>();
  return isLoading ? (
    <div className="center full row">
      <h1>Loading...</h1>
    </div>
  ) : (
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
