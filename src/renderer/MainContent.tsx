import { ErrorDescription } from 'common/errors';
import { useContext, useEffect, useState } from 'react';
import {
  addEqualizerSlider,
  closePeaceWindow,
  getEqualizerSliderCount,
  getProgramState,
  removeEqualizerSlider,
  showPeaceWindow,
} from './equalizerApi';
import FrequencyBand from './FrequencyBand';
import MinusIcon from './icons/MinusIcon';
import PlusIcon from './icons/PlusIcon';
import LargeButton from './LargeButton';
import { PeaceFoundContext } from './PeaceFoundContext';
import './styles/MainContent.scss';

const MainContent = () => {
  const { peaceError, setPeaceError } = useContext(PeaceFoundContext);
  const [sliderIndicies, setSliderIndicies] = useState<number[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const sliderCount = await getEqualizerSliderCount();
        const newIndices = Array(sliderCount)
          .fill(0)
          .map((_, i) => i + 1);
        setSliderIndicies(newIndices);
      } catch (e) {
        setPeaceError(e as ErrorDescription);
      }
    };
    if (!peaceError) {
      fetchResults();
    }
  }, [peaceError, setPeaceError]);

  const onAddEqualizerSlider = async () => {
    try {
      await addEqualizerSlider();
    } catch (e) {
      setPeaceError(e as ErrorDescription);
      return;
    }
    for (let i = 0; i < 5; i += 1) {
      try {
        await getProgramState();
        await showPeaceWindow();
        const newIndices = [...sliderIndicies];
        newIndices.push(sliderIndicies.length + 1);
        setSliderIndicies(newIndices);
        break;
      } catch (e) {
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
      }
    }
    await closePeaceWindow();
  };

  const onRemoveEqualizerSlider = async () => {
    try {
      await removeEqualizerSlider();
    } catch (e) {
      setPeaceError(e as ErrorDescription);
      return;
    }
    for (let i = 0; i < 5; i += 1) {
      try {
        await getProgramState();
        const newIndices = [...sliderIndicies];
        newIndices.pop();
        setSliderIndicies(newIndices);
        break;
      } catch (e) {
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
      }
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
            <LargeButton
              ariaLabel=""
              isDisabled={false}
              handleChange={onAddEqualizerSlider}
            >
              <PlusIcon />
            </LargeButton>
            <LargeButton
              ariaLabel=""
              isDisabled={false}
              handleChange={onRemoveEqualizerSlider}
            >
              <MinusIcon />
            </LargeButton>
          </div>
        </>
      )}
    </div>
  );
};

export default MainContent;
