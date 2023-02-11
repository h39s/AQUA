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
import IconButton, { IconName } from 'renderer/widgets/IconButton';
import {
  ForwardedRef,
  forwardRef,
  useMemo,
  useState,
  WheelEvent,
  CSSProperties,
  useCallback,
} from 'react';
import { useThrottleAndExecuteLatest } from 'renderer/utils/utils';
import { FILTER_OPTIONS } from '../icons/FilterTypeIcon';
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
  style?: CSSProperties;
}

const FrequencyBand = forwardRef(
  (
    { sliderIndex, filter, isMinSliderCount, style }: IFrequencyBandProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const INTERVAL = 100;
    const { isGraphViewOn, globalError, setGlobalError, dispatchFilter } =
      useAquaContext();
    const [isLoading, setIsLoading] = useState(false);
    const isRemoveDisabled = useMemo(
      () => isMinSliderCount || isLoading,
      [isLoading, isMinSliderCount]
    );

    const throttleSetGain = useThrottleAndExecuteLatest(
      async (newValue: number) => {
        /*
        Always dispatch first so that we don't see jitter in the sliders.
        This is because dispatch will trigger the ui rerender and ensure user inputs do not get
        out of order. This means that the backend will be "behind" what the frontend shows, but
        thats okay. In case of a backend error, we will rollback to the last backend snapshot.
        Consider the following case where the user increases the gain twice when we setGain first.
        On the first increase input, slider updates but we are stuck on setGain.
        On the second increase input, slider updates and the 2nd setGain is delayed by this hook.
        Then first setGain finishes and we dispatch. This results in the jitter.
        2nd setGain finishes and we dispatch again. Another jitter occurs.
        Note that the final UI state is correct, but the ui changes are strange.
      */
        dispatchFilter({
          type: FilterActionEnum.GAIN,
          id: filter.id,
          newValue,
        });
        await setGain(sliderIndex, newValue);
      },
      INTERVAL
    );

    const throttleSetQuality = useThrottleAndExecuteLatest(
      async (newValue: number) => {
        dispatchFilter({
          type: FilterActionEnum.QUALITY,
          id: filter.id,
          newValue,
        });
        await setQuality(sliderIndex, newValue);
      },
      INTERVAL
    );

    const handleGainSubmit = useCallback(
      async (newValue: number) => {
        try {
          await throttleSetGain(newValue);
          dispatchFilter({
            type: FilterActionEnum.GAIN,
            id: filter.id,
            newValue,
          });
        } catch (e) {
          setGlobalError(e as ErrorDescription);
        }
      },
      [dispatchFilter, filter.id, setGlobalError, throttleSetGain]
    );

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
        await throttleSetQuality(newValue);
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

    const onWheelFrequency = (e: WheelEvent) => {
      const ranges = [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 1];
      const range = ranges.find((bound) => bound <= filter.frequency);
      const offset = range ? range / 10 : 1;
      return e.deltaY < 0
        ? offset // scroll up
        : offset * -1; // scroll down
    };

    const sliderHeight = useMemo(
      // TODO: improve comments here
      // () => height - 100 - 2 * 80 - 3 * 20 - 3 * 16 - 2 * 23 - 2 * 4 - 2 * 8 - 36,
      () => (isGraphViewOn ? '286px' : 'calc(100vh - 340px)'),
      [isGraphViewOn]
    );

    return (
      // Need to specify the id here for the sorting to work
      <div ref={ref} id={filter.id} className="col bandWrapper" style={style}>
        <IconButton
          icon={IconName.TRASH}
          className="removeFilter"
          handleClick={onRemoveEqualizerSlider}
          isDisabled={isRemoveDisabled}
        />
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
            onWheelValueChange={onWheelFrequency}
          />
          <div className="col center slider">
            <Slider
              name={`${filter.frequency}-gain`}
              min={MIN_GAIN}
              max={MAX_GAIN}
              value={filter.gain}
              sliderHeight={sliderHeight}
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
