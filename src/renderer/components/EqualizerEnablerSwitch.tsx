import { ErrorDescription } from 'common/errors';
import { useCallback } from 'react';
import { disableEqualizer, enableEqualizer } from '../utils/equalizerApi';
import { useAquaContext } from '../utils/AquaContext';
import Switch from '../widgets/Switch';

interface IEqualizerEnablerSwitchProps {
  id: string;
}

export default function EqualizerEnablerSwitch({
  id,
}: IEqualizerEnablerSwitchProps) {
  const { globalError, isEnabled, setGlobalError, setIsEnabled } =
    useAquaContext();

  const handleToggleEqualizer = useCallback(async () => {
    try {
      if (isEnabled) {
        await disableEqualizer();
      } else {
        await enableEqualizer();
      }
      setIsEnabled(!isEnabled);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  }, [isEnabled, setGlobalError, setIsEnabled]);

  return (
    <Switch
      id={id}
      isOn={isEnabled}
      handleToggle={handleToggleEqualizer}
      onLoad={() => {}}
      isDisabled={!!globalError}
    />
  );
}
