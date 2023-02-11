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

        // Reduce window size before allowing parametric components to fill space
        await decreaseWindowSize();
        setGraphViewOn(!isGraphViewOn);
      } else {
        await enableGraphView();

        // Set parametric components to a fixed height before increasing window size
        setGraphViewOn(!isGraphViewOn);
        await increaseWindowSize();
      }
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
