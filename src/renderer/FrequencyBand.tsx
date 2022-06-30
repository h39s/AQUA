import { ErrorDescription } from 'common/errors';
import {
  MAX_FREQUENCY,
  MAX_GAIN,
  MIN_FREQUENCY,
  MIN_GAIN,
} from 'common/constants';
import { useCallback, useContext, useEffect, useState } from 'react';
import { getFrequency, getGain, setFrequency, setGain } from './equalizerApi';
import NumberInput from './NumberInput';
import { AquaContext } from './AquaContext';
import Slider from './Slider';
import './styles/MainContent.scss';

interface IFrequencyBandProps {
  sliderIndex: number;
}

const FrequencyBand = ({ sliderIndex }: IFrequencyBandProps) => {
  const [actualFrequency, setActualFrequency] = useState<number>(0);

  const { globalError, setGlobalError } = useContext(AquaContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const result = await getFrequency(sliderIndex);
        setActualFrequency(result);
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    };
    fetchResults();
  }, [setGlobalError, sliderIndex]);

  const handleSubmit = async (newValue: number) => {
    try {
      await setFrequency(sliderIndex, newValue);
      setActualFrequency(newValue);
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
        showLabel={false}
        showArrows
        handleSubmit={handleSubmit}
      />
      <Slider
        name={`${actualFrequency}-gain`}
        min={MIN_GAIN}
        max={MAX_GAIN}
        getValue={getSliderGain}
        setValue={(newValue: number) => setGain(sliderIndex, newValue)}
      />
    </div>
  );
};

export default FrequencyBand;
