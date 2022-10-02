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
import {
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
  useMemo,
  useState,
} from 'react';
import { FILTER_OPTIONS } from '../icons/FilterTypeIcon';
import TrashIcon from '../icons/TrashIcon';
import Dropdown from '../widgets/Dropdown';
import {
  removeEqualizerSlider,
  setFrequency,
  setGain,
  setQuality,
  setType,
} from '../utils/equalizerApi';
import NumberInput from '../widgets/NumberInput';
import { FilterActionEnum, useAquaContext } from '../utils/AquaContext';
import Slider from './Slider';
import '../styles/FrequencyBand.scss';

interface IFrequencyBandProps {
  sliderIndex: number;
  filter: IFilter;
  isMinSliderCount: boolean;
}

const FrequencyBand = forwardRef(
  (
    { sliderIndex, filter, isMinSliderCount }: IFrequencyBandProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { globalError, setGlobalError, dispatchFilter } = useAquaContext();
    const [isLoading, setIsLoading] = useState(false);
    const isRemoveDisabled = useMemo(
      () => isMinSliderCount || isLoading,
      [isLoading, isMinSliderCount]
    );

    const handleGainSubmit = async (newValue: number) => {
      try {
        await setGain(sliderIndex, newValue);
        dispatchFilter({
          type: FilterActionEnum.GAIN,
          id: filter.id,
          newValue,
        });
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    };

    const handleFrequencySubmit = async (newValue: number) => {
      try {
        await setFrequency(sliderIndex, newValue);
        dispatchFilter({
          type: FilterActionEnum.FREQUENCY,
          id: filter.id,
          newValue,
        });
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    };

    const handleQualitySubmit = async (newValue: number) => {
      try {
        await setQuality(sliderIndex, newValue);
        dispatchFilter({
          type: FilterActionEnum.QUALITY,
          id: filter.id,
          newValue,
        });
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    };

    const handleFilterTypeSubmit = async (newValue: string) => {
      try {
        await setType(sliderIndex, newValue);
        dispatchFilter({
          type: FilterActionEnum.TYPE,
          id: filter.id,
          newValue: newValue as FilterTypeEnum,
        });
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    };

    const onRemoveEqualizerSlider = async () => {
      if (isRemoveDisabled) {
        return;
      }

      setIsLoading(true);
      try {
        await removeEqualizerSlider(sliderIndex);
        dispatchFilter({ type: FilterActionEnum.REMOVE, id: filter.id });
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
      setIsLoading(false);
    };

    const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.code === 'Enter') {
        onRemoveEqualizerSlider();
      }
    };

    return (
      // Need to specify the id here for the sorting to work
      <div ref={ref} id={filter.id} className="col bandWrapper">
        <div
          role="button"
          className="removeFilter"
          onClick={onRemoveEqualizerSlider}
          onKeyUp={handleKeyUp}
          tabIndex={0}
          aria-disabled={isRemoveDisabled}
        >
          <TrashIcon />
        </div>
        <div className="col band">
          <Dropdown
            name={`${filter.frequency}-filter-type`}
            value={filter.type}
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
              value={filter.gain}
              sliderHeight={250}
              setValue={handleGainSubmit}
            />
          </div>
          <NumberInput
            value={filter.quality}
            min={MIN_QUALITY}
            max={MAX_QUALITY}
            name={`${filter.frequency}-quality`}
            isDisabled={!!globalError}
            floatPrecision={2}
            showArrows
            handleSubmit={handleQualitySubmit}
          />
        </div>
      </div>
    );
  }
);

export default FrequencyBand;
