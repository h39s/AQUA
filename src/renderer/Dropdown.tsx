import {
  createRef,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  createElement,
} from 'react';
import ArrowIcon from './icons/ArrowIcon';
import './styles/Dropdown.scss';
import { useClickOutside, useFocusOutside } from './utils';

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
  handleChange: (newValue: string) => void;
}

const Dropdown = ({
  name,
  options,
  value,
  isDisabled,
  handleChange,
}: IDropdownProps) => {
  const nullElement = createElement('div');
  const inputRefs = useMemo(
    () =>
      Array(options.length)
        .fill(0)
        .map(() => createRef<HTMLLIElement>()),
    [options]
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDisabled) {
      setIsOpen(false);
    }
  }, [isDisabled]);

  useEffect(() => {
    if (isOpen) {
      // Focus on the selected dropdown item when opened
      const index = Math.max(
        options.findIndex((entry) => entry.value === value),
        // Default to the first option if the value isn't valid
        0
      );
      inputRefs[index].current?.focus();
    }
  }, [inputRefs, isOpen, options, value]);

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

  const handleItemKeyPress = (
    e: KeyboardEvent,
    entry: IOptionEntry,
    index: number
  ) => {
    if (isDisabled) {
      return;
    }
    if (e.code === 'Enter') {
      onChange(entry.value);
    } else if (e.code === 'ArrowDown') {
      const next = Math.min(index + 1, options.length - 1);
      inputRefs[next].current?.focus();
    } else if (e.code === 'ArrowUp') {
      const prev = Math.max(index - 1, 0);
      inputRefs[prev].current?.focus();
    }
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
        {selectedEntry || nullElement}
        <ArrowIcon type="down" className="arrow" />
      </div>
      {isOpen && (
        <ul aria-label={`${name}-items`}>
          {options.map((entry: IOptionEntry, index: number) => {
            return (
              <li
                role="menuitem"
                ref={inputRefs[index]}
                className="row"
                key={entry.value}
                value={entry.value}
                aria-label={entry.label}
                onClick={() => onChange(entry.value)}
                onKeyDown={(e) => handleItemKeyPress(e, entry, index)}
                onMouseEnter={() => inputRefs[index].current?.focus()}
                tabIndex={0}
              >
                {entry.display}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
