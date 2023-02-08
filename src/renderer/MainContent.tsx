import {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  Fragment,
  useMemo,
  useRef,
} from 'react';
import { MAX_NUM_FILTERS, MIN_NUM_FILTERS } from 'common/constants';
import FrequencyBand from './components/FrequencyBand';
import { useAquaContext } from './utils/AquaContext';
import './styles/MainContent.scss';
import AddSliderDivider from './components/AddSliderDivider';
import Spinner from './icons/Spinner';

const MainContent = forwardRef(
  ({ height }: { height: number }, ref: ForwardedRef<HTMLDivElement>) => {
    const bandsWrapperRef = useRef<HTMLDivElement>(null);
    const { filters: freqSortedFilters, isLoading } = useAquaContext();

    // Store widths for AddSliderDividers and FrequencyBands so we can manually position them
    const DIVIDER_WIDTH = 28;
    const BAND_WIDTH = 72.94;

    const [idSortedFilters, sortIndexMap] = useMemo(() => {
      // Obtain a fixed order list of the filters
      const fixedSort = freqSortedFilters
        .slice()
        .sort((a, b) => a.id.localeCompare(b.id));

      // Compute a mapping from a filter id to its sorted index
      const map: { [key: string]: number } = {};
      freqSortedFilters.forEach((f, index) => {
        map[f.id] = index;
      });

      return [fixedSort, map];
    }, [freqSortedFilters]);

    const sliderHeight = useMemo(
      // TODO: improve comments here
      () => height - 5 * 8 - 30 - 36 * 3 - 60 - 2 * 4 - 2 * 23,
      [height]
    );

    return isLoading ? (
      <div className="center full row">
        <Spinner />
      </div>
    ) : (
      <div
        ref={ref}
        className="center main-content"
        style={
          // Set css variables for determining upper/lower track
          {
            '--slider-height': sliderHeight,
          } as CSSProperties
        }
      >
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
        <div ref={bandsWrapperRef} className="bands row center">
          <AddSliderDivider
            sliderIndex={-1}
            isMaxSliderCount={idSortedFilters.length >= MAX_NUM_FILTERS}
          />
          {idSortedFilters.map((filter) => {
            const sliderIndex = sortIndexMap[filter.id];
            return (
              <Fragment key={`slider-${filter.id}`}>
                <FrequencyBand
                  sliderIndex={sliderIndex}
                  filter={filter}
                  isMinSliderCount={idSortedFilters.length <= MIN_NUM_FILTERS}
                  sliderHeight={sliderHeight}
                  // Manually position the frequency band
                  style={{
                    transform: `translateX(${
                      DIVIDER_WIDTH + sliderIndex * (DIVIDER_WIDTH + BAND_WIDTH)
                    }px)`,
                  }}
                />
                <AddSliderDivider
                  sliderIndex={sliderIndex}
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
  }
);

export default MainContent;
