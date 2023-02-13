import { Fragment, useMemo } from 'react';
import { MAX_NUM_FILTERS, MIN_NUM_FILTERS } from 'common/constants';
import FrequencyBand from './components/FrequencyBand';
import { useAquaContext } from './utils/AquaContext';
import './styles/MainContent.scss';
import AddSliderDivider from './components/AddSliderDivider';
import Spinner from './icons/Spinner';

const MainContent = () => {
  const { filters: sortedFilters, isLoading } = useAquaContext();

  // Store widths for AddSliderDividers and FrequencyBands so we can manually position them
  const DIVIDER_WIDTH = 28;
  const BAND_WIDTH = 72.94;

  const [filters, sortIndexMap] = useMemo(() => {
    // Obtain a fixed order list of the filters
    const fixedSort = sortedFilters
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id));

    // Compute a mapping from a filter id to its sorted index
    const map: { [key: string]: number } = {};
    sortedFilters.forEach((f, index) => {
      map[f.id] = index;
    });

    return [fixedSort, map];
  }, [sortedFilters]);

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
      <div className="bands row center">
        <AddSliderDivider
          sliderIndex={-1}
          isMaxSliderCount={filters.length >= MAX_NUM_FILTERS}
        />
        {filters.map((filter) => {
          const sliderIndex = sortIndexMap[filter.id];
          return (
            <Fragment key={`slider-${filter.id}`}>
              <FrequencyBand
                sliderIndex={sliderIndex}
                filter={filter}
                isMinSliderCount={filters.length <= MIN_NUM_FILTERS}
                // Manually position the frequency band
                style={{
                  transform: `translateX(${
                    DIVIDER_WIDTH + sliderIndex * (DIVIDER_WIDTH + BAND_WIDTH)
                  }px)`,
                }}
              />
              <AddSliderDivider
                sliderIndex={sliderIndex}
                isMaxSliderCount={filters.length >= MAX_NUM_FILTERS}
                // Manually position the divider
                style={{
                  transform: `translateX(${
                    (sliderIndex + 1) * (DIVIDER_WIDTH + BAND_WIDTH)
                  }px)`,
                }}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default MainContent;
