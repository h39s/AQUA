import { ErrorDescription } from 'common/errors';
import {
  FilterTypeEnum,
  MAX_FREQUENCY,
  MAX_GAIN,
  MAX_QUALITY,
  MIN_FREQUENCY,
  MIN_GAIN,
  MIN_QUALITY,
} from 'common/constants';
import { useCallback, useContext, useEffect, useState } from 'react';
import Dropdown from './Dropdown';
import {
  getFrequency,
  getGain,
  getQuality,
  getType,
  setFrequency,
  setGain,
  setQuality,
  setType,
} from './equalizerApi';
import NumberInput from './NumberInput';
import { AquaContext } from './AquaContext';
import Slider from './Slider';
import './styles/MainContent.scss';
import { FILTER_OPTIONS } from './icons/FilterTypeIcon';

interface IFrequencyBandProps {
  sliderIndex: number;
}

const FrequencyBand = ({ sliderIndex }: IFrequencyBandProps) => {
  const [actualFrequency, setActualFrequency] = useState<number>(0);
  const [actualQuality, setActualQuality] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>(FilterTypeEnum.PEAK);

  const { globalError, setGlobalError } = useContext(AquaContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let result = await getFrequency(sliderIndex);
        setActualFrequency(result);
        result = await getQuality(sliderIndex);
        setActualQuality(result);
        setFilterType(await getType(sliderIndex));
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

  const handleFilterTypeSubmit = async (newValue: string) => {
    try {
      await setType(sliderIndex, newValue);
      setFilterType(newValue);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  const getSliderGain = useCallback(() => getGain(sliderIndex), [sliderIndex]);

  return (
    <div className="col band">
      <Dropdown
        name={`${actualFrequency}-filter-type`}
        value={filterType}
        options={FILTER_OPTIONS}
        isDisabled={!!globalError}
        handleChange={handleFilterTypeSubmit}
      />
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
      </div>
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
  );
};

export default FrequencyBand;
