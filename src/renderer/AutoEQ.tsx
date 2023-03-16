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

import { useEffect, useMemo, useState } from 'react';
import { ErrorDescription } from 'common/errors';
import { useAquaContext } from './utils/AquaContext';
import Button from './widgets/Button';
import Dropdown from './widgets/Dropdown';
import { IOptionEntry } from './widgets/List';
import './styles/AutoEQ.scss';
import {
  getAutoEqDeviceList,
  getAutoEqResponseList,
  loadAutoEqPreset,
} from './utils/equalizerApi';

const AutoEQ = () => {
  const NO_DEVICE_SELECTION = 'Pick a device first! 🎧';
  const NO_RESPONSES = 'No supported responses 😞';
  const NO_RESPONSE_SELECTION = 'Pick a response! 🔊';

  const { globalError, setGlobalError, performHealthCheck } = useAquaContext();
  const [devices, setDevices] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentDevice, setCurrentDevice] = useState<string>('');
  const [currentResponse, setCurrentResponse] = useState<string>('');

  // Fetch supported devices from storage
  useEffect(() => {
    const fetchDeviceNames = async () => {
      try {
        setDevices(await getAutoEqDeviceList());
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    };

    fetchDeviceNames();
  }, [setGlobalError]);

  // When user changes the current selected device, fetch the supported responses
  const handleDeviceChange = async (newValue: string) => {
    try {
      setResponses(await getAutoEqResponseList(newValue));
      setCurrentDevice(newValue);
      // Reset currentResponse to blank whenever it changes.
      setCurrentResponse('');
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  const applyAutoEQ = async () => {
    try {
      await loadAutoEqPreset(currentDevice, currentResponse);
      performHealthCheck();
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  const deviceOptions: IOptionEntry[] = useMemo(
    () =>
      devices.map((s) => {
        return {
          value: s,
          label: s,
          display: <div>{s}</div>,
        };
      }),
    [devices]
  );

  const responseOptions: IOptionEntry[] = useMemo(
    () =>
      responses.map((s) => {
        return {
          value: s,
          label: s,
          display: <div>{s}</div>,
        };
      }),
    [responses]
  );

  return (
    <>
      <h4 className="auto-eq-title">Auto EQ</h4>
      <div className="auto-eq">
        Audio Device:
        <Dropdown
          name="Audio Device"
          options={deviceOptions}
          value={currentDevice}
          handleChange={handleDeviceChange}
          isDisabled={!!globalError}
          noSelectionPlaceholder={NO_DEVICE_SELECTION}
          isFilterable
        />
        Target Frequency Response:
        <Dropdown
          name="Target Frequency Response"
          options={responseOptions}
          value={currentResponse}
          handleChange={(newValue) => setCurrentResponse(newValue)}
          isDisabled={!!globalError || responses.length === 0}
          emptyOptionsPlaceholder={NO_RESPONSES}
          noSelectionPlaceholder={NO_RESPONSE_SELECTION}
        />
        <Button
          className="small"
          ariaLabel="Apply Auto EQ"
          isDisabled={
            !!globalError || currentDevice === '' || currentResponse === ''
          }
          handleChange={applyAutoEQ}
        >
          Apply
        </Button>
      </div>
    </>
  );
};

export default AutoEQ;
