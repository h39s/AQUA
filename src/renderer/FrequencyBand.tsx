import { ErrorDescription } from 'common/errors';
import {
  MAX_FREQUENCY,
  MAX_GAIN,
  MIN_FREQUENCY,
  MIN_GAIN,
} from 'common/peaceConversions';
import { useCallback, useContext, useEffect, useState } from 'react';
import { getFrequency, getGain, setFrequency, setGain } from './equalizerApi';
import NumberInput, { TNumberInput } from './NumberInput';
import { PeaceFoundContext } from './PeaceFoundContext';
import Slider from './Slider';
import './styles/MainContent.scss';

interface IFrequncyBandProps {
  sliderIndex: number;
}

const FrequencyBand = ({ sliderIndex }: IFrequncyBandProps) => {
  const [displayFrequency, setDisplayFrequncy] = useState<TNumberInput>('');
  const [actualFrequency, setActualFrequency] = useState<number>(0);

  const { peaceError, setPeaceError } = useContext(PeaceFoundContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const result = await getFrequency(sliderIndex);
        setActualFrequency(result);
        setDisplayFrequncy(result);
      } catch (e) {
        setPeaceError(e as ErrorDescription);
      }
    };
    if (!peaceError) {
      fetchResults();
    }
  }, [peaceError, setPeaceError, sliderIndex]);

  const handleChange = (newFrequency: TNumberInput) => {
    setDisplayFrequncy(newFrequency);
  };

  const handleSubmit = async (index: number) => {
    if (displayFrequency === '' || displayFrequency === '-') {
      return;
    }
    try {
      await setFrequency(index, displayFrequency as number);
      setActualFrequency(displayFrequency as number);
    } catch (e) {
      setPeaceError(e as ErrorDescription);
    }
  };

  const getSliderGain = useCallback(() => getGain(sliderIndex), [sliderIndex]);

  return (
    <div className="col band">
      {`${actualFrequency} Hz`}
      <NumberInput
        value={displayFrequency}
        min={MIN_FREQUENCY}
        max={MAX_FREQUENCY}
        name={`${displayFrequency}`}
        isDisabled={false}
        showLabel={false}
        handleChange={handleChange}
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
