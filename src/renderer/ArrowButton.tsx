import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import ArrowIcon from './icons/ArrowIcon';
import { useInterval } from './utils';
import './styles/ArrowButton.scss';

interface IArrowButtonProps {
  name: string;
  type: 'up' | 'down';
  value: number;
  min: number;
  max: number;
  isDisabled: boolean;
  handleChange: (newValue: number) => Promise<void>;
}

const ArrowButton = ({
  name,
  type,
  value,
  min,
  max,
  isDisabled,
  handleChange,
}: IArrowButtonProps) => {
  const INTERVAL = 200;

  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  const isIncrement = useMemo(() => type === 'up', [type]);

  const handleDeltaChangeGain = useCallback(() => {
    if (value < max && isIncrement) {
      handleChange(value + 1);
    } else if (value > min && !isIncrement) {
      handleChange(value - 1);
    }
  }, [handleChange, isIncrement, max, min, value]);

  // Hooks for continuously increasing/decreasing gain
  useInterval(() => handleDeltaChangeGain(), isChanging ? INTERVAL : undefined);

  // Handlers for pausing continous change of the gain
  const stopChange = useCallback(() => {
    setIsChanging(false);
    buttonRef.current?.removeEventListener('mouseleave', stopChange);
  }, []);

  // Handlers for various input types
  const handleArrowInput = useCallback(() => {
    if (isDisabled) {
      return;
    }
    // Manually alter gain once to simulate click
    handleDeltaChangeGain();

    // Begin timer for continous adjustment
    setIsChanging(true);
    buttonRef.current?.addEventListener('mouseleave', stopChange);
  }, [handleDeltaChangeGain, isDisabled, stopChange]);

  // Helper for detecting use of the ENTER key
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleDeltaChangeGain();
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    handleArrowInput();
  };

  return (
    <div
      ref={buttonRef}
      role="button"
      aria-label={`${type === 'up' ? 'Increase' : 'Decrease'} ${name}`}
      className={`center arrow-${type}`}
      onMouseDown={onMouseDown}
      onMouseUp={stopChange}
      onKeyDown={onKeyDown}
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    >
      <ArrowIcon type={type} />
    </div>
  );
};

export default ArrowButton;
