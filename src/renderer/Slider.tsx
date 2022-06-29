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

  const handleChangeGain = async (newValue: number) => {
    try {
      await setValue(newValue);
    } catch (e) {
      setPeaceError(e as ErrorDescription);
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
        showLabel={false}
        showArrows={false}
        type="float"
        floatPrecision={0.1}
        round
      />
    </div>
  );
};

export default Slider;
