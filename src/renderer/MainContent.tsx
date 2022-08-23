import { ErrorDescription } from 'common/errors';
import { MAX_NUM_FILTERS, MIN_NUM_FILTERS } from 'common/constants';
import { useState } from 'react';
import {
  addEqualizerSlider,
  removeEqualizerSlider,
} from './utils/equalizerApi';
import FrequencyBand from './components/FrequencyBand';
import MinusIcon from './icons/MinusIcon';
import PlusIcon from './icons/PlusIcon';
import Button from './widgets/Button';
import { FilterActionEnum, useAquaContext } from './utils/AquaContext';
import './styles/MainContent.scss';
import AddSliderDivider from './components/AddSliderDivider';

const MainContent = () => {
  const { filters, dispatchFilter, setGlobalError } = useAquaContext();
  const [isLoading, setIsLoading] = useState(false);

  const onAddEqualizerSlider = async () => {
    setIsLoading(true);
    try {
      await addEqualizerSlider();
      dispatchFilter({ type: FilterActionEnum.ADD });
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
    setIsLoading(false);
  };

  const onRemoveEqualizerSlider = async () => {
    setIsLoading(true);
    try {
      const removeIndex = filters.length - 1;
      await removeEqualizerSlider(removeIndex);
      dispatchFilter({ type: FilterActionEnum.REMOVE, index: removeIndex });
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
    setIsLoading(false);
  };

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
                // eslint-disable-next-line react/no-array-index-key
                key={`slider-${sliderIndex}`}
              />
            ) : (
              <AddSliderDivider
                sliderIndex={sliderIndex}
                isDisabled={filters.length >= MAX_NUM_FILTERS || isLoading}
                // eslint-disable-next-line react/no-array-index-key
                key={`add-slider-${sliderIndex}`}
              />
            )
          )}
      </div>
      <div className="col center sliderButtons">
        <Button
          ariaLabel="Add Equalizer Slider"
          isDisabled={filters.length >= MAX_NUM_FILTERS || isLoading}
          className="sliderButton"
          handleChange={onAddEqualizerSlider}
        >
          <PlusIcon />
        </Button>
        <Button
          ariaLabel="Remove Equalizer Slider"
          isDisabled={filters.length <= MIN_NUM_FILTERS || isLoading}
          className="sliderButton"
          handleChange={onRemoveEqualizerSlider}
        >
          <MinusIcon />
        </Button>
      </div>
    </div>
  );
};

export default MainContent;
