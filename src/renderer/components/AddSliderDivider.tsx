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

import { ErrorDescription } from 'common/errors';
import { KeyboardEvent, useMemo, useRef, useState, CSSProperties } from 'react';
import { addEqualizerSlider } from '../utils/equalizerApi';
import PlusIcon from '../icons/PlusIcon';
import { FilterActionEnum, useAquaContext } from '../utils/AquaContext';
import '../styles/AddSliderDivider.scss';

interface IAddSliderDividerProps {
  newSliderFrequency: number;
  isMaxSliderCount: boolean;
  style?: CSSProperties;
}

const AddSliderDivider = ({
  newSliderFrequency,
  isMaxSliderCount,
  style,
}: IAddSliderDividerProps) => {
  const { dispatchFilter, setGlobalError } = useAquaContext();
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAddDisabled = useMemo(
    () => isLoading || isMaxSliderCount,
    [isLoading, isMaxSliderCount]
  );

  const onAddEqualizerSlider = async (sliderFrequency: number) => {
    if (isAddDisabled) {
      return;
    }

    setIsLoading(true);
    try {
      const filterId = await addEqualizerSlider(sliderFrequency);
      dispatchFilter({
        type: FilterActionEnum.ADD,
        id: filterId,
        frequency: sliderFrequency,
      });
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
    ref.current?.blur();
    setIsLoading(false);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter') {
      onAddEqualizerSlider(newSliderFrequency);
    }
  };

  return (
    <div
      role="button"
      ref={ref}
      className="col center addFilter"
      onClick={() => onAddEqualizerSlider(newSliderFrequency)}
      onKeyUp={(e) => handleKeyUp(e)}
      tabIndex={0}
      aria-disabled={isAddDisabled}
      style={style}
    >
      <div className="divider" />
      <PlusIcon />
      <div className="divider" />
    </div>
  );
};

export default AddSliderDivider;
