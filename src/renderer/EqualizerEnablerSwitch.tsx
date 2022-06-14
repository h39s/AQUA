import { ErrorDescription } from 'common/errors';
import { useCallback, useContext, useState } from 'react';
import {
  disableEqualizer,
  enableEqualizer,
  getEqualizerStatus,
} from './equalizerApi';
import { PeaceFoundContext } from './PeaceFoundContext';
import Switch from './Switch';

interface IEqualizerEnablerSwitchProps {
  id: string;
}

export default function EqualizerEnablerSwitch({
  id,
}: IEqualizerEnablerSwitchProps) {
  const { setPeaceError } = useContext(PeaceFoundContext);
  const [equalizerEnabled, setEqualizerEnabled] = useState<boolean>(false);

  const equalizerEnablerOnLoad = useCallback(async () => {
    try {
      setEqualizerEnabled(await getEqualizerStatus());
    } catch (e) {
      setPeaceError(e as ErrorDescription);
    }
  }, [setPeaceError]);

  const handleToggleEqualizer = useCallback(async () => {
    try {
      if (equalizerEnabled) {
        await disableEqualizer();
      } else {
        await enableEqualizer();
      }
      setEqualizerEnabled(!equalizerEnabled);
    } catch (e) {
      setPeaceError(e as ErrorDescription);
    }
  }, [equalizerEnabled, setPeaceError]);

  return (
    <Switch
      id={id}
      isOn={equalizerEnabled}
      handleToggle={handleToggleEqualizer}
      onLoad={equalizerEnablerOnLoad}
    />
  );
}
