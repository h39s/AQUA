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
import './styles/NumberInput.scss';
import { clamp } from './utils';

type TNumberInput = number | '' | '-';

interface INumberInputProps {
  name: string;
  value: TNumberInput;
  min: number;
  max: number;
  isDisabled: boolean;
  showLabel: boolean;
  handleSubmit: (newValue: number) => void;
}

const NumberInput = ({
  name,
  value,
  min,
  max,
  isDisabled,
  showLabel,
  handleSubmit,
}: INumberInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<TNumberInput>(value);
  const [valueLength, setValueLength] = useState<number>(0);

  // Update input valueLength
  useLayoutEffect(() => {
    setValueLength(inputRef.current?.value.length || 0);
  }, [internalValue]);

  // Synchronize local input value with prop value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const hasChanges = useMemo(
    () => value !== internalValue,
    [internalValue, value]
  );

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: input } = e.target;
    const lastChar = input[input.length - 1];

    // Allow user to clear input and type an initial negative sign
    if (input === '' || (input === '-' && min < 0)) {
      setInternalValue(input);
      return;
    }

    // Prevent user from typing non-numerical values
    if (Number.isNaN(parseInt(lastChar, 10))) {
      return;
    }

    const newValue: number = parseInt(input, 10);
    setInternalValue(newValue);
  };

  // Helper for discarding changes
  const onBlur = () => {
    setInternalValue(value);
  };

  // Helper for detecting use of the ENTER or TAB keys
  const listenForEnter = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'Tab') {
      if (internalValue === '' || internalValue === '-') {
        return;
      }
      const newValue: number = clamp(internalValue, min, max);

      // Call handler on the parent
      handleSubmit(newValue);
    } else if (e.code === 'Escape') {
      onBlur();
    }
  };

  return (
    <label
      htmlFor={name}
      className="col center numberInput"
      // the ch unit supposedly uses the '0' as the per character valueLength
      style={{ '--input-width': `${valueLength}ch` } as CSSProperties}
    >
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
      {showLabel && name}
      {hasChanges && <span className="asterisk">*</span>}
    </label>
  );
};

export default NumberInput;
