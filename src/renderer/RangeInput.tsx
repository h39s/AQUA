import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import SliderArrowIcon from './icons/SliderArrowIcon';
import { clamp, useInterval } from './utils';
import './styles/RangeInput.scss';

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
  const INTERVAL = 200;

  const increaseButtonRef = useRef<HTMLDivElement | null>(null);
  const decreaseButtonRef = useRef<HTMLDivElement | null>(null);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [isDecreasing, setIsDecreasing] = useState(false);

  const handleDeltaChangeGain = useCallback(
    (isIncrement: boolean) => {
      if (value < max && isIncrement) {
        handleChange(value + 1);
      } else if (value > min && !isIncrement) {
        handleChange(value - 1);
      }
    },
    [handleChange, max, min, value]
  );

  // Hooks for continuously increasing/decreasing gain
  useInterval(
    () => handleDeltaChangeGain(true),
    isIncreasing ? INTERVAL : undefined
  );

  useInterval(
    () => handleDeltaChangeGain(false),
    isDecreasing ? INTERVAL : undefined
  );

  // Handlers for pausing continous change of the gain
  const stopIncrement = useCallback(() => {
    setIsIncreasing(false);
    increaseButtonRef.current?.removeEventListener('mouseleave', stopIncrement);
  }, []);

  const stopDecrement = useCallback(() => {
    setIsDecreasing(false);
    decreaseButtonRef.current?.removeEventListener('mouseleave', stopDecrement);
  }, []);

  // Handlers for various input types
  const handleArrowInput = useCallback(
    (isIncrement: boolean) => {
      if (isDisabled) {
        return;
      }
      if (isIncrement) {
        // Manually alter gain once to simulate click
        handleDeltaChangeGain(true);

        // Begin timer for continous adjustment
        setIsIncreasing(true);
        increaseButtonRef.current?.addEventListener(
          'mouseleave',
          stopIncrement
        );
      } else {
        // Manually alter gain once to simulate click
        handleDeltaChangeGain(false);

        // Begin timer for continous adjustment
        setIsDecreasing(true);
        decreaseButtonRef.current?.addEventListener(
          'mouseleave',
          stopDecrement
        );
      }
    },
    [handleDeltaChangeGain, isDisabled, stopDecrement, stopIncrement]
  );

  const handleRangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue: number = clamp(parseInt(e.target.value, 10), min, max);
    handleChange(newValue);
  };

  // Helper for detecting use of the ENTER key
  const listenForEnter = (e: KeyboardEvent, handler: () => void) => {
    if (e.code === 'Enter') {
      handler();
    }
  };

  return (
    <div className="col center range">
      <div
        ref={increaseButtonRef}
        role="button"
        aria-label={`Increase ${name}`}
        className="center range-top"
        onMouseDown={() => handleArrowInput(true)}
        onMouseUp={stopIncrement}
        onKeyDown={(e) => listenForEnter(e, () => handleDeltaChangeGain(true))}
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
      >
        <SliderArrowIcon type="up" />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        name={name}
        aria-label={name}
        onChange={handleRangeInput}
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
      <div
        ref={decreaseButtonRef}
        role="button"
        aria-label={`Decrease ${name}`}
        className="center range-bottom"
        onMouseDown={() => handleArrowInput(false)}
        onMouseUp={stopDecrement}
        onKeyDown={(e) => listenForEnter(e, () => handleDeltaChangeGain(false))}
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
      >
        <SliderArrowIcon type="down" />
      </div>
    </div>
  );
};

export default RangeInput;
