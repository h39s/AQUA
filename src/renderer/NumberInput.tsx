import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ArrowButton from './ArrowButton';
import './styles/NumberInput.scss';
import { clamp } from './utils';

type TNumberInput = number | '' | '-';

interface INumberInputProps {
  name: string;
  value: TNumberInput;
  min: number;
  max: number;
  isDisabled: boolean;
  showArrows: boolean;
  showLabel: boolean;
  handleSubmit: (newValue: number) => Promise<void>;
}

const NumberInput = ({
  name,
  value,
  min,
  max,
  isDisabled,
  showArrows,
  showLabel,
  handleSubmit,
}: INumberInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<TNumberInput>(value);
  const [valueLength, setValueLength] = useState<number>(0);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Update input valueLength
  useLayoutEffect(() => {
    setValueLength(inputRef.current?.value.length || 0);
  }, [internalValue]);

  // Synchronize local input value with prop value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const numericalValue: number = useMemo(() => {
    if (value === '' || value === '-') {
      return 0;
    }
    return value;
  }, [value]);

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: input } = e.target;
    const lastChar = input[input.length - 1];

    // Allow user to clear input and type an initial negative sign
    if (input === '' || (input === '-' && min < 0)) {
      setInternalValue(input);
      setHasChanges(true);
      return;
    }

    // Prevent user from typing non-numerical values
    if (Number.isNaN(parseInt(lastChar, 10))) {
      return;
    }

    const newValue: number = parseInt(input, 10);
    // Prevent user from typing numbers with more than 5 digits
    if (newValue / 100000 > 1) {
      return;
    }
    setHasChanges(input !== value);
    setInternalValue(newValue);
  };

  // Helper for discarding changes
  const onBlur = () => {
    setHasChanges(false);
    setInternalValue(value);
  };

  const onArrow = async (newValue: number) => {
    setInternalValue(newValue);
    setHasChanges(false);
    handleSubmit(newValue);
  };

  // Helper for detecting use of the ENTER or TAB keys
  const listenForEnter = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'Tab') {
      if (internalValue === '' || internalValue === '-') {
        return;
      }
      const newValue: number = clamp(internalValue, min, max);

      setHasChanges(false);
      // Call handler on the parent
      handleSubmit(newValue);
    } else if (e.code === 'Escape') {
      onBlur();
    }
  };

  return (
    <label
      htmlFor={name}
      className="numberInput col center"
      // the ch unit supposedly uses the '0' as the per character valueLength
      style={{ '--input-width': `${valueLength}ch` } as CSSProperties}
    >
      <div className="inputWrapper row center">
        <input
          ref={inputRef}
          type="text"
          name={name}
          aria-label={name}
          value={internalValue}
          onInput={onInput}
          onBlur={onBlur}
          onKeyDown={listenForEnter}
          disabled={isDisabled}
        />
        {hasChanges && <span className="asterisk">*</span>}
        {showArrows && (
          <div className="arrows">
            <ArrowButton
              name={name}
              type="up"
              value={numericalValue}
              min={min}
              max={max}
              handleChange={onArrow}
              isDisabled={isDisabled}
            />
            <ArrowButton
              name={name}
              type="down"
              value={numericalValue}
              min={min}
              max={max}
              handleChange={onArrow}
              isDisabled={isDisabled}
            />
          </div>
        )}
      </div>
      {showLabel && name}
    </label>
  );
};

export default NumberInput;
