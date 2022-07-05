import { ErrorDescription } from 'common/errors';
import { useCallback, useContext, useState } from 'react';
import {
  disableEqualizer,
  enableEqualizer,
  getEqualizerStatus,
} from './equalizerApi';
import { AquaContext } from './AquaContext';
import Switch from './Switch';

interface IEqualizerEnablerSwitchProps {
  id: string;
}

export default function EqualizerEnablerSwitch({
  id,
}: IEqualizerEnablerSwitchProps) {
  const { setGlobalError } = useContext(AquaContext);
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
    />
  );
}
