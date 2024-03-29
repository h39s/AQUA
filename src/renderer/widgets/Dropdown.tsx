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
import TextInput from './TextInput';

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
  noSelectionPlaceholder?: JSX.Element | string;
  emptyOptionsPlaceholder?: JSX.Element | string;
  isFilterable?: boolean;
  handleChange: (newValue: string) => void;
}

const Dropdown = ({
  name,
  options,
  value,
  isDisabled,
  noSelectionPlaceholder,
  emptyOptionsPlaceholder,
  handleChange,
  isFilterable = false,
}: IDropdownProps) => {
  const nullElement = createElement('div');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchString, setSearchString] = useState<string>('');

  const filteredOptions = useMemo(
    () =>
      options.filter((o) =>
        o.value.toLowerCase().startsWith(searchString.toLowerCase())
      ),
    [options, searchString]
  );

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
          ? selectedEntry || noSelectionPlaceholder || nullElement
          : emptyOptionsPlaceholder || nullElement}
        <ArrowIcon type="down" className="arrow" />
      </div>
      {isOpen && (
        <List
          name={name}
          value={value}
          options={filteredOptions}
          isDisabled={isDisabled}
          handleChange={onChange}
          focusOnRender={!isFilterable}
          startingItem={
            isFilterable ? (
              <TextInput
                value={searchString}
                ariaLabel="Filter audio devices"
                isDisabled={isDisabled}
                errorMessage=""
                handleChange={(newValue) => setSearchString(newValue)}
              />
            ) : undefined
          }
        />
      )}
    </div>
  );
};

export default Dropdown;
