import { ErrorDescription } from 'common/errors';
import { useCallback } from 'react';
import { disableAutoPreamp, enableAutoPreamp } from '../utils/equalizerApi';
import { useAquaContext } from '../utils/AquaContext';
import Switch from '../widgets/Switch';

interface IAutoPreampEnablerSwitchProps {
  id: string;
}

export default function AutoPreampEnablerSwitch({
  id,
}: IAutoPreampEnablerSwitchProps) {
  const { globalError, isAutoPreampOn, setGlobalError, setAutoPreampOn } =
    useAquaContext();

  const handleToggle = useCallback(async () => {
    try {
      if (isAutoPreampOn) {
        await disableAutoPreamp();
      } else {
        await enableAutoPreamp();
      }
      setAutoPreampOn(!isAutoPreampOn);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  }, [isAutoPreampOn, setGlobalError, setAutoPreampOn]);

  return (
    <Switch
      id={id}
      isOn={isAutoPreampOn}
      handleToggle={handleToggle}
      isDisabled={!!globalError}
    />
  );
}
