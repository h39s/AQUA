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
  createRef,
  KeyboardEvent,
  MouseEvent,
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
  handleChange: (newValue: string, e?: MouseEvent) => void;
  className?: string;
  itemClassName?: string;
  focusOnRender?: boolean;
  startingItem?: JSX.Element;
  emptyOptionsPlaceholder?: JSX.Element | string;
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
  startingItem,
  emptyOptionsPlaceholder = 'No options found.',
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

  const onClick = useCallback(
    (newValue: string) => (e: MouseEvent) => {
      handleChange(newValue, e);
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
        handleChange(entry.value);
      } else if (e.code === 'ArrowDown') {
        const next = Math.min(index + 1, options.length - 1);
        inputRefs[next].current?.focus();
      } else if (e.code === 'ArrowUp') {
        const prev = Math.max(index - 1, 0);
        inputRefs[prev].current?.focus();
      }
    },
    [inputRefs, isDisabled, handleChange, options.length]
  );

  return (
    <div className={`list-wrapper ${className || ''}`}>
      {startingItem && (
        <div role="menuitem" className="row starting-item">
          {startingItem}
        </div>
      )}
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
              onClick={onClick(entry.value)}
              onKeyDown={handleItemKeyPress(entry, index)}
              onMouseEnter={onMouseEnter(index)}
              tabIndex={0}
            >
              {entry.display}
            </li>
          );
        })}
        {options.length === 0 && (
          <li
            role="menuitem"
            className={`row ${itemClassName || ''} `}
            tabIndex={0}
          >
            {emptyOptionsPlaceholder}
          </li>
        )}
      </ul>
    </div>
  );
};

export default List;
