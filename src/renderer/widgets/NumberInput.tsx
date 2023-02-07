import {
  ChangeEvent,
  WheelEvent,
  CSSProperties,
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ArrowButton from './ArrowButton';
import '../styles/NumberInput.scss';
import { clamp, getMaxIntegerDigitCount } from '../utils/utils';

interface INumberInputProps {
  name: string;
  value: number;
  min: number;
  max: number;
  isDisabled: boolean;
  floatPrecision?: number;
  showArrows?: boolean;
  showLabel?: boolean;
  shouldRoundToHalf?: boolean;
  shouldAutoGrow?: boolean;
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
  shouldAutoGrow = false,
  handleSubmit,
}: INumberInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<string>(
    value.toFixed(floatPrecision)
  );
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const maxChars = useMemo(() => {
    const minDigitCount = getMaxIntegerDigitCount(min);
    const maxDigitCount = getMaxIntegerDigitCount(max);

    const maxIntegerDigits = Math.max(minDigitCount, maxDigitCount);

    const negativeOffset = min < 0 ? 1 : 0;
    const floatOffset = floatPrecision > 0 ? 1 : 0;
    return maxIntegerDigits + floatPrecision + negativeOffset + floatOffset;
  }, [floatPrecision, max, min]);
  const [valueLength, setValueLength] = useState<number>(maxChars);

  // Update input valueLength
  useLayoutEffect(() => {
    if (shouldAutoGrow) {
      setValueLength(inputRef.current?.value.length || 0);
    }
  }, [internalValue, shouldAutoGrow]);

  // Synchronize local input value with prop value
  useEffect(() => {
    setInternalValue(value.toFixed(floatPrecision));
  }, [floatPrecision, value]);

  const precisionFactor: number = useMemo(
    () => 10 ** floatPrecision,
    [floatPrecision]
  );

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: input } = e.target;

    // Allow user to clear input and type an initial negative sign or period or nothing.
    // In the case of integers, no subsequent characters are allowed after a 0
    if (
      input === '' ||
      (input === '.' && floatPrecision > 0) ||
      (min < 0 && input === '-')
    ) {
      setInternalValue(input);
      setHasChanges(input !== value.toString());
      return;
    }

    const isNegative = input.charAt(0) === '-';
    // Disallow the negative sign if the minimum is non-negative
    if (isNegative && min >= 0) {
      return;
    }

    let num = NaN;
    if (precisionFactor === 1) {
      // If parseInt encounters a character that is not a numeral in the
      // specified radix, it ignores it and all succeeding characters and
      // returns the integer value parsed up to that point. parseInt truncates
      // numbers to integer values. Leading and trailing spaces are allowed.
      num = parseInt(input, 10);

      // Parsed value should match the string input
      if (num !== 0 && num.toString() !== input) {
        // illegal character in the input or number too large
        return;
      }

      // When the numerical value is 0, only allow a string containing 0s
      const zeroCount = input.match(/0/g)?.length || 0;
      const positiveInput = isNegative ? input.substring(1) : input;
      if (num === 0 && zeroCount !== positiveInput.length) {
        return;
      }
    } else {
      const decimalCount = input.match(/\./g)?.length || 0;

      // If parseFloat encounters a character other than a plus sign (+),
      // minus sign (- U+002D HYPHEN-MINUS), numeral (0–9), decimal point (.),
      // or exponent (e or E), it returns the value up to that character,
      // ignoring the invalid character and characters following it.
      // We disallow e / E, multiple -'ve signs and multiple decimal points
      if (
        input.match(/e|E/) ||
        (input.match(/-/g)?.length || 0) > 1 ||
        decimalCount > 1
      ) {
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
      const testNum = parseFloat(testInput);
      num = parseFloat(input);

      // Parsed value should match the string input
      if (num !== 0 && testNum.toString() !== testInput) {
        // illegal character in the input
        return;
      }

      // When the actual numerical value is 0, only allow a string containing
      // - any number of 0s and
      // - at most one decimal point
      // - at most one negative sign
      const zeroCount = positiveInput.match(/0/g)?.length || 0;
      if (num === 0 && zeroCount + decimalCount !== positiveInput.length) {
        return;
      }
    }

    // Prevent user from typing numbers that are too large or use more than maxChars numerical digits
    if (input.length > maxChars) {
      return;
    }

    setHasChanges(input !== value.toString());
    setInternalValue(input);
  };

  // Helper for discarding changes
  const onDiscard = () => {
    setHasChanges(false);
    setInternalValue(value.toFixed(floatPrecision));
  };

  const onSubmit = async () => {
    if (
      internalValue === '' ||
      internalValue === '-' ||
      internalValue === '.'
    ) {
      onDiscard();
      return;
    }

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
      setInternalValue(newValue.toFixed(floatPrecision));
    }
    // Call handler on the parent
    await handleSubmit(newValue);
  };

  const updateValue = async (offset: number) => {
    // Need to round the value because of floating addition imprecision
    let newValue = clamp(offset + value, min, max);
    newValue = Math.round(newValue * precisionFactor) / precisionFactor;
    setInternalValue(newValue.toFixed(floatPrecision));
    setHasChanges(false);
    handleSubmit(newValue);
  };

  const onArrow = async (isIncrement: boolean) => {
    const offset = isIncrement
      ? 1 / precisionFactor
      : (1 / precisionFactor) * -1;
    updateValue(offset);
  };

  const onWheel = (e: WheelEvent) => {
    // Wheel has a higher granularity than the arrows
    const offset =
      e.deltaY < 0
        ? (1 / precisionFactor) * 10 // scroll up
        : (1 / precisionFactor) * -10; // scroll down
    updateValue(offset);
  };

  // Helper for detecting use of the ENTER or TAB keys
  const listenForEnter = async (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'Tab') {
      // Blur input to trigger the onSubmit handler
      inputRef.current?.blur();
    } else if (e.code === 'Escape') {
      onDiscard();
      inputRef.current?.blur();
    }
  };

  return (
    <label
      htmlFor={name}
      className="number-input"
      // the ch unit supposedly uses the '0' as the per character valueLength
      style={{ '--input-width': `${valueLength}ch` } as CSSProperties}
    >
      <div className="input-wrapper row center">
        <input
          ref={inputRef}
          type="text"
          name={name}
          aria-label={name}
          value={internalValue}
          onInput={onInput}
          onBlur={onSubmit}
          onKeyDown={listenForEnter}
          onWheel={showArrows ? onWheel : undefined}
          disabled={isDisabled}
          style={{ textAlign: showArrows ? 'left' : 'center' }}
        />
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
        {hasChanges && (
          <span
            className="asterisk"
            style={{ paddingLeft: showArrows ? '12px' : '' }}
          >
            *
          </span>
        )}
      </div>
      {showLabel && name}
    </label>
  );
};

export default NumberInput;
