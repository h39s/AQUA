import { useCallback, useEffect, useMemo, useState } from 'react';
import './styles/PresetsBar.scss';
import { ErrorDescription } from 'common/errors';
import {
  deletePreset,
  getPresetListFromFiles,
  loadPreset,
  renamePreset,
  savePreset,
} from './utils/equalizerApi';
import { useAquaContext } from './utils/AquaContext';
import TextInput from './widgets/TextInput';
import Button from './widgets/Button';
import List, { IOptionEntry } from './widgets/List';
import PresetListItem from './components/PresetListItem';

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

  // Creating a new preset
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

  // Loading audio settings from an existing preset
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

  // Changing the selected preset in the UI
  const handleChangeSelectedPreset = (newValue: string) => {
    setPresetName(newValue);
    setSelectedPresetName(newValue);
  };

  // Deleting a preset
  const handleDeletePreset = useCallback(
    (deletedValue: string) => async () => {
      try {
        await deletePreset(deletedValue);
        setPresetNames(presetNames.filter((n) => n !== deletedValue));
      } catch (e) {
        // continue to run, the worst case is that the file still exists and that's all.
      }
    },
    [presetNames]
  );

  // Renaming an existing preset
  const handleRenameExistingPresetName = useCallback(
    (oldValue: string) => async (newValue: string) => {
      try {
        await renamePreset(oldValue, newValue);
        setPresetNames(
          // Keep presets sorted
          presetNames.map((n) => (n === oldValue ? newValue : n)).sort()
        );
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    },
    [presetNames, setGlobalError]
  );

  // Validating a new preset name
  const validatePresetName = useCallback(
    (newValue: string) => {
      if (!newValue) {
        return 'Preset name cannot be empty.';
      }
      if (
        presetNames.some(
          (oldValue) => newValue.toLowerCase() === oldValue.toLowerCase()
        )
      ) {
        return 'Duplicate name found.';
      }

      return undefined;
    },
    [presetNames]
  );

  const options: IOptionEntry[] = useMemo(() => {
    return presetNames.map((n) => {
      return {
        value: n,
        label: n,
        display: (
          <PresetListItem
            value={n}
            handleChange={handleRenameExistingPresetName(n)}
            handleDelete={handleDeletePreset(n)}
            isDisabled={!!globalError}
            validate={validatePresetName}
          />
        ),
      };
    });
  }, [
    validatePresetName,
    globalError,
    handleDeletePreset,
    handleRenameExistingPresetName,
    presetNames,
  ]);

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
