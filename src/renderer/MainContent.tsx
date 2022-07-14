import { ErrorDescription } from 'common/errors';
import { MAX_NUM_FILTERS, MIN_NUM_FILTERS } from 'common/constants';
import { useEffect, useState } from 'react';
import {
  addEqualizerSlider,
  getEqualizerSliderCount,
  removeEqualizerSlider,
} from './utils/equalizerApi';
import FrequencyBand from './components/FrequencyBand';
import MinusIcon from './icons/MinusIcon';
import PlusIcon from './icons/PlusIcon';
import Button from './widgets/Button';
import { useAquaContext } from './utils/AquaContext';
import './styles/MainContent.scss';

const MainContent = () => {
  const { globalError, setGlobalError, filters } = useAquaContext();
  const [sliderIndices, setSliderIndices] = useState<number[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const sliderCount = await getEqualizerSliderCount();
        const newIndices = Array(sliderCount)
          .fill(0)
          .map((_, i) => i);
        setSliderIndices(newIndices);
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    };
    fetchResults();
  }, [globalError, setGlobalError]);

  const onAddEqualizerSlider = async () => {
    try {
      await addEqualizerSlider();
      const newIndices = [...sliderIndices];
      newIndices.push(sliderIndices.length);
      setSliderIndices(newIndices);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  const onRemoveEqualizerSlider = async () => {
    try {
      await removeEqualizerSlider(sliderIndices.length - 1);
      const newIndices = [...sliderIndices];
      newIndices.pop();
      setSliderIndices(newIndices);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  return (
    <>
      {filters.length === 0 ? (
        <div className="center full row">
          <h1>Loading...</h1>
        </div>
      ) : (
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
              isDisabled={sliderIndices.length >= MAX_NUM_FILTERS}
              className="sliderButton"
              handleChange={onAddEqualizerSlider}
            >
              <PlusIcon />
            </Button>
            <Button
              ariaLabel="Remove Equalizer Slider"
              isDisabled={sliderIndices.length <= MIN_NUM_FILTERS}
              className="sliderButton"
              handleChange={onRemoveEqualizerSlider}
            >
              <MinusIcon />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MainContent;
