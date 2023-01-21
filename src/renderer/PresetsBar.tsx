import { useEffect, useMemo, useRef, useState } from 'react';
import './styles/PresetsBar.scss';
import { ErrorDescription } from 'common/errors';
import {
  getPresetListFromFiles,
  loadPreset,
  savePreset,
  deletePreset,
} from './utils/equalizerApi';
import { useAquaContext } from './utils/AquaContext';
import TextInput from './widgets/TextInput';
import Button from './widgets/Button';
import List, { IOptionEntry } from './widgets/List';
import IconButton, { IconName } from './widgets/IconButton';
import { useMouseDownOutside } from './utils/utils';

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
  const editValueRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Close edit mode if the user clicks outside of the input
  useMouseDownOutside<HTMLInputElement>(editValueRef, () => {
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
          ref={editValueRef}
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
  const { globalError, performHealthCheck, setGlobalError } = useAquaContext();

  const [presetName, setPresetName] = useState<string>('');
  const [selectedPresetName, setSelectedPresetName] = useState<
    string | undefined
  >(undefined);

  const [presetNames, setPresetNames] = useState<string[]>([]);

  // Fetch default presets and custom presets from storage
  useEffect(() => {
    const fetchPresetNames = async () => {
      try {
        const result = await getPresetListFromFiles();
        // Sort preset names before updating state just in case
        setPresetNames(result.sort());
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    };

    fetchPresetNames();
  }, [setGlobalError]);

  const handleCreatePreset = async (prev: string[]) => {
    try {
      await savePreset(presetName);

      // If we are creating a new preset and not just updating an existing one
      if (prev.indexOf(presetName) === -1) {
        setSelectedPresetName(presetName);
        // Keep presets sorted
        const newPresets = [...prev, presetName].sort();
        setPresetNames(newPresets);
      }
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  const handleLoadPreset = async () => {
    if (selectedPresetName) {
      try {
        await loadPreset(selectedPresetName);
        performHealthCheck();
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    }
  };

  const handleChangeNewPresetName = (newValue: string) => {
    setPresetName(newValue);

    // Update selectedPresetName if the input value matches an existing preset name
    const newSelectedName = presetNames.some((n) => n === newValue)
      ? newValue
      : undefined;
    setSelectedPresetName(newSelectedName);
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
      setPresetNames(
        // Keep presets sorted
        presetNames.map((n) => (n === oldValue ? newValue : n)).sort()
      );
    };

    const handleDeletePreset = async (deletedValue: string) => {
      setPresetNames(presetNames.filter((n) => n !== deletedValue));
      try {
        await deletePreset(deletedValue);
      } catch (e) {
        // continue to run, the worst case is that the file still exists and that's all.
      }
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
    <div className="presets-bar">
      <h4>Preset Menu</h4>
      <div className="row center preset-name">
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
        className="small"
        isDisabled={!!globalError || !presetName}
        handleChange={() => handleCreatePreset(presetNames)}
      >
        Save current settings to preset
      </Button>
      <List
        name="preset"
        options={options}
        itemClassName="preset-list-item"
        value={presetName}
        handleChange={handleChangeSelectedPreset}
        isDisabled={!!globalError}
      />
      <Button
        ariaLabel="Load selected preset"
        className="small"
        isDisabled={!!globalError || !selectedPresetName}
        handleChange={handleLoadPreset}
      >
        Load selected preset
      </Button>
    </div>
  );
};

export default PresetsBar;
