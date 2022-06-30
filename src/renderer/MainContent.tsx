import { ErrorDescription } from 'common/errors';
import { useContext, useEffect, useState } from 'react';
import {
  addEqualizerSlider,
  getEqualizerSliderCount,
  removeEqualizerSlider,
} from './equalizerApi';
import FrequencyBand from './FrequencyBand';
import MinusIcon from './icons/MinusIcon';
import PlusIcon from './icons/PlusIcon';
import Button from './Button';
import { AquaContext } from './AquaContext';
import './styles/MainContent.scss';

const MainContent = () => {
  const { globalError, setGlobalError } = useContext(AquaContext);
  const [sliderIndicies, setSliderIndicies] = useState<number[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const sliderCount = await getEqualizerSliderCount();
        const newIndices = Array(sliderCount)
          .fill(0)
          .map((_, i) => i);
        setSliderIndicies(newIndices);
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    };
    fetchResults();
  }, [globalError, setGlobalError]);

  const onAddEqualizerSlider = async () => {
    try {
      await addEqualizerSlider();
      const newIndices = [...sliderIndicies];
      newIndices.push(sliderIndicies.length);
      setSliderIndicies(newIndices);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  const onRemoveEqualizerSlider = async () => {
    try {
      await removeEqualizerSlider(sliderIndicies.length - 1);
      const newIndices = [...sliderIndicies];
      newIndices.pop();
      setSliderIndicies(newIndices);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  return (
    <div className="row center mainContent">
      {sliderIndicies.length === 0 ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div className="col center bandLabel">
            <span className="rowLabel">Frequency (Hz)</span>
            <div className="col">
              <span>30dB</span>
              <span>0dB</span>
              <span>-30dB</span>
            </div>
            <span className="rowLabel">Gain (dB)</span>
          </div>
          {sliderIndicies.map((sliderIndex) => (
            <FrequencyBand
              sliderIndex={sliderIndex}
              key={`slider-${sliderIndex}`}
            />
          ))}
          <div className="col sliderButtons">
            <Button
              ariaLabel="Add Equalizer Slider"
              isDisabled={false}
              className="sliderButton"
              handleChange={onAddEqualizerSlider}
            >
              <PlusIcon />
            </Button>
            <Button
              ariaLabel="Remove Equalizer Slider"
              isDisabled={false}
              className="sliderButton"
              handleChange={onRemoveEqualizerSlider}
            >
              <MinusIcon />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MainContent;
