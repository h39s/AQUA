import { MAX_NUM_FILTERS, MIN_NUM_FILTERS } from 'common/constants';
import FrequencyBand from './components/FrequencyBand';
import { useAquaContext } from './utils/AquaContext';
import './styles/MainContent.scss';
import AddSliderDivider from './components/AddSliderDivider';

const MainContent = () => {
  const { filters } = useAquaContext();

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
      <div className="bands row center">
        <AddSliderDivider
          sliderIndex={-1}
          isMaxSliderCount={filters.length >= MAX_NUM_FILTERS}
          // eslint-disable-next-line react/no-array-index-key
          key={`add-slider-${-1}`}
        />
        {filters
          .flatMap((filter, sliderIndex) => [
            { filter, sliderIndex },
            { sliderIndex },
          ])
          .map(({ filter, sliderIndex }) =>
            filter ? (
              <FrequencyBand
                sliderIndex={sliderIndex}
                filter={filter}
                isMinSliderCount={filters.length <= MIN_NUM_FILTERS}
                // eslint-disable-next-line react/no-array-index-key
                key={`slider-${sliderIndex}`}
              />
            ) : (
              <AddSliderDivider
                sliderIndex={sliderIndex}
                isMaxSliderCount={filters.length >= MAX_NUM_FILTERS}
                // eslint-disable-next-line react/no-array-index-key
                key={`add-slider-${sliderIndex}`}
              />
            )
          )}
      </div>
    </div>
  );
};

export default MainContent;
