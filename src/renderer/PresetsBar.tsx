import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import './styles/PresetsBar.scss';
import { ErrorDescription } from 'common/errors';
import { isRestrictedPresetName } from 'common/utils';
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
import { formatPresetName } from './utils/utils';

enum PresetErrorEnum {
  EMPTY = 'Preset name cannot be empty.',
  RESTRICTED = 'Invalid preset name, please use another.',
  DUPLICATE = 'Duplicate name found, please use another.',
}

export enum PresetActionEnum {
  INIT,
  CREATE,
  DELETE,
  RENAME,
}

export type PresetAction =
  | { type: PresetActionEnum.INIT; presetNames: string[] }
  | { type: PresetActionEnum.CREATE; presetName: string }
  | { type: PresetActionEnum.DELETE; presetName: string }
  | { type: PresetActionEnum.RENAME; oldName: string; newName: string };

type IPresetReducer = (presetNames: string[], action: PresetAction) => string[];

const presetReducer: IPresetReducer = (
  presetNames: string[],
  action: PresetAction
) => {
  switch (action.type) {
    case PresetActionEnum.INIT:
      return action.presetNames.sort();
    case PresetActionEnum.CREATE:
      return [...presetNames, action.presetName].sort();
    case PresetActionEnum.DELETE:
      return presetNames.filter((name) => name !== action.presetName);
    case PresetActionEnum.RENAME:
      return presetNames.map((name) =>
        name === action.oldName ? action.newName : name
      );
    default:
      // This throw does not actually do anything because
      // we are in a reducer
      throw new Error('Unhandled action type should not occur');
  }
};

const PresetsBar = () => {
  const { globalError, performHealthCheck, setGlobalError } = useAquaContext();

  const [presetName, setPresetName] = useState<string>('');
  const [selectedPresetName, setSelectedPresetName] = useState<
    string | undefined
  >(undefined);
  const [newPresetNameError, setNewPresetNameError] = useState<string>('');
  const [presetNames, dispatchPresetNames] = useReducer<IPresetReducer>(
    presetReducer,
    []
  );

  // Fetch default presets and custom presets from storage
  useEffect(() => {
    const fetchPresetNames = async () => {
      try {
        const result = await getPresetListFromFiles();
        dispatchPresetNames({
          type: PresetActionEnum.INIT,
          presetNames: result,
        });
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
        dispatchPresetNames({
          type: PresetActionEnum.CREATE,
          presetName,
        });
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

  // Validating a new preset name
  const validatePresetName = useCallback((newValue: string) => {
    if (isRestrictedPresetName(newValue)) {
      return PresetErrorEnum.RESTRICTED;
    }

    return '';
  }, []);

  // Validating a preset rename
  const validatePresetRename = useCallback(
    (newValue: string) => {
      if (!newValue) {
        return PresetErrorEnum.EMPTY;
      }
      if (presetNames.some((value) => value === newValue)) {
        return PresetErrorEnum.DUPLICATE;
      }

      return validatePresetName(newValue);
    },
    [presetNames, validatePresetName]
  );

  const handleChangeNewPresetName = (newValue: string) => {
    setPresetName(newValue);

    // Update selectedPresetName if the input value matches an existing preset name
    const newSelectedName = presetNames.some((n) => n === newValue)
      ? newValue
      : undefined;
    setSelectedPresetName(newSelectedName);

    // Validate new preset name and update error message accordingly
    const msg = validatePresetName(newValue);
    setNewPresetNameError(msg);
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
        dispatchPresetNames({
          type: PresetActionEnum.DELETE,
          presetName: deletedValue,
        });
      } catch (e) {
        // continue to run, the worst case is that the file still exists and that's all.
      }
    },
    []
  );

  // Renaming an existing preset
  const handleRenameExistingPresetName = useCallback(
    (oldName: string) => async (newName: string) => {
      try {
        await renamePreset(oldName, newName);
        dispatchPresetNames({
          type: PresetActionEnum.RENAME,
          oldName,
          newName,
        });

        // Update selected preset and new preset name to reflect updated value
        setPresetName(newName);
        setSelectedPresetName(newName);
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    },
    [setGlobalError]
  );

  const options: IOptionEntry[] = useMemo(() => {
    return presetNames.map((n) => {
      return {
        value: n,
        label: n,
        display: (
          <PresetListItem
            value={n}
            handleRename={handleRenameExistingPresetName(n)}
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
          errorMessage={newPresetNameError}
          handleChange={handleChangeNewPresetName}
          formatInput={formatPresetName}
        />
      </div>
      <Button
        ariaLabel="Save settings to preset"
        className="small"
        isDisabled={!!globalError || !presetName || !!newPresetNameError}
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
