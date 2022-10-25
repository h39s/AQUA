import { ErrorDescription } from 'common/errors';
import { KeyboardEvent, useMemo, useRef, useState } from 'react';
import { addEqualizerSlider } from '../utils/equalizerApi';
import PlusIcon from '../icons/PlusIcon';
import { FilterActionEnum, useAquaContext } from '../utils/AquaContext';
import '../styles/AddSliderDivider.scss';

interface IAddSliderDividerProps {
  sliderIndex: number;
  isMaxSliderCount: boolean;
}

const AddSliderDivider = ({
  sliderIndex,
  isMaxSliderCount,
}: IAddSliderDividerProps) => {
  const { dispatchFilter, setGlobalError } = useAquaContext();
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAddDisabled = useMemo(
    () => isLoading || isMaxSliderCount,
    [isLoading, isMaxSliderCount]
  );

  const onAddEqualizerSlider = async (insertIndex: number) => {
    if (isAddDisabled) {
      return;
    }

    setIsLoading(true);
    try {
      const filterId = await addEqualizerSlider(insertIndex);
      dispatchFilter({
        type: FilterActionEnum.ADD,
        id: filterId,
        index: insertIndex,
      });
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }

    ref.current?.blur();
    setIsLoading(false);
  };

  const handleKeyUp = (
    e: KeyboardEvent<HTMLDivElement>,
    insertIndex: number
  ) => {
    if (e.code === 'Enter') {
      onAddEqualizerSlider(insertIndex);
    }
  };

  return (
    <div
      role="button"
      ref={ref}
      className="col center addFilter"
      onClick={() => onAddEqualizerSlider(sliderIndex + 1)}
      onKeyUp={(e) => handleKeyUp(e, sliderIndex + 1)}
      tabIndex={0}
      aria-disabled={isAddDisabled}
    >
      <div className="divider" />
      <PlusIcon />
      <div className="divider" />
    </div>
  );
};

export default AddSliderDivider;
