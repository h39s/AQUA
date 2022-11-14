import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react';
import '../styles/TextInput.scss';

interface ITextInputProps {
  value: string;
  ariaLabel: string;
  isDisabled: boolean;
  handleChange: (newValue: string) => void;
}

const TextInput = forwardRef(
  (
    { value, ariaLabel, isDisabled, handleChange }: ITextInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [storedValue, setStoredValue] = useState<string>(value);

    useEffect(() => {
      setStoredValue(value);
    }, [value]);

    // Helper for detecting use of the ENTER key
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        handleChange(storedValue);
      }
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { value: input } = e.target;
      setStoredValue(input);
    };

    return (
      <input
        ref={ref}
        className="textInput"
        type="text"
        value={storedValue}
        aria-label={ariaLabel}
        onChange={onChange}
        onKeyDown={onKeyDown}
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
      />
    );
  }
);

export default TextInput;
