import { ChangeEvent } from 'react';
import '../styles/TextInput.scss';

interface ITextInputProps {
  value: string;
  ariaLabel: string;
  isDisabled: boolean;
  handleChange: (newValue: string) => void;
}

const TextInput = ({
  value,
  ariaLabel,
  isDisabled,
  handleChange,
}: ITextInputProps) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: input } = e.target;
    handleChange(input);
  };

  return (
    <input
      className="textInput"
      type="text"
      value={value}
      aria-label={ariaLabel}
      onChange={onChange}
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
    />
  );
};

export default TextInput;
