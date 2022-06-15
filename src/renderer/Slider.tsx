import { ErrorDescription } from 'common/errors';
import { useEffect, useContext, useState } from 'react';
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
  const [preAmpGain, setPreAmpGain] = useState<number>(0);
  const [inputGain, setInputGain] = useState<number | '' | '-'>(0);

  const { peaceError, setPeaceError } = useContext(PeaceFoundContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const initValue = await getValue();
        setPreAmpGain(initValue);
        setInputGain(initValue);
      } catch (e) {
        setPeaceError(e as ErrorDescription);
      }
    };
    if (!peaceError) {
      fetchResults();
    }
  }, [getValue, peaceError, setPeaceError]);

  // Helpers for adjusting the preamp gain value
  const handleChangeGain = async (newValue: number) => {
    setPreAmpGain(newValue);
    setInputGain(newValue);
    try {
      await setValue(newValue);
    } catch (e) {
      setPeaceError(e as ErrorDescription);
    }
  };

  return (
    <div className="col center slider">
      <RangeInput
        name={name}
        value={preAmpGain}
        min={min}
        max={max}
        handleChange={handleChangeGain}
        isDisabled={!!peaceError}
      />
      <NumberInput
        name={name}
        value={inputGain}
        min={min}
        max={max}
        handleChange={setInputGain}
        handleSubmit={handleChangeGain}
        isDisabled={!!peaceError}
      />
    </div>
  );
};

export default Slider;
