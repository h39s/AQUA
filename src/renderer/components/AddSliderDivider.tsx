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
