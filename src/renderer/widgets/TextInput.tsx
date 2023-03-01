/*
<AQUA: System-wide parametric audio equalizer interface>
Copyright (C) <2023>  <AQUA Dev Team>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import {
  ChangeEvent,
  MouseEvent,
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import '../styles/TextInput.scss';

interface ITextInputProps {
  value: string;
  ariaLabel: string;
  isDisabled: boolean;
  errorMessage: string;
  handleChange?: (newValue: string) => void;
  handleSubmit?: (newValue: string) => void;
  handleEscape?: () => void;
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
      handleSubmit,
      handleEscape,
      formatInput = (s) => s,
    }: ITextInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [storedValue, setStoredValue] = useState<string>(value);

    useEffect(() => {
      setStoredValue(value);
    }, [value]);

    const updateValue = useCallback(
      (newValue: string) => {
        if (!handleChange) {
          // Do nothing if handleChange is not defined
          return;
        }

        // No need to update if the value hasn't changed
        if (value === newValue) {
          // Treat this as an option for cancelling out of the input
          if (handleEscape) {
            handleEscape();
          }
        } else {
          // Update with changes
          handleChange(newValue);
        }
      },
      [handleChange, handleEscape, value]
    );

    const submitValue = useCallback(
      (newValue: string) => {
        if (!handleSubmit) {
          // Do nothing if handleSubmit is not defined
          return;
        }

        // If value isn't updated on change, then ignore submits that result in no changes
        if (!handleChange && value === newValue) {
          // Treat this as an option for cancelling out of the input
          if (handleEscape) {
            handleEscape();
          }
        } else if (handleSubmit) {
          // Submit changes
          handleSubmit(newValue);
        }
      },
      [handleChange, handleSubmit, handleEscape, value]
    );

    // Helper for detecting use of the ENTER key
    const onKeyUp = useCallback(
      (e: KeyboardEvent) => {
        if (handleEscape && (e.code === 'Escape' || e.code === 'Tab')) {
          handleEscape();
        }

        // Submit changes when the Enter key is pressed
        if (e.code === 'Enter') {
          submitValue(storedValue);
        }
      },
      [handleEscape, submitValue, storedValue]
    );

    const onChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const { value: input } = e.target;
        const formattedValue = formatInput(input);
        setStoredValue(formattedValue);

        // Update value whenever the input changes
        updateValue(formattedValue);
      },
      [formatInput, updateValue]
    );

    const onClick = useCallback((e: MouseEvent) => {
      // When double clicking, consume the event so that user manipulations
      // on the textbox don't trigger behaviour of parent elements that are
      // technically not in focus
      if (e?.detail === 2) {
        e.stopPropagation();
      }
    }, []);

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
          onKeyUp={onKeyUp}
          tabIndex={isDisabled ? -1 : 0}
          aria-disabled={isDisabled}
          onClick={onClick}
        />
        {errorMessage && <div className="errorText">{errorMessage}</div>}
      </div>
    );
  }
);

export default TextInput;
