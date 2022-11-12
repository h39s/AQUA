import { createRef, KeyboardEvent, useEffect, useMemo } from 'react';
import '../styles/List.scss';

interface IOptionEntry {
  value: string;
  label: string;
  display: JSX.Element | string;
}

interface IListProps {
  name: string;
  options: IOptionEntry[];
  value: string;
  isDisabled: boolean;
  handleChange: (newValue: string) => void;
  className?: string;
}

const List = ({
  name,
  options,
  value,
  isDisabled,
  handleChange,
  className,
}: IListProps) => {
  const inputRefs = useMemo(
    () =>
      Array(options.length)
        .fill(0)
        .map(() => createRef<HTMLLIElement>()),
    [options]
  );

  useEffect(() => {
    // Focus on the selected dropdown item when opened
    const index = Math.max(
      options.findIndex((entry) => entry.value === value),
      // Default to the first option if the value isn't valid
      0
    );
    inputRefs[index].current?.focus();
  }, [inputRefs, options, value]);

  const onChange = (newValue: string) => {
    handleChange(newValue);
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
    <ul className={`list ${className}`} aria-label={`${name}-items`}>
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
  );
};

export default List;
