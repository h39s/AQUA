import { ChangeEvent, CSSProperties, useRef } from 'react';
import { clamp } from './utils';
import './styles/RangeInput.scss';
import ArrowButton from './ArrowButton';

interface IRangeInputProps {
  name: string;
  value: number;
  min: number;
  max: number;
  isDisabled: boolean;
  handleChange: (newValue: number) => Promise<void>;
}

const RangeInput = ({
  name,
  value,
  min,
  max,
  isDisabled,
  handleChange,
}: IRangeInputProps) => {
  // Store a copy of the last value so it isn't lost to the throttle
  const lastValue = useRef<number | undefined>(undefined);

  const onRangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue: number = clamp(parseInt(e.target.value, 10), min, max);
    lastValue.current = newValue;
    handleChange(newValue);
  };

  const onMouseUp = () => {
    // Apply the last value if it there is one associated to this input
    if (lastValue.current) {
      handleChange(lastValue.current);
      lastValue.current = undefined;
    }
  };

  return (
    <div className="col center range">
      <ArrowButton
        name={name}
        type="up"
        value={value}
        min={min}
        max={max}
        handleChange={handleChange}
        isDisabled={isDisabled}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        name={name}
        aria-label={name}
        onChange={onRangeInput}
        onMouseUp={onMouseUp}
        disabled={isDisabled}
        style={
          // Set css variables for determining upper/lower track
          {
            '--min': min,
            '--max': max,
            '--val': value,
          } as CSSProperties
        }
      />
      <ArrowButton
        name={name}
        type="down"
        value={value}
        min={min}
        max={max}
        handleChange={handleChange}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default RangeInput;
