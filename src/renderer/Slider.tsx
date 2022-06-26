import { ErrorDescription } from 'common/errors';
import { useEffect, useContext, useState, useMemo } from 'react';
import NumberInput from './NumberInput';
import RangeInput from './RangeInput';
import { PeaceFoundContext } from './PeaceFoundContext';
import './styles/Slider.scss';
import { useThrottle } from './utils';

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
  const { peaceError, setPeaceError } = useContext(PeaceFoundContext);

  const isDisabled = useMemo(
    () => !!peaceError || isLoading,
    [peaceError, isLoading]
  );

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const initValue = await getValue();
        setSliderValue(initValue);
      } catch (e) {
        setPeaceError(e as ErrorDescription);
      }
      setIsLoading(false);
    };
    if (!peaceError) {
      fetchResults();
    }
  }, [getValue, peaceError, setPeaceError]);

  const throttledSetValue = useThrottle(async (newValue: number) => {
    try {
      await setValue(newValue);
    } catch (e) {
      setPeaceError(e as ErrorDescription);
    }
  }, INTERVAL);

  // Helpers for adjusting the preamp gain value
  const handleChangeGain = async (newValue: number) => {
    setSliderValue(newValue);
    try {
      throttledSetValue(newValue);
    } catch (e) {
      setPeaceError(e as ErrorDescription);
    }
  };

  return (
    <div className="col center slider">
      <RangeInput
        name={`${name}-range`}
        value={sliderValue}
        min={min}
        max={max}
        handleChange={handleChangeGain}
        isDisabled={isDisabled}
      />
      <NumberInput
        name={`${name}-number`}
        value={sliderValue}
        min={min}
        max={max}
        handleSubmit={handleChangeGain}
        isDisabled={isDisabled}
        showLabel={false}
        showArrows={false}
      />
    </div>
  );
};

export default Slider;
