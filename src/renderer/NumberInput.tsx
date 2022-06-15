import { ChangeEvent, KeyboardEvent } from 'react';
import './styles/NumberInput.scss';
import { clamp } from './utils';

interface INumberInputProps {
  name: string;
  value: number | '' | '-';
  min: number;
  max: number;
  isDisabled: boolean;
  showLabel: boolean;
  handleChange: (newValue: number | '' | '-') => void;
  handleSubmit: (newValue: number) => void;
}

const NumberInput = ({
  name,
  value,
  min,
  max,
  isDisabled,
  showLabel,
  handleChange,
  handleSubmit,
}: INumberInputProps) => {
  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: input } = e.target;
    const lastChar = input[input.length - 1];

    // Allow user to clear input and type an initial negative sign
    if (input === '' || input === '-') {
      handleChange(input);
      return;
    }

    // Prevent user from typing non-numerical values
    if (Number.isNaN(parseInt(lastChar, 10))) {
      return;
    }

    const newValue: number = parseInt(input, 10);
    handleChange(newValue);
  };

  // Helper for detecting use of the ENTER key
  const listenForEnter = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      if (value === '' || value === '-') {
        return;
      }
      const newValue: number = clamp(value, min, max);
      handleSubmit(newValue);
    }
  };

  return (
    <label htmlFor={name} className="col center numberInput">
      <input
        type="text"
        name={name}
        aria-label={name}
        value={value}
        onInput={onInput}
        onKeyDown={listenForEnter}
        disabled={isDisabled}
      />
      {showLabel && name}
    </label>
  );
};

export default NumberInput;
