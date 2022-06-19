import { ErrorDescription } from 'common/errors';
import { useEffect, useContext, useState, useMemo } from 'react';
import NumberInput from './NumberInput';
import RangeInput from './RangeInput';
import { PeaceFoundContext } from './PeaceFoundContext';
import './styles/Slider.scss';

interface ISliderProps {
  name: string;
  min: number;
  max: number;
  getValue: () => Promise<number>;
  setValue: (newValue: number) => Promise<void>;
}

const Slider = ({ name, min, max, getValue, setValue }: ISliderProps) => {
  const [rangeValue, setRangeValue] = useState<number>(0);
  const [inputValue, setInputValue] = useState<number | '' | '-'>(0);
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
        setRangeValue(initValue);
        setInputValue(initValue);
      } catch (e) {
        setPeaceError(e as ErrorDescription);
      }
      setIsLoading(false);
    };
    if (!peaceError) {
      fetchResults();
    }
  }, [getValue, peaceError, setPeaceError]);

  // Helpers for adjusting the preamp gain value
  const handleChangeGain = async (newValue: number) => {
    setRangeValue(newValue);
    setInputValue(newValue);
    try {
      await setValue(newValue);
    } catch (e) {
      setPeaceError(e as ErrorDescription);
    }
  };

  return (
    <div className="col center slider">
      <RangeInput
        name={`${name}-range`}
        value={rangeValue}
        min={min}
        max={max}
        handleChange={handleChangeGain}
        isDisabled={isDisabled}
      />
      <NumberInput
        name={`${name}-number`}
        value={inputValue}
        min={min}
        max={max}
        handleChange={setInputValue}
        handleSubmit={handleChangeGain}
        isDisabled={isDisabled}
        showLabel={false}
      />
    </div>
  );
};

export default Slider;
