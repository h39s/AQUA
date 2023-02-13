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
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setResponses(await getAutoEqResponseList(currentDevice));
        // Reset currentReponse to blank whenever it changes.
        setCurrentResponse('');
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    };
    // Skip checking for responses when we don't have a selected current device
    if (currentDevice !== '') {
      fetchResponses();
    }
  }, [currentDevice, setGlobalError]);

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
    <div className="auto-eq">
      Audio Device:
      <Dropdown
        name="Audio Device"
        options={deviceOptions}
        value={currentDevice}
        handleChange={(newValue) => setCurrentDevice(newValue)}
        isDisabled={!!globalError}
        noSelectionPlaceholder={NO_DEVICE_SELECTION}
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
  );
};

export default AutoEQ;
