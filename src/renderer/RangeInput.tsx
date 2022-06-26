import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import ArrowIcon from './icons/ArrowIcon';
import { clamp, useInterval } from './utils';
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
