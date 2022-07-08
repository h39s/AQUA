import {
  createRef,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
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
  handleChange: (newValue: string) => void;
}

const Dropdown = ({ name, options, value, handleChange }: IDropdownProps) => {
  const inputRefs = useMemo(
    () =>
      Array(options.length)
        .fill(0)
        .map(() => createRef<HTMLLIElement>()),
    [options]
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const labelRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (isOpen) {
      const index = options.findIndex((entry) => entry.value === value);
      inputRefs[index].current?.focus();
    }
  }, [inputRefs, isOpen, options, value]);

  useClickOutside<HTMLLabelElement>(labelRef, () => {
    setIsOpen(false);
  });

  useFocusOutside<HTMLLabelElement>(labelRef, () => {
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

  const handleItemKeyPress = (
    e: KeyboardEvent,
    entry: IOptionEntry,
    index: number
  ) => {
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
    <label htmlFor={name} ref={labelRef} className="dropdown">
      <div
        role="menu"
        aria-label={name}
        className="row"
        onClick={toggleIsOpen}
        onKeyDown={listenForEnter}
        tabIndex={0}
      >
        {selectedEntry}
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
    </label>
  );
};

export default Dropdown;
