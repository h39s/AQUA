import { useState } from 'react';
import './styles/PresetsBar.scss';
import { useAquaContext } from './utils/AquaContext';
import TextInput from './widgets/TextInput';
import Button from './widgets/Button';
import List from './widgets/List';

export const OPTIONS = [
  {
    value: 'Bass Boost',
    label: 'Bass Boost',
    display: 'Bass Boost',
  },
  {
    value: 'Classic',
    label: 'Classic',
    display: 'Classic',
  },
  {
    value: 'Dance',
    label: 'Dance',
    display: 'Dance',
  },
];

const PresetsBar = () => {
  const { globalError } = useAquaContext();

  const [presetName, setPresetName] = useState<string>('');
  const [selectedPresetName, setSelectedPresetName] = useState<
    string | undefined
  >(undefined);

  const handleChangeSelectedPreset = (newValue: string) => {
    setPresetName(newValue);
    setSelectedPresetName(newValue);
  };

  return (
    <div className="col presetsBar center">
      <h4>Preset Menu</h4>
      <div className="row center">
        Name:&nbsp;
        <TextInput
          value={presetName}
          ariaLabel="Preset Name"
          isDisabled={!!globalError}
          handleChange={setPresetName}
        />
      </div>
      <Button
        ariaLabel="Save settings to preset"
        className="small"
        isDisabled={!!globalError}
        handleChange={() => console.log('save')}
      >
        Save current settings to preset
      </Button>
      <List
        name="preset"
        options={OPTIONS}
        className="full"
        value={selectedPresetName || ''}
        handleChange={handleChangeSelectedPreset}
        isDisabled={!!globalError}
      />
      <Button
        ariaLabel="Load selected preset"
        className="small"
        isDisabled={!!globalError || !selectedPresetName}
        handleChange={() => console.log('save')}
      >
        Load selected preset
      </Button>
    </div>
  );
};

export default PresetsBar;
