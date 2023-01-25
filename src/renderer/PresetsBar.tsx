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
import PresetListItem, { formatPresetName } from './components/PresetListItem';

const RESERVED_FILE_NAMES_SET = new Set([
  'CON',
  'PRN',
  'AUX',
  'NUL',
  'COM1',
  'COM2',
  'COM3',
  'COM4',
  'COM5',
  'COM6',
  'COM7',
  'COM8',
  'COM9',
  'COM0',
  'LPT1',
  'LPT2',
  'LPT3',
  'LPT4',
  'LPT5',
  'LPT6',
  'LPT7',
  'LPT8',
  'LPT9',
  'LPT0',
]);

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
  const validatePresetName = useCallback((newValue: string) => {
    if (RESERVED_FILE_NAMES_SET.has(newValue.toUpperCase())) {
      return 'Invalid preset name, please use another.';
    }

    return undefined;
  }, []);

  // Validating a preset rename
  const validatePresetRename = useCallback(
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

      return validatePresetName(newValue);
    },
    [validatePresetName, presetNames]
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
            validate={validatePresetRename}
          />
        ),
      };
    });
  }, [
    validatePresetRename,
    globalError,
    handleDeletePreset,
    handleRenameExistingPresetName,
    presetNames,
  ]);

  return (
    <div className="presets-bar">
      <h4>Preset Menu</h4>
      <div className="row">
        <div className="preset-name">Name:&nbsp;</div>
        <TextInput
          value={presetName}
          ariaLabel="Preset Name"
          isDisabled={!!globalError}
          handleChange={handleChangeNewPresetName}
          formatInput={formatPresetName}
          validate={validatePresetName}
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
