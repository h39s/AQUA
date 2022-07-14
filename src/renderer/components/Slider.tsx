import { ErrorDescription } from 'common/errors';
import { useEffect, useMemo, useState } from 'react';
import NumberInput from '../widgets/NumberInput';
import RangeInput from '../widgets/RangeInput';
import { useAquaContext } from '../utils/AquaContext';
import '../styles/Slider.scss';
import { useThrottle } from '../utils/utils';

interface ISliderProps {
  name: string;
  min: number;
  max: number;
  getValue: () => Promise<number>;
  setValue: (newValue: number) => Promise<void>;
}

const Slider = ({ name, min, max, getValue, setValue }: ISliderProps) => {
  const INTERVAL = 200;
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { globalError, setGlobalError } = useAquaContext();

  const isDisabled = useMemo(
    () => !!globalError || isLoading,
    [globalError, isLoading]
  );

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const initValue = await getValue();
        setSliderValue(initValue);
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
      setIsLoading(false);
    };
    fetchResults();
  }, [getValue, setGlobalError]);

  const handleChangeGain = async (newValue: number) => {
    try {
      await setValue(newValue);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  const throttledSetValue = useThrottle(handleChangeGain, INTERVAL);

  // Helpers for adjusting the preamp gain value
  const handleChangeGainWithThrottle = async (newValue: number) => {
    setSliderValue(newValue);
    throttledSetValue(newValue);
  };

  const handleChangeGainWithoutThrottle = async (newValue: number) => {
    setSliderValue(newValue);
    handleChangeGain(newValue);
  };

  return (
    <div className="col center slider">
      <RangeInput
        name={`${name}-range`}
        value={sliderValue}
        min={min}
        max={max}
        handleChange={handleChangeGainWithThrottle}
        handleMouseUp={handleChangeGainWithoutThrottle}
        isDisabled={isDisabled}
      />
      <NumberInput
        name={`${name}-number`}
        value={sliderValue}
        min={min}
        max={max}
        handleSubmit={handleChangeGainWithoutThrottle}
        isDisabled={isDisabled}
        floatPrecision={1}
        shouldRoundToHalf
      />
    </div>
  );
};

export default Slider;
