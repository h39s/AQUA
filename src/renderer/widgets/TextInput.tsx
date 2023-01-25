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
  handleChange: (newValue: string) => void;
  handleEscape?: () => void;
  updateOnSubmitOnly?: boolean;
  formatInput?: (value: string) => string;
  validate?: (newValue: string) => string | undefined;
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
      validate,
      formatInput = (s) => s,
    }: ITextInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [storedValue, setStoredValue] = useState<string>(value);
    const prevValue = useRef<string>(value);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
      undefined
    );

    useEffect(() => {
      setStoredValue(value);
      setErrorMessage(undefined);
    }, [value]);

    const validateAndSave = useCallback(
      (newValue: string) => {
        // No need to validate if the value hasn't changed
        if (prevValue.current === newValue) {
          handleChange(newValue);
          setErrorMessage(undefined);
          return;
        }

        if (validate) {
          // Perform validation
          const msg = validate(newValue);
          setErrorMessage(msg);

          // Save changes if validation has no errors
          if (!msg) {
            handleChange(newValue);
            prevValue.current = newValue;
          }
        } else {
          // Save changes directly
          handleChange(newValue);
          prevValue.current = newValue;
        }
      },
      [handleChange, validate]
    );

    // Helper for detecting use of the ENTER key
    const onKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (handleEscape && (e.code === 'Escape' || e.code === 'Tab')) {
          handleEscape();
        }
        if (updateOnSubmitOnly && e.code === 'Enter') {
          validateAndSave(storedValue);
        }
      },
      [handleEscape, storedValue, updateOnSubmitOnly, validateAndSave]
    );

    const onChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const { value: input } = e.target;
        const formattedValue = formatInput(input);
        setStoredValue(formattedValue);
        if (!updateOnSubmitOnly) {
          validateAndSave(formattedValue);
        }
      },
      [formatInput, updateOnSubmitOnly, validateAndSave]
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
