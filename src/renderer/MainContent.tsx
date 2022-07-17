import { ErrorDescription } from 'common/errors';
import { MAX_NUM_FILTERS, MIN_NUM_FILTERS } from 'common/constants';
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

const MainContent = () => {
  const { filters, dispatchFilter, setGlobalError } = useAquaContext();

  const onAddEqualizerSlider = async () => {
    try {
      await addEqualizerSlider();
      dispatchFilter({ type: FilterActionEnum.ADD });
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  const onRemoveEqualizerSlider = async () => {
    try {
      const removeIndex = filters.length - 1;
      await removeEqualizerSlider(removeIndex);
      dispatchFilter({ type: FilterActionEnum.REMOVE, index: removeIndex });
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  return (
    <div className="center mainContent">
      <div className="col center bandLabel">
        <span className="rowLabel">Filter Type</span>
        <span className="rowLabel">Frequency (Hz)</span>
        <div className="col">
          <span>30dB</span>
          <span>0dB</span>
          <span>-30dB</span>
        </div>
        <span className="rowLabel">Gain (dB)</span>
        <span className="rowLabel">Quality</span>
      </div>
      <div className="bands row center">
        {filters.map((filter, sliderIndex) => (
          <FrequencyBand
            sliderIndex={sliderIndex}
            filter={filter}
            // eslint-disable-next-line react/no-array-index-key
            key={`slider-${sliderIndex}`}
          />
        ))}
      </div>
      <div className="col center sliderButtons">
        <Button
          ariaLabel="Add Equalizer Slider"
          isDisabled={filters.length >= MAX_NUM_FILTERS}
          className="sliderButton"
          handleChange={onAddEqualizerSlider}
        >
          <PlusIcon />
        </Button>
        <Button
          ariaLabel="Remove Equalizer Slider"
          isDisabled={filters.length <= MIN_NUM_FILTERS}
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
