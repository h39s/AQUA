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
import { screen } from '@testing-library/react';
import { clearAndType, setup } from '__tests__/utils/userEventUtils';
import PresetListItem from '../../renderer/components/PresetListItem';

describe('PresetListItem', () => {
  const editModeLabel = 'Edit Preset Name';
  const editIconLabel = 'Edit Icon';
  const deleteIconLabel = 'Delete Icon';
  const handleRename = jest.fn();
  const handleDelete = jest.fn();
  const validate = jest.fn();

  beforeEach(() => {
    handleRename.mockClear();
    handleDelete.mockClear();
    validate.mockClear();
  });

  it('should render display mode', async () => {
    const testValue = 'Standard';
    setup(
      <PresetListItem
        value={testValue}
        handleRename={handleRename}
        handleDelete={handleDelete}
        isDisabled={false}
        validate={validate}
      />
    );

    expect(screen.getByText(testValue)).toBeInTheDocument();
    expect(screen.getByLabelText(editIconLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(deleteIconLabel)).toBeInTheDocument();
  });

  it('should enter and exit edit mode', async () => {
    const testValue = 'Standard';
    const { user } = setup(
      <PresetListItem
        value={testValue}
        handleRename={handleRename}
        handleDelete={handleDelete}
        isDisabled={false}
        validate={validate}
      />
    );
    const editIcon = screen.getByLabelText(editIconLabel);
    await user.click(editIcon);

    const editInput = screen.getByLabelText(editModeLabel);
    expect(editInput).toBeInTheDocument();

    await user.click(editInput);
    await user.keyboard('{Escape}');
    expect(screen.getByLabelText(editIconLabel)).toBeInTheDocument();
  });

  it('should handle delete', async () => {
    const testValue = 'Standard';
    const { user } = setup(
      <PresetListItem
        value={testValue}
        handleRename={handleRename}
        handleDelete={handleDelete}
        isDisabled={false}
        validate={validate}
      />
    );
    const deleteIcon = screen.getByLabelText(deleteIconLabel);
    await user.click(deleteIcon);

    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it('should handle change', async () => {
    const testValue = 'Standard';
    const newValue = 'Standard 2';
    const { user } = setup(
      <PresetListItem
        value={testValue}
        handleRename={handleRename}
        handleDelete={handleDelete}
        isDisabled={false}
        validate={validate}
      />
    );
    const editIcon = screen.getByLabelText(editIconLabel);
    await user.click(editIcon);

    const editInput = screen.getByLabelText(editModeLabel);
    expect(editInput).toBeInTheDocument();

    await clearAndType(user, editInput, newValue);
    await user.keyboard('{Enter}');
    expect(screen.getByLabelText(editIconLabel)).toBeInTheDocument();
    expect(validate).toHaveBeenCalledTimes(1);
    expect(handleRename).toHaveBeenCalledTimes(1);
    expect(handleRename).toHaveBeenCalledWith(newValue);
  });

  it('should handle change with format change', async () => {
    const testValue = 'Standard';
    const newValue = 'tO p$RoPeR /cAsInG -_';
    const expectedNewValue = 'tO pRoPeR cAsInG -_';
    const { user } = setup(
      <PresetListItem
        value={testValue}
        handleRename={handleRename}
        handleDelete={handleDelete}
        isDisabled={false}
        validate={validate}
      />
    );
    const editIcon = screen.getByLabelText(editIconLabel);
    await user.click(editIcon);

    const editInput = screen.getByLabelText(editModeLabel);
    expect(editInput).toBeInTheDocument();

    await clearAndType(user, editInput, newValue);
    await user.keyboard('{Enter}');
    expect(screen.getByLabelText(editIconLabel)).toBeInTheDocument();
    expect(validate).toHaveBeenCalledTimes(1);
    expect(handleRename).toHaveBeenCalledTimes(1);
    expect(handleRename).toHaveBeenCalledWith(expectedNewValue);
  });

  it('should handle change with validation error', async () => {
    const testValue = 'Standard';
    const newValue = 'Temp';
    const errorMsg = 'ERROR';
    validate.mockReturnValue(errorMsg);

    const { user } = setup(
      <PresetListItem
        value={testValue}
        handleRename={handleRename}
        handleDelete={handleDelete}
        isDisabled={false}
        validate={validate}
      />
    );
    const editIcon = screen.getByLabelText(editIconLabel);
    await user.click(editIcon);

    const editInput = screen.getByLabelText(editModeLabel);
    expect(editInput).toBeInTheDocument();

    await clearAndType(user, editInput, newValue);
    await user.keyboard('{Enter}');

    expect(validate).toHaveBeenCalledTimes(1);
    expect(handleRename).toHaveBeenCalledTimes(0);
    expect(screen.queryByLabelText(editIconLabel)).not.toBeInTheDocument();
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('should be disabled', async () => {
    const testValue = 'Standard';

    setup(
      <PresetListItem
        value={testValue}
        handleRename={handleRename}
        handleDelete={handleDelete}
        isDisabled
        validate={validate}
      />
    );
    const editIcon = screen.getByLabelText(editIconLabel);
    expect(editIcon).toHaveAttribute('aria-disabled', 'true');
    const deleteIcon = screen.getByLabelText(editIconLabel);
    expect(deleteIcon).toHaveAttribute('aria-disabled', 'true');
  });
});
