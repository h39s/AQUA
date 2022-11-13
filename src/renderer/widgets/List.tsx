import { createRef, KeyboardEvent, useEffect, useMemo } from 'react';
import '../styles/List.scss';

export interface IOptionEntry {
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
  focusOnRender?: boolean;
}

const List = ({
  name,
  options,
  value,
  isDisabled,
  handleChange,
  className,
  focusOnRender = false,
}: IListProps) => {
  const inputRefs = useMemo(
    () =>
      Array(options.length)
        .fill(0)
        .map(() => createRef<HTMLLIElement>()),
    [options]
  );

  useEffect(() => {
    if (!focusOnRender) {
      return;
    }

    // Focus on the selected item when initially rendered
    const index = options.findIndex((entry) => entry.value === value);
    if (index >= 0) {
      inputRefs[index].current?.focus();
    }
  }, [focusOnRender, inputRefs, options, value]);

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
            className={`row ${entry.value === value ? 'selected' : ''}`}
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
