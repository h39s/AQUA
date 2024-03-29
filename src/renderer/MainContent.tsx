/*
<AQUA: System-wide parametric audio equalizer interface>
Copyright (C) <2023>  <AQUA Dev Team>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Fragment, useMemo } from 'react';
import {
  FixedBandSizeEnum,
  MAX_NUM_FILTERS,
  MIN_NUM_FILTERS,
} from 'common/constants';
import { computeAvgFreq } from 'common/utils';
import { ErrorDescription } from 'common/errors';
import FrequencyBand from './components/FrequencyBand';
import { FilterActionEnum, useAquaContext } from './utils/AquaContext';
import './styles/MainContent.scss';
import AddSliderDivider from './components/AddSliderDivider';
import Spinner from './icons/Spinner';
import { sortHelper } from './utils/utils';
import Button from './widgets/Button';
import { clearGains, setFixedBand } from './utils/equalizerApi';

const MainContent = () => {
  const { filters, isLoading, dispatchFilter, setGlobalError } =
    useAquaContext();

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

  const clearFilterGains = async () => {
    try {
      await clearGains();
      dispatchFilter({
        type: FilterActionEnum.CLEAR_GAINS,
      });
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  const handleFixedBand = (size: FixedBandSizeEnum) => async () => {
    try {
      const newFilters = await setFixedBand(size);
      dispatchFilter({
        type: FilterActionEnum.INIT,
        filters: newFilters,
      });
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  return isLoading ? (
    <div className="center full row">
      <Spinner />
    </div>
  ) : (
    <>
      <div className="main-content-title">
        <h4>Parametric EQ</h4>
        <Button
          ariaLabel="Clear Gains"
          isDisabled={false}
          className="small"
          handleChange={clearFilterGains}
        >
          Clear Gains
        </Button>
        <div />
        <h5>Fixed Band Configs</h5>
        {Object.values(FixedBandSizeEnum)
          .filter((s) => !Number.isNaN(Number(s)))
          .map((size) => (
            <Button
              key={`${size}-band`}
              ariaLabel={`${size} Band`}
              isDisabled={false}
              className="small"
              handleChange={handleFixedBand(size as FixedBandSizeEnum)}
            >
              {`${size} Band`}
            </Button>
          ))}
      </div>
      <div className="main-content">
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
    </>
  );
};

export default MainContent;
