import {
  createRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
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
  itemClassName?: string;
  focusOnRender?: boolean;
}

const List = ({
  name,
  options,
  value,
  isDisabled,
  handleChange,
  className,
  itemClassName,
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

  const onChange = useCallback(
    (newValue: string) => {
      handleChange(newValue);
    },
    [handleChange]
  );

  const onMouseEnter = useCallback(
    (index: number) => () => {
      // Give focus on mouseenter if focus wasn't already within the element
      if (!inputRefs[index].current?.contains(document.activeElement)) {
        inputRefs[index].current?.focus();
      }
    },
    [inputRefs]
  );

  const handleItemKeyPress = useCallback(
    (entry: IOptionEntry, index: number) => (e: KeyboardEvent) => {
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
    },
    [inputRefs, isDisabled, onChange, options.length]
  );

  return (
    <ul className={`list ${className || ''}`} aria-label={`${name}-items`}>
      {options.map((entry: IOptionEntry, index: number) => {
        return (
          <li
            role="menuitem"
            ref={inputRefs[index]}
            className={`row ${itemClassName || ''} ${
              entry.value === value ? 'selected' : ''
            }`}
            key={entry.value}
            value={entry.value}
            aria-label={entry.label}
            onClick={() => onChange(entry.value)}
            onKeyDown={handleItemKeyPress(entry, index)}
            onMouseEnter={onMouseEnter(index)}
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
