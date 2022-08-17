import { ChangeEvent, CSSProperties, useMemo, useRef } from 'react';
import ArrowButton from './ArrowButton';
import '../styles/RangeInput.scss';
import { clamp } from '../utils/utils';

interface IRangeInputProps {
  name: string;
  value: number;
  min: number;
  max: number;
  isDisabled: boolean;
  incrementPrecision?: number;
  displayPrecision?: number;
  width: number;
  handleChange: (newValue: number) => Promise<void>;
  handleMouseUp: (newValue: number) => Promise<void>;
}

const RangeInput = ({
  name,
  value,
  min,
  max,
  isDisabled,
  incrementPrecision = 0,
  displayPrecision = 1,
  width,
  handleChange,
  handleMouseUp,
}: IRangeInputProps) => {
  // Store a copy of the last value so it isn't lost to the throttle
  const lastValue = useRef<number | undefined>(undefined);
  const factor = useMemo(() => 10 ** displayPrecision, [displayPrecision]);

  // Simplify the value so that the css variables have a smaller range of values to work with
  const rangeValue = useMemo(() => Math.round(value), [value]);

  const increment = useMemo(
    () => 1 / 10 ** incrementPrecision,
    [incrementPrecision]
  );
  const step = useMemo(
    () => Math.round(increment + (value - Math.round(value)) * factor) / factor,
    [factor, increment, value]
  );

  const onRangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue: number =
      Math.round(clamp(parseFloat(e.target.value), min, max) * factor) / factor;
    lastValue.current = newValue;
    handleChange(newValue);
  };

  const onArrowInput = (isIncrement: boolean) => {
    const offset = isIncrement ? increment : -increment;
    const newValue =
      Math.round(clamp(offset + value, min, max) * factor) / factor;
    handleChange(newValue);
  };

  const onMouseUp = () => {
    // Apply the last value if it there is one associated to this input
    if (lastValue.current !== undefined) {
      handleMouseUp(lastValue.current);
      lastValue.current = undefined;
    }
  };

  return (
    <div className="col center range">
      <ArrowButton
        name={name}
        type="up"
        handleChange={() => onArrowInput(true)}
        isDisabled={isDisabled}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={rangeValue}
        step={step}
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
            width: `${width}px`,
            margin: `${width / 2}px 0px`,
          } as CSSProperties
        }
      />
      <ArrowButton
        name={name}
        type="down"
        handleChange={() => onArrowInput(false)}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default RangeInput;
