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
  handleEscape?: () => void;
  updateOnSubmitOnly?: boolean;
  errorMessage?: string;
}

const TextInput = forwardRef(
  (
    {
      value,
      ariaLabel,
      isDisabled,
      handleChange,
      handleEscape,
      updateOnSubmitOnly,
      errorMessage,
    }: ITextInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [storedValue, setStoredValue] = useState<string>(value);

    useEffect(() => {
      setStoredValue(value);
    }, [value]);

    // Helper for detecting use of the ENTER key
    const onKeyDown = (e: KeyboardEvent) => {
      if (handleEscape && (e.code === 'Escape' || e.code === 'Tab')) {
        handleEscape();
      }
      if (updateOnSubmitOnly && e.code === 'Enter') {
        handleChange(storedValue);
      }
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { value: input } = e.target;
      setStoredValue(input);
      if (!updateOnSubmitOnly) {
        handleChange(input);
      }
    };

    return (
      <div className="col text-input">
        <input
          ref={ref}
          type="text"
          value={storedValue}
          aria-label={ariaLabel}
          aria-invalid={!!errorMessage}
          aria-errormessage={errorMessage}
          onChange={onChange}
          onKeyDown={onKeyDown}
          tabIndex={isDisabled ? -1 : 0}
          aria-disabled={isDisabled}
        />
        <div>{errorMessage}</div>
      </div>
    );
  }
);

export default TextInput;
