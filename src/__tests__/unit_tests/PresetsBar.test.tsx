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

import '@testing-library/jest-dom';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PresetsBar, { PresetErrorEnum } from 'renderer/PresetsBar';
import { AquaProviderWrapper } from 'renderer/utils/AquaContext';
import defaultAquaContext from '__tests__/utils/mockAquaProvider';
import { clearAndType, setup } from '__tests__/utils/userEventUtils';

describe('PresetListItem', () => {
  const samplePresetNames = ['Apple', 'Banana', 'Oranges'];
  const presetNameInputLabel = 'Preset Name';
  const loadPresetButtonLabel = 'Load selected preset';
  const savePresetButtonLabel = 'Save settings to preset';
  const editIconLabel = 'Edit Icon';
  const editModeLabel = 'Edit Preset Name';
  const caseSensitiveContext = {
    ...defaultAquaContext,
    isCaseSensitiveFs: true,
  };

  const fetchPresets = jest.fn();
  const loadPreset = jest.fn();
  const savePreset = jest.fn();
  const renamePreset = jest.fn();
  const deletePreset = jest.fn();

  beforeEach(() => {
    fetchPresets.mockClear();
    loadPreset.mockClear();
    savePreset.mockClear();
    renamePreset.mockClear();
    deletePreset.mockClear();
  });

  it('should be empty', async () => {
    setup(
      <AquaProviderWrapper value={defaultAquaContext}>
        <PresetsBar
          fetchPresets={fetchPresets}
          loadPreset={loadPreset}
          savePreset={savePreset}
          renamePreset={renamePreset}
          deletePreset={deletePreset}
        />
      </AquaProviderWrapper>
    );

    expect(screen.getByText('No presets found.')).toBeInTheDocument();
    expect(screen.queryByText(samplePresetNames[0])).not.toBeInTheDocument();
    expect(fetchPresets).toHaveBeenCalledTimes(1);
  });

  it('should list the presets', async () => {
    fetchPresets.mockReturnValue(samplePresetNames);
    await act(async () => {
      setup(
        <AquaProviderWrapper value={defaultAquaContext}>
          <PresetsBar
            fetchPresets={fetchPresets}
            loadPreset={loadPreset}
            savePreset={savePreset}
            renamePreset={renamePreset}
            deletePreset={deletePreset}
          />
        </AquaProviderWrapper>
      );
    });

    expect(screen.getByText(samplePresetNames[0])).toBeInTheDocument();
    expect(screen.getByText(samplePresetNames[1])).toBeInTheDocument();
    expect(screen.getByText(samplePresetNames[2])).toBeInTheDocument();
    expect(fetchPresets).toHaveBeenCalledTimes(1);
  });

  it('should support loading a preset', async () => {
    fetchPresets.mockReturnValue(samplePresetNames);
    const { user } = setup(
      <AquaProviderWrapper value={defaultAquaContext}>
        <PresetsBar
          fetchPresets={fetchPresets}
          loadPreset={loadPreset}
          savePreset={savePreset}
          renamePreset={renamePreset}
          deletePreset={deletePreset}
        />
      </AquaProviderWrapper>
    );

    const presetNameInput = screen.getByLabelText(presetNameInputLabel);
    const loadButton = screen.getByLabelText(loadPresetButtonLabel);
    expect(loadButton).toHaveAttribute('aria-disabled', 'true');
    await clearAndType(user, presetNameInput, samplePresetNames[0]);
    expect(loadButton).toHaveAttribute('aria-disabled', 'false');
    await user.click(loadButton);
    expect(loadPreset).toHaveBeenCalledTimes(1);
  });

  it('should support saving a new preset', async () => {
    fetchPresets.mockReturnValue(samplePresetNames);
    const { user } = setup(
      <AquaProviderWrapper value={defaultAquaContext}>
        <PresetsBar
          fetchPresets={fetchPresets}
          loadPreset={loadPreset}
          savePreset={savePreset}
          renamePreset={renamePreset}
          deletePreset={deletePreset}
        />
      </AquaProviderWrapper>
    );

    const presetNameInput = screen.getByLabelText(presetNameInputLabel);
    const saveButton = screen.getByLabelText(savePresetButtonLabel);
    expect(saveButton).toHaveAttribute('aria-disabled', 'true');
    await clearAndType(user, presetNameInput, 'Pineapple');
    expect(saveButton).toHaveAttribute('aria-disabled', 'false');
    await user.click(saveButton);
    expect(savePreset).toHaveBeenCalledTimes(1);
  });

  it('should support saving an existing preset', async () => {
    fetchPresets.mockReturnValue(samplePresetNames);
    const { user } = setup(
      <AquaProviderWrapper value={defaultAquaContext}>
        <PresetsBar
          fetchPresets={fetchPresets}
          loadPreset={loadPreset}
          savePreset={savePreset}
          renamePreset={renamePreset}
          deletePreset={deletePreset}
        />
      </AquaProviderWrapper>
    );

    const presetNameInput = screen.getByLabelText(presetNameInputLabel);
    const saveButton = screen.getByLabelText(savePresetButtonLabel);
    expect(saveButton).toHaveAttribute('aria-disabled', 'true');
    await clearAndType(user, presetNameInput, samplePresetNames[0]);
    expect(saveButton).toHaveAttribute('aria-disabled', 'false');
    await user.click(saveButton);
    expect(savePreset).toHaveBeenCalledTimes(1);
  });

  it('should disallow invalid new preset names for case sensitive systems', async () => {
    fetchPresets.mockReturnValue(samplePresetNames);
    const { user } = setup(
      <AquaProviderWrapper value={caseSensitiveContext}>
        <PresetsBar
          fetchPresets={fetchPresets}
          loadPreset={loadPreset}
          savePreset={savePreset}
          renamePreset={renamePreset}
          deletePreset={deletePreset}
        />
      </AquaProviderWrapper>
    );

    const presetNameInput = screen.getByLabelText(presetNameInputLabel);
    const saveButton = screen.getByLabelText(savePresetButtonLabel);
    expect(saveButton).toHaveAttribute('aria-disabled', 'true');

    // Submitting with no name should not save
    await user.type(presetNameInput, '{Enter}');
    expect(savePreset).toHaveBeenCalledTimes(0);

    // Restricted preset name
    await clearAndType(user, presetNameInput, 'CON');
    expect(saveButton).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText(PresetErrorEnum.RESTRICTED)).toBeInTheDocument();

    // Submitting with an error present should not save
    await user.type(presetNameInput, '{Enter}');
    expect(savePreset).toHaveBeenCalledTimes(0);

    // Allow preset name that isn't an exact match
    await clearAndType(
      user,
      presetNameInput,
      samplePresetNames[0].toLocaleLowerCase()
    );
    expect(saveButton).toHaveAttribute('aria-disabled', 'false');
    await user.type(presetNameInput, '{Enter}');
    expect(savePreset).toHaveBeenCalledTimes(1);
  });

  it('should disallow invalid new preset names for case insensitive systems', async () => {
    fetchPresets.mockReturnValue(samplePresetNames);
    const { user } = setup(
      <AquaProviderWrapper value={defaultAquaContext}>
        <PresetsBar
          fetchPresets={fetchPresets}
          loadPreset={loadPreset}
          savePreset={savePreset}
          renamePreset={renamePreset}
          deletePreset={deletePreset}
        />
      </AquaProviderWrapper>
    );

    const presetNameInput = screen.getByLabelText(presetNameInputLabel);
    const saveButton = screen.getByLabelText(savePresetButtonLabel);
    expect(saveButton).toHaveAttribute('aria-disabled', 'true');

    // Restricted preset name
    await clearAndType(user, presetNameInput, 'CON');
    expect(saveButton).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText(PresetErrorEnum.RESTRICTED)).toBeInTheDocument();

    // Duplicate preset name that isn't an exact match
    await clearAndType(
      user,
      presetNameInput,
      samplePresetNames[0].toLocaleLowerCase()
    );
    expect(saveButton).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText(PresetErrorEnum.DUPLICATE)).toBeInTheDocument();
  });

  it('should disallow invalid renamed presets for case sensitive systems', async () => {
    fetchPresets.mockReturnValue(samplePresetNames);
    const user = userEvent.setup();

    await act(async () => {
      setup(
        <AquaProviderWrapper value={caseSensitiveContext}>
          <PresetsBar
            fetchPresets={fetchPresets}
            loadPreset={loadPreset}
            savePreset={savePreset}
            renamePreset={renamePreset}
            deletePreset={deletePreset}
          />
        </AquaProviderWrapper>
      );
    });

    // Assume we click the edit icon of the first preset which is Apple
    const editIcon = screen.getAllByLabelText(editIconLabel)[0];
    await user.click(editIcon);
    const editInput = screen.getByLabelText(editModeLabel);
    expect(editInput).toBeInTheDocument();

    // Restricted preset name
    await clearAndType(user, editInput, 'COM1');
    await user.keyboard('{Enter}');
    expect(screen.getByText(PresetErrorEnum.RESTRICTED)).toBeInTheDocument();

    // Exact duplicate exists
    await clearAndType(user, editInput, 'Banana');
    await user.keyboard('{Enter}');
    expect(screen.getByText(PresetErrorEnum.DUPLICATE)).toBeInTheDocument();

    // Allow name that differs by case only
    await clearAndType(user, editInput, 'bAnAnA');
    await user.keyboard('{Enter}');
    expect(screen.getByText('bAnAnA')).toBeInTheDocument();

    // Refetch editIcon and editInput because the elemnts were rerendered
    await user.click(screen.getAllByLabelText(editIconLabel)[0]);
    // Allow rename to the same name that differs by case only
    await clearAndType(user, screen.getByLabelText(editModeLabel), 'aPpLe');
    await user.keyboard('{Enter}');
    expect(screen.getByText('aPpLe')).toBeInTheDocument();
  });

  it('should disallow invalid renamed presets for case insensitive systems', async () => {
    fetchPresets.mockReturnValue(samplePresetNames);
    const user = userEvent.setup();

    await act(async () => {
      setup(
        <AquaProviderWrapper value={defaultAquaContext}>
          <PresetsBar
            fetchPresets={fetchPresets}
            loadPreset={loadPreset}
            savePreset={savePreset}
            renamePreset={renamePreset}
            deletePreset={deletePreset}
          />
        </AquaProviderWrapper>
      );
    });

    // Assume we click the edit icon of the first preset which is Apple
    const editIcon = screen.getAllByLabelText(editIconLabel)[0];
    await user.click(editIcon);
    const editInput = screen.getByLabelText(editModeLabel);
    expect(editInput).toBeInTheDocument();

    // Restricted preset name
    await clearAndType(user, editInput, 'COM1');
    await user.keyboard('{Enter}');
    expect(screen.getByText(PresetErrorEnum.RESTRICTED)).toBeInTheDocument();

    // Exact duplicate exists
    await clearAndType(user, editInput, 'Banana');
    await user.keyboard('{Enter}');
    expect(screen.getByText(PresetErrorEnum.DUPLICATE)).toBeInTheDocument();

    // Duplicate that differs only by case exists
    await clearAndType(user, editInput, 'bAnAnA');
    await user.keyboard('{Enter}');
    expect(screen.getByText(PresetErrorEnum.DUPLICATE)).toBeInTheDocument();

    // Allow rename to the same name that differs by case only
    await clearAndType(user, editInput, 'aPpLe');
    await user.keyboard('{Enter}');
    expect(screen.getByText('aPpLe')).toBeInTheDocument();
  });

  it('should disallow loading non-existant presets', async () => {
    fetchPresets.mockReturnValue(samplePresetNames);
    const { user } = setup(
      <AquaProviderWrapper value={defaultAquaContext}>
        <PresetsBar
          fetchPresets={fetchPresets}
          loadPreset={loadPreset}
          savePreset={savePreset}
          renamePreset={renamePreset}
          deletePreset={deletePreset}
        />
      </AquaProviderWrapper>
    );
    // type in non existent presetname
    const textbox = screen.getByLabelText(presetNameInputLabel);
    expect(textbox).toBeInTheDocument();
    await user.type(textbox, 'john cena');
    expect(screen.getByLabelText(loadPresetButtonLabel)).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });
});
