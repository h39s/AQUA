import { createRef, Fragment } from 'react';
import { MAX_NUM_FILTERS, MIN_NUM_FILTERS } from 'common/constants';
import FrequencyBand from './components/FrequencyBand';
import { useAquaContext } from './utils/AquaContext';
import './styles/MainContent.scss';
import AddSliderDivider from './components/AddSliderDivider';
import SortWrapper from './SortWrapper';

const FREQUENCY_BAND_WIDTH = 72.47;
const ADD_FILTER_WIDTH = 28;

const MainContent = () => {
  const { filters } = useAquaContext();
  const wrapperRef = createRef<HTMLDivElement>();
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
          style={{ left: 0 }}
        />
        {filters.map((filter, sliderIndex) => (
          <Fragment key={`slider-${filter.id}`}>
            <FrequencyBand
              sliderIndex={sliderIndex}
              filter={filter}
              isMinSliderCount={filters.length <= MIN_NUM_FILTERS}
              ref={createRef()}
              style={{
                left:
                  (FREQUENCY_BAND_WIDTH + ADD_FILTER_WIDTH) * sliderIndex +
                  ADD_FILTER_WIDTH,
              }}
            />
            <AddSliderDivider
              sliderIndex={sliderIndex}
              isMaxSliderCount={filters.length >= MAX_NUM_FILTERS}
              style={{
                left:
                  (FREQUENCY_BAND_WIDTH + ADD_FILTER_WIDTH) * (sliderIndex + 1),
              }}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
