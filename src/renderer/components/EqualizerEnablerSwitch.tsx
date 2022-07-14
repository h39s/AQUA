import { ErrorDescription } from 'common/errors';
import { useCallback, useState } from 'react';
import {
  disableEqualizer,
  enableEqualizer,
  getEqualizerStatus,
} from '../utils/equalizerApi';
import { useAquaContext } from '../utils/AquaContext';
import Switch from '../widgets/Switch';

interface IEqualizerEnablerSwitchProps {
  id: string;
}

export default function EqualizerEnablerSwitch({
  id,
}: IEqualizerEnablerSwitchProps) {
  const { globalError, setGlobalError } = useAquaContext();
  const [equalizerEnabled, setEqualizerEnabled] = useState<boolean>(false);

  const equalizerEnablerOnLoad = useCallback(async () => {
    try {
      setEqualizerEnabled(await getEqualizerStatus());
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  }, [setGlobalError]);

  const handleToggleEqualizer = useCallback(async () => {
    try {
      if (equalizerEnabled) {
        await disableEqualizer();
      } else {
        await enableEqualizer();
      }
      setEqualizerEnabled(!equalizerEnabled);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  }, [equalizerEnabled, setGlobalError]);

  return (
    <Switch
      id={id}
      isOn={equalizerEnabled}
      handleToggle={handleToggleEqualizer}
      onLoad={equalizerEnablerOnLoad}
      isDisabled={!!globalError}
    />
  );
}
