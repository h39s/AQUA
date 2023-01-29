import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import '../styles/TextInput.scss';

interface ITextInputProps {
  value: string;
  ariaLabel: string;
  isDisabled: boolean;
  errorMessage: string;
  handleChange: (newValue: string) => void;
  handleEscape?: () => void;
  updateOnSubmitOnly?: boolean;
  formatInput?: (value: string) => string;
}

const TextInput = forwardRef(
  (
    {
      value,
      ariaLabel,
      isDisabled,
      errorMessage,
      handleChange,
      handleEscape,
      updateOnSubmitOnly,
      formatInput = (s) => s,
    }: ITextInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [storedValue, setStoredValue] = useState<string>(value);
    const prevValue = useRef<string>(value);

    useEffect(() => {
      setStoredValue(value);
      prevValue.current = value;
    }, [value]);

    const updateValue = useCallback(
      (newValue: string) => {
        // No need to validate if the value hasn't changed
        if (prevValue.current === newValue) {
          // Treat this as an option for cancelling out of the input
          if (handleEscape) {
            handleEscape();
          }
        } else {
          // Save changes directly
          handleChange(newValue);
        }
      },
      [handleChange, handleEscape]
    );

    // Helper for detecting use of the ENTER key
    const onKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (handleEscape && (e.code === 'Escape' || e.code === 'Tab')) {
          handleEscape();
        }

        // Update value when the Enter key is pressed
        if (updateOnSubmitOnly && e.code === 'Enter') {
          updateValue(storedValue);
        }
      },
      [handleEscape, storedValue, updateOnSubmitOnly, updateValue]
    );

    const onChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const { value: input } = e.target;
        const formattedValue = formatInput(input);
        setStoredValue(formattedValue);

        // Update value whenever the value changes
        if (!updateOnSubmitOnly) {
          updateValue(formattedValue);
        }
      },
      [formatInput, updateOnSubmitOnly, updateValue]
    );

    return (
      <div className="col text-input">
        <input
          ref={ref}
          type="text"
          value={storedValue}
          name={ariaLabel}
          aria-label={ariaLabel}
          aria-invalid={!!errorMessage}
          aria-errormessage={errorMessage}
          onChange={onChange}
          onKeyDown={onKeyDown}
          tabIndex={isDisabled ? -1 : 0}
          aria-disabled={isDisabled}
        />
        {errorMessage && <div className="errorText">{errorMessage}</div>}
      </div>
    );
  }
);

export default TextInput;
