import { ErrorDescription } from 'common/errors';
import { useCallback } from 'react';
import { disableAutoPreAmp, enableAutoPreAmp } from '../utils/equalizerApi';
import { useAquaContext } from '../utils/AquaContext';
import Switch from '../widgets/Switch';

interface IAutoPreAmpEnablerSwitchProps {
  id: string;
}

export default function AutoPreAmpEnablerSwitch({
  id,
}: IAutoPreAmpEnablerSwitchProps) {
  const { globalError, isAutoPreAmpOn, setGlobalError, setAutoPreAmpOn } =
    useAquaContext();

  const handleToggle = useCallback(async () => {
    try {
      if (isAutoPreAmpOn) {
        await disableAutoPreAmp();
      } else {
        await enableAutoPreAmp();
      }
      setAutoPreAmpOn(!isAutoPreAmpOn);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  }, [isAutoPreAmpOn, setGlobalError, setAutoPreAmpOn]);

  return (
    <Switch
      id={id}
      isOn={isAutoPreAmpOn}
      handleToggle={handleToggle}
      isDisabled={!!globalError}
    />
  );
}
