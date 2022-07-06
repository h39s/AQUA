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

interface INumberInputProps {
  name: string;
  value: number;
  min: number;
  max: number;
  floatPrecision?: number;
  isDisabled: boolean;
  showArrows?: boolean;
  showLabel?: boolean;
  shouldRoundToHalf?: boolean;
  handleSubmit: (newValue: number) => Promise<void>;
}

const NumberInput = ({
  name,
  value,
  min,
  max,
  isDisabled,
  showArrows = false,
  floatPrecision = 0,
  shouldRoundToHalf = false,
  showLabel = false,
  handleSubmit,
}: INumberInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<string>(value.toString());
  const [valueLength, setValueLength] = useState<number>(0);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Update input valueLength
  useLayoutEffect(() => {
    setValueLength(inputRef.current?.value.length || 0);
  }, [internalValue]);

  // Synchronize local input value with prop value
  useEffect(() => {
    setInternalValue(value.toString());
  }, [value]);

  const precisionFactor: number = useMemo(
    () => 10 ** floatPrecision,
    [floatPrecision]
  );

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: input } = e.target;

    // Allow user to clear input and type an initial negative sign or period or 0.
    // In the case of integers, no subsequent characters are allowed after a 0
    if (
      input === '' ||
      input === '0' ||
      (input === '.' && floatPrecision > 0) ||
      (min < 0 && (input === '-' || input === '-0'))
    ) {
      setInternalValue(input);
      setHasChanges(input !== value.toString());
      return;
    }

    let num = NaN;
    if (precisionFactor === 1) {
      // If parseInt encounters a character that is not a numeral in the
      // specified radix, it ignores it and all succeeding characters and
      // returns the integer value parsed up to that point. parseInt truncates
      // numbers to integer values. Leading and trailing spaces are allowed.
      num = parseInt(input, 10);
      if (num.toString() !== input) {
        // illegal character in the input or number too large
        return;
      }
    } else {
      // If parseFloat encounters a character other than a plus sign (+),
      // minus sign (- U+002D HYPHEN-MINUS), numeral (0–9), decimal point (.),
      // or exponent (e or E), it returns the value up to that character,
      // ignoring the invalid character and characters following it.
      // We disallow e / E.
      if (input.match(/e|E/)) {
        return;
      }

      const isNegative = input.charAt(0) === '-';
      // Disallow the negative sign if the minimum is non-negative
      if (isNegative && min >= 0) {
        return;
      }

      // parseFloat("10.00") => 10. Since a user might input 10.001, we must
      // allow typing in "10.00". We'll append a 1 to avoid the truncation
      // of 0s done by parseFloat and see if the input is valid.
      // We support .123, 0.123, -0.123, -.123. To support this,
      // we'll prefix the decimal to ensure that the subsequent equality
      // check works correctly
      const positiveInput = isNegative ? input.substring(1) : input;
      const testInput = `${
        positiveInput.charAt(0) === '.' ? '0' : ''
      }${positiveInput}1`;
      num = parseFloat(testInput);

      if (num.toString() !== testInput) {
        // illegal character in the input
        return;
      }
    }

    // Prevent user from typing numbers that are too large or use more than 7 characters
    if (Math.abs(num) >= 100000 || input.length > 7) {
      return;
    }

    setHasChanges(input !== value.toString());
    setInternalValue(input);
  };

  // Helper for discarding changes
  const onBlur = () => {
    setHasChanges(false);
    setInternalValue(value.toString());
  };

  const onArrow = async (isIncrement: boolean) => {
    const offset = isIncrement ? precisionFactor : precisionFactor * -1;
    // Treat internalValue as a 0 if it is empty or only a negative sign
    const newValue = clamp(offset + value, min, max);
    setInternalValue(newValue.toString());
    setHasChanges(false);
    handleSubmit(newValue);
  };

  // Helper for detecting use of the ENTER or TAB keys
  const listenForEnter = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'Tab') {
      let num = NaN;
      if (floatPrecision === 0) {
        num = parseInt(internalValue, 10);
      } else {
        // 20.6031, round to 20.605
        // 20.6031 => multiply precisionFactor and floor to truncate
        // => 20603.1 => 20603
        // if round divide by 10
        // => 2060.3 => 4120.6 => 4121 => 2060.5
        // then multiply by 10
        // => 20605
        // finally divide precisionFactor
        num = parseFloat(internalValue);
        num = Math.round(num * precisionFactor);
        if (shouldRoundToHalf) {
          num = Math.round(num / 5) * 5;
        }
        num /= precisionFactor;
      }
      if (Number.isNaN(num)) {
        return;
      }
      const newValue: number = clamp(num, min, max);

      setHasChanges(false);
      if (newValue === value) {
        // Need this because useEffect would otherwise not trigger
        // since value would not change after we call handleSubmit
        setInternalValue(value.toString());
      }
      // Call handler on the parent
      handleSubmit(newValue);
    } else if (e.code === 'Escape') {
      onBlur();
    }
  };

  return (
    <label
      htmlFor={name}
      className="numberInput"
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
              handleChange={() => onArrow(true)}
              isDisabled={isDisabled}
            />
            <ArrowButton
              name={name}
              type="down"
              handleChange={() => onArrow(false)}
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
