import { useEffect, useState } from 'react';
import NumberInput from '../widgets/NumberInput';
import RangeInput from '../widgets/RangeInput';
import { useAquaContext } from '../utils/AquaContext';
import '../styles/Slider.scss';
import { useThrottle } from '../utils/utils';

interface ISliderProps {
  name: string;
  min: number;
  max: number;
  value: number;
  setValue: (newValue: number) => Promise<void>;
}

const Slider = ({ name, min, max, value, setValue }: ISliderProps) => {
  const INTERVAL = 200;
  const { globalError } = useAquaContext();

  // Local copy of slider value used so that the number input increases smoothly while throttling EQ APO writes
  const [sliderValue, setSliderValue] = useState<number>(value);

  useEffect(() => {
    // TODO: investigate whether this is the best way to synchronize values
    setSliderValue(value);
  }, [value]);

  const handleChangeValue = async (newValue: number) => {
    await setValue(newValue);
  };

  const throttledSetValue = useThrottle(handleChangeValue, INTERVAL);

  // Helpers for adjusting the preamp gain value
  const handleChangeValueWithThrottle = async (newValue: number) => {
    setSliderValue(newValue);
    throttledSetValue(newValue);
  };

  const handleChangeValueWithoutThrottle = async (newValue: number) => {
    setSliderValue(newValue);
    handleChangeValue(newValue);
  };

  return (
    <div className="col center slider">
      <RangeInput
        name={`${name}-range`}
        value={sliderValue}
        min={min}
        max={max}
        handleChange={handleChangeValueWithThrottle}
        handleMouseUp={handleChangeValueWithoutThrottle}
        isDisabled={!!globalError}
      />
      <NumberInput
        name={`${name}-number`}
        value={sliderValue}
        min={min}
        max={max}
        handleSubmit={handleChangeValueWithoutThrottle}
        isDisabled={!!globalError}
        floatPrecision={2}
      />
    </div>
  );
};

export default Slider;
