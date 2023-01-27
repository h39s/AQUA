import { useMemo, useState } from 'react';
import { useAquaContext } from './utils/AquaContext';
import Button from './widgets/Button';
import Dropdown from './widgets/Dropdown';
import { IOptionEntry } from './widgets/List';
import './styles/AutoEQ.scss';

const AUDIO_DEVICES = ['Apple Airpods', 'Apple Airpods Pro', 'Bose Headphones'];

const TARGET_FREQUENCY_RESPONSE = [
  'IEF Neutral',
  'Diffuse Field',
  'Free Field',
  'Harman AE OE 2018',
  'Harman without Bass Shelf',
];

const AutoEQ = () => {
  const { globalError } = useAquaContext();
  const [device, setDevice] = useState<string>(AUDIO_DEVICES[0]);
  const [response, setResponse] = useState<string>(
    TARGET_FREQUENCY_RESPONSE[0]
  );

  const applyAutoEQ = () => {
    console.log('clicked');
  };

  const deviceOptions: IOptionEntry[] = useMemo(
    () =>
      AUDIO_DEVICES.map((s) => {
        return {
          value: s,
          label: s,
          display: <div>{s}</div>,
        };
      }),
    []
  );
  const responseOptions: IOptionEntry[] = useMemo(
    () =>
      TARGET_FREQUENCY_RESPONSE.map((s) => {
        return {
          value: s,
          label: s,
          display: <div>{s}</div>,
        };
      }),
    []
  );
  return (
    <div className="auto-eq">
      Audio Device:
      <Dropdown
        name="Audio Device"
        options={deviceOptions}
        value={device}
        handleChange={(newValue) => setDevice(newValue)}
        isDisabled={!!globalError}
      />
      Target Frequency Response:
      <Dropdown
        name="Target Frequency Response"
        options={responseOptions}
        value={response}
        handleChange={(newValue) => setResponse(newValue)}
        isDisabled={!!globalError}
      />
      <Button
        className="small"
        ariaLabel="Apply Auto EQ"
        isDisabled={!!globalError}
        handleChange={applyAutoEQ}
      >
        Apply
      </Button>
    </div>
  );
};

export default AutoEQ;
