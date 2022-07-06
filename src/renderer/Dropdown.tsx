import { ChangeEvent, KeyboardEvent, useMemo, useRef, useState } from 'react';
import ArrowIcon from './icons/ArrowIcon';
import './styles/Dropdown.scss';
import { useClickOutside } from './utils';

interface IOptionEntry {
  value: string;
  display: JSX.Element | string;
}

interface IDropdownProps {
  name: string;
  options: IOptionEntry[];
  value: string;
  handleChange: (newValue: string) => void;
}

export const SimpleDropdown = ({
  name,
  options,
  value,
  handleChange,
}: IDropdownProps) => {
  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: newValue } = e.target;
    handleChange(newValue);
  };

  return (
    <label htmlFor={name} className="dropdown">
      <select name={name} aria-label={name} value={value} onChange={onChange}>
        {options.map((entry: IOptionEntry) => {
          return <option value={entry.value}>{entry.display}</option>;
        })}
      </select>
    </label>
  );
};

const Dropdown = ({ name, options, value, handleChange }: IDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const labelRef = useRef<HTMLLabelElement>(null);

  useClickOutside<HTMLLabelElement>(labelRef, () => {
    setIsOpen(false);
  });

  const selectedEntry = useMemo(
    () => options.find((e) => e.value === value)?.display,
    [options, value]
  );

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const listenForEnter = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      toggleIsOpen();
    }
  };

  const onChange = (newValue: string) => {
    handleChange(newValue);
    setIsOpen(false);
  };

  const handleItemKeyPress = (e: KeyboardEvent, entry: IOptionEntry) => {
    if (e.code === 'Enter') {
      onChange(entry.value);
    } else if (e.code === 'Down') {
      // TODO: Allow users to use up and down arrows to change between options
    }
  };

  return (
    <label htmlFor={name} ref={labelRef} className="dropdown">
      <div
        role="menu"
        className="row"
        onClick={toggleIsOpen}
        onKeyDown={listenForEnter}
        tabIndex={0}
      >
        {selectedEntry}
        <ArrowIcon type="down" className="arrow" />
      </div>
      {isOpen && (
        <ul aria-label={name}>
          {options.map((entry: IOptionEntry) => {
            return (
              <li
                role="menuitem"
                className="row"
                key={entry.value}
                value={entry.value}
                onClick={() => onChange(entry.value)}
                onKeyDown={(e) => handleItemKeyPress(e, entry)}
                tabIndex={0}
              >
                {entry.display}
              </li>
            );
          })}
        </ul>
      )}
    </label>
  );
};

export default Dropdown;
