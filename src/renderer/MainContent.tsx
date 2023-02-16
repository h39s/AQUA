import { Fragment, useMemo } from 'react';
import { MAX_NUM_FILTERS, MIN_NUM_FILTERS } from 'common/constants';
import { computeAvgFreq } from 'common/utils';
import FrequencyBand from './components/FrequencyBand';
import { useAquaContext } from './utils/AquaContext';
import './styles/MainContent.scss';
import AddSliderDivider from './components/AddSliderDivider';
import Spinner from './icons/Spinner';
import { sortHelper } from './utils/utils';

const MainContent = () => {
  const { filters, isLoading } = useAquaContext();

  // Store widths for AddSliderDividers and FrequencyBands so we can manually position them
  const DIVIDER_WIDTH = 28;
  const BAND_WIDTH = 72.94;

  const [idSortedFilters, freqSortedFilters, sortIndexMap] = useMemo(() => {
    // Obtain a fixed order list of the filters
    const fixedSort = Object.values(filters).sort((a, b) =>
      a.id.localeCompare(b.id)
    );

    // Obtain a visually sorted list of the filters
    const visualSort = Object.values(filters).sort(sortHelper);

    // Compute a mapping from a filter id to its sorted index
    const map: { [key: string]: number } = {};
    Object.values(visualSort).forEach((f, index) => {
      map[f.id] = index;
    });

    return [fixedSort, visualSort, map];
  }, [filters]);

  return isLoading ? (
    <div className="center full row">
      <Spinner />
    </div>
  ) : (
    <div className="center main-content">
      <div className="col center band-label">
        <span />
        <span className="row-label">Filter Type</span>
        <span className="row-label">Frequency (Hz)</span>
        <span />
        <span>+30dB</span>
        <span />
        <span>0dB</span>
        <span />
        <span>-30dB</span>
        <span />
        <span className="row-label">Gain (dB)</span>
        <span className="row-label">Quality</span>
        <span />
      </div>
      <div className="bands row center">
        <AddSliderDivider
          newSliderFrequency={computeAvgFreq(null, freqSortedFilters[0])}
          isMaxSliderCount={idSortedFilters.length >= MAX_NUM_FILTERS}
        />
        {idSortedFilters.map((filter) => {
          const sliderIndex = sortIndexMap[filter.id];
          return (
            <Fragment key={`slider-${filter.id}`}>
              <FrequencyBand
                filter={filter}
                isMinSliderCount={idSortedFilters.length <= MIN_NUM_FILTERS}
                // Manually position the frequency band
                style={{
                  transform: `translateX(${
                    DIVIDER_WIDTH + sliderIndex * (DIVIDER_WIDTH + BAND_WIDTH)
                  }px)`,
                }}
              />
              <AddSliderDivider
                newSliderFrequency={computeAvgFreq(
                  freqSortedFilters[sliderIndex],
                  freqSortedFilters[sliderIndex + 1]
                )}
                isMaxSliderCount={idSortedFilters.length >= MAX_NUM_FILTERS}
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
