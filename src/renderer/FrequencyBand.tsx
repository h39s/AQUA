import { ErrorDescription } from 'common/errors';
import {
  MAX_FREQUENCY,
  MAX_GAIN,
  MAX_QUALITY,
  MIN_FREQUENCY,
  MIN_GAIN,
  MIN_QUALITY,
} from 'common/constants';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  getFrequency,
  getGain,
  getQuality,
  setFrequency,
  setGain,
  setQuality,
} from './equalizerApi';
import NumberInput from './NumberInput';
import { AquaContext } from './AquaContext';
import Slider from './Slider';
import './styles/MainContent.scss';

interface IFrequencyBandProps {
  sliderIndex: number;
}

const FrequencyBand = ({ sliderIndex }: IFrequencyBandProps) => {
  const [actualFrequency, setActualFrequency] = useState<number>(0);
  const [actualQuality, setActualQuality] = useState<number>(0);

  const { globalError, setGlobalError } = useContext(AquaContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let result = await getFrequency(sliderIndex);
        setActualFrequency(result);
        result = await getQuality(sliderIndex);
        setActualQuality(result);
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    };
    fetchResults();
  }, [setGlobalError, sliderIndex]);

  const handleFrequencySubmit = async (newValue: number) => {
    try {
      await setFrequency(sliderIndex, newValue);
      setActualFrequency(newValue);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  const handleQualitySubmit = async (newValue: number) => {
    try {
      await setQuality(sliderIndex, newValue);
      setActualQuality(newValue);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  const getSliderGain = useCallback(() => getGain(sliderIndex), [sliderIndex]);

  return (
    <div className="col band">
      <NumberInput
        value={actualFrequency}
        min={MIN_FREQUENCY}
        max={MAX_FREQUENCY}
        name={`${actualFrequency}`}
        isDisabled={!!globalError}
        showArrows
        handleSubmit={handleFrequencySubmit}
      />
      <div className="col center slider">
        <Slider
          name={`${actualFrequency}-gain`}
          min={MIN_GAIN}
          max={MAX_GAIN}
          getValue={getSliderGain}
          setValue={(newValue: number) => setGain(sliderIndex, newValue)}
        />
        <NumberInput
          value={actualQuality}
          min={MIN_QUALITY}
          max={MAX_QUALITY}
          name={`${actualQuality}`}
          isDisabled={!!globalError}
          floatPrecision={3}
          handleSubmit={handleQualitySubmit}
        />
      </div>
    </div>
  );
};

export default FrequencyBand;
