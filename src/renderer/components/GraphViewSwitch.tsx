import { ErrorDescription } from 'common/errors';
import { useCallback } from 'react';
import {
  decreaseWindowSize,
  disableGraphView,
  enableGraphView,
  increaseWindowSize,
} from '../utils/equalizerApi';
import { useAquaContext } from '../utils/AquaContext';
import Switch from '../widgets/Switch';

interface IGraphViewSwitchProps {
  id: string;
}

export default function GraphViewSwitch({ id }: IGraphViewSwitchProps) {
  const { globalError, isGraphViewOn, setGlobalError, setGraphViewOn } =
    useAquaContext();

  const handleToggle = useCallback(async () => {
    try {
      if (isGraphViewOn) {
        await disableGraphView();
        await decreaseWindowSize();
      } else {
        await enableGraphView();
        await increaseWindowSize();
      }
      setGraphViewOn(!isGraphViewOn);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  }, [isGraphViewOn, setGlobalError, setGraphViewOn]);

  return (
    <Switch
      id={id}
      isOn={isGraphViewOn}
      handleToggle={handleToggle}
      isDisabled={!!globalError}
    />
  );
}
