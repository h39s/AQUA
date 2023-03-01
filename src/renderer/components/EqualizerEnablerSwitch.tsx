/*
<AQUA: System-wide parametric audio equalizer interface>
Copyright (C) <2023>  <AQUA Dev Team>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
      isDisabled={!!globalError}
    />
  );
}
