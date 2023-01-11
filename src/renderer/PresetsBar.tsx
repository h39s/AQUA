import { useMemo, useRef, useState } from 'react';
import './styles/PresetsBar.scss';
import { select } from 'd3';
import { healthCheck, loadPreset, savePreset } from './utils/equalizerApi';
import { useAquaContext } from './utils/AquaContext';
import TextInput from './widgets/TextInput';
import Button from './widgets/Button';
import List, { IOptionEntry } from './widgets/List';
import IconButton, { IconName } from './widgets/IconButton';
import { useClickOutside, useFocusOut } from './utils/utils';

interface IListItemProps {
  value: string;
  handleChange: (newValue: string) => void;
  handleDelete: (value: string) => void;
  isDisabled: boolean;
}

const PresetListItem = ({
  value,
  handleChange,
  handleDelete,
  isDisabled,
}: IListItemProps) => {
  const editModeRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Close edit mode if the user clicks outside of the input
  useClickOutside<HTMLInputElement>(editModeRef, () => {
    setIsEditMode(false);
  });

  // Close edit mode if the user tabs outside of the input
  useFocusOut<HTMLInputElement>(editModeRef, () => {
    setIsEditMode(false);
  });

  const handleEditClicked = () => {
    setIsEditMode(true);
  };

  const handleDeleteClicked = () => {
    handleDelete(value);
  };

  const handleInputChange = (newValue: string) => {
    handleChange(newValue);
    setIsEditMode(false);
  };

  const handleEscape = () => {
    setIsEditMode(false);
  };

  return (
    <>
      {isEditMode ? (
        <TextInput
          ref={editModeRef}
          value={value}
          ariaLabel="Edit Preset Name"
          isDisabled={false}
          handleChange={handleInputChange}
          handleEscape={handleEscape}
          updateOnSubmitOnly
        />
      ) : (
        <>
          {value}
          <div className="row icons">
            <IconButton
              icon={IconName.EDIT}
              handleClick={handleEditClicked}
              isDisabled={isDisabled}
            />
            <IconButton
              icon={IconName.DELETE}
              handleClick={handleDeleteClicked}
              isDisabled={isDisabled}
            />
          </div>
        </>
      )}
    </>
  );
};

const PresetsBar = () => {
  const { globalError, performHealthCheck } = useAquaContext();

  const [presetName, setPresetName] = useState<string>('');
  const [selectedPresetName, setSelectedPresetName] = useState<
    string | undefined
  >(undefined);

  // TODO: Fetch default presets and custom presets from storage
  const [presetNames, setPresetNames] = useState<string[]>([
    'Airpods Pro to IEF Neutral AutoEQ',
    'Airpods to Harman AE OE 2018 AutoEQ',
    '7-1 Surround Sound Speaker Setup',
    'Bass Boost',
    'Bass and Treble Boost',
    'Classic',
    'Dance',
    'Rock',
    'Vocal Boost',
    'Microphone Compensation',
    'MORE BASS',
    'Surround effect',
    'Indie playlist',
    'Pop',
    'Hip-hop',
    'R&B',
    'Equalize for shrill noise',
    'Jazz',
  ]);

  const handleCreatePreset = (prev: string[]) => {
    savePreset(presetName);

    // If we are creating a new preset and not just updating an existing one
    if (prev.indexOf(presetName) === -1) {
      setSelectedPresetName(presetName);
      const newPresets = [...prev, presetName].sort();
      setPresetNames(newPresets);
    }

    console.log('Finished Handling Create Preset!');
  };

  const handleLoadPreset = () => {
    if (selectedPresetName) {
      loadPreset(selectedPresetName)
        .then((json_string) => {
          performHealthCheck();
          const jsonContent = JSON.parse(json_string);
          console.log('result');
          console.log(jsonContent);
          return jsonContent;
        })
        .catch((error) => {
          console.log(`failed to get preset ${selectedPresetName}`);
          console.log(error);
        });
    }
    console.log('done loading preset!');
  };

  const handleChangeNewPresetName = (newValue: string) => {
    setPresetName(newValue);

    // TODO: If the preset name is an existing one, we should set the selected one to be that so we can load it
    setSelectedPresetName(undefined);
  };

  const handleChangeSelectedPreset = (newValue: string) => {
    setPresetName(newValue);
    setSelectedPresetName(newValue);
  };

  const options: IOptionEntry[] = useMemo(() => {
    const handleEditExistingPresetName = (
      oldValue: string,
      newValue: string
    ) => {
      // TODO: improve DS to help check if the newValue is an existing preset or not
      setPresetNames(presetNames.map((n) => (n === oldValue ? newValue : n)));
    };

    const handleDeletePreset = (deletedValue: string) => {
      setPresetNames(presetNames.filter((n) => n !== deletedValue));
    };

    return presetNames.map((n) => {
      return {
        value: n,
        label: n,
        display: (
          <PresetListItem
            value={n}
            handleChange={(newValue: string) =>
              handleEditExistingPresetName(n, newValue)
            }
            handleDelete={handleDeletePreset}
            isDisabled={!!globalError}
          />
        ),
      };
    });
  }, [globalError, presetNames]);

  return (
    <div className="presetsBar">
      <h4>Preset Menu</h4>
      <div className="row center presetName">
        Name:&nbsp;
        <TextInput
          value={presetName}
          ariaLabel="Preset Name"
          isDisabled={!!globalError}
          handleChange={handleChangeNewPresetName}
        />
      </div>
      <Button
        ariaLabel="Save settings to preset"
        className="small full"
        isDisabled={!!globalError}
        handleChange={() => handleCreatePreset(presetNames)}
      >
        Save current settings to preset
      </Button>
      <List
        name="preset"
        options={options}
        className="full"
        itemClassName="presetListItem"
        value={presetName}
        handleChange={handleChangeSelectedPreset}
        isDisabled={!!globalError}
      />
      <Button
        ariaLabel="Load selected preset"
        className="small full"
        isDisabled={!!globalError || !selectedPresetName}
        handleChange={handleLoadPreset}
      >
        Load selected preset
      </Button>
    </div>
  );
};

export default PresetsBar;
