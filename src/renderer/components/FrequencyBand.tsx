import { ErrorDescription } from 'common/errors';
import {
  FilterTypeEnum,
  IFilter,
  MAX_FREQUENCY,
  MAX_GAIN,
  MAX_QUALITY,
  MIN_FREQUENCY,
  MIN_GAIN,
  MIN_QUALITY,
} from 'common/constants';
import { useCallback, useEffect, useState } from 'react';
import Dropdown from '../widgets/Dropdown';
import {
  getFrequency,
  getGain,
  getQuality,
  getType,
  setFrequency,
  setGain,
  setQuality,
  setType,
} from '../utils/equalizerApi';
import NumberInput from '../widgets/NumberInput';
import { FilterActionEnum, useAquaContext } from '../utils/AquaContext';
import Slider from './Slider';
import '../styles/MainContent.scss';
import { FILTER_OPTIONS } from '../icons/FilterTypeIcon';

interface IFrequencyBandProps {
  sliderIndex: number;
  filter: IFilter;
}

const FrequencyBand = ({ sliderIndex, filter }: IFrequencyBandProps) => {
  // const [actualFrequency, setActualFrequency] = useState<number>(0);
  const [actualQuality, setActualQuality] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>(FilterTypeEnum.PK);

  const { globalError, setGlobalError, dispatchFilter } = useAquaContext();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let result = await getFrequency(sliderIndex);
        // setActualFrequency(result);
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
      dispatchFilter({
        type: FilterActionEnum.FREQUENCY,
        index: sliderIndex,
        newValue,
      });
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
        name={`${filter.frequency}-filter-type`}
        value={filterType}
        options={FILTER_OPTIONS}
        isDisabled={!!globalError}
        handleChange={handleFilterTypeSubmit}
      />
      <NumberInput
        value={filter.frequency}
        min={MIN_FREQUENCY}
        max={MAX_FREQUENCY}
        name={`${filter.frequency}-frequency`}
        isDisabled={!!globalError}
        showArrows
        handleSubmit={handleFrequencySubmit}
      />
      <div className="col center slider">
        <Slider
          name={`${filter.frequency}-gain`}
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
        name={`${filter.frequency}-quality`}
        isDisabled={!!globalError}
        floatPrecision={3}
        showArrows
        handleSubmit={handleQualitySubmit}
      />
    </div>
  );
};

export default FrequencyBand;
