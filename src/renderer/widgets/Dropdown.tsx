import {
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  createElement,
} from 'react';
import ArrowIcon from '../icons/ArrowIcon';
import '../styles/Dropdown.scss';
import { useClickOutside, useFocusOutside } from '../utils/utils';
import List from './List';

interface IOptionEntry {
  value: string;
  label: string;
  display: JSX.Element | string;
}

interface IDropdownProps {
  name: string;
  options: IOptionEntry[];
  value: string;
  isDisabled: boolean;
  noSelectionValue?: JSX.Element | string;
  noOptionValue?: JSX.Element | string;
  handleChange: (newValue: string) => void;
}

const Dropdown = ({
  name,
  options,
  value,
  isDisabled,
  noSelectionValue,
  noOptionValue,
  handleChange,
}: IDropdownProps) => {
  const nullElement = createElement('div');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDisabled) {
      setIsOpen(false);
    }
  }, [isDisabled]);

  // Close the dropdown if the user clicks outside of the dropdown
  useClickOutside<HTMLDivElement>(dropdownRef, () => {
    setIsOpen(false);
  });

  // Close the dropdown if the user tabs outside of the dropdown
  useFocusOutside<HTMLDivElement>(dropdownRef, () => {
    setIsOpen(false);
  });

  const selectedEntry = useMemo(
    // Default to the first option if the value isn't valid
    () => options.find((e) => e.value === value)?.display,
    [options, value]
  );

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    if (isDisabled) {
      return;
    }
    toggleIsOpen();
  };

  const listenForEnter = (e: KeyboardEvent) => {
    if (isDisabled) {
      return;
    }
    if (e.code === 'Enter') {
      toggleIsOpen();
    }
  };

  const onChange = (newValue: string) => {
    handleChange(newValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="dropdown">
      <div
        role="menu"
        aria-label={name}
        aria-disabled={isDisabled}
        className="row"
        onClick={handleClick}
        onKeyDown={listenForEnter}
        tabIndex={isDisabled ? -1 : 0}
      >
        {options.length !== 0
          ? selectedEntry || noSelectionValue || nullElement
          : noOptionValue || nullElement}
        <ArrowIcon type="down" className="arrow" />
      </div>
      {isOpen && (
        <List
          name={name}
          value={value}
          options={options}
          isDisabled={isDisabled}
          handleChange={onChange}
          focusOnRender
        />
      )}
    </div>
  );
};

export default Dropdown;
