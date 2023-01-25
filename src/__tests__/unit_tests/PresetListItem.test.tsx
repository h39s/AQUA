import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { clearAndType, setup } from '__tests__/utils/userEventUtils';
import PresetListItem from '../../renderer/components/PresetListItem';

describe('PresetListItem', () => {
  const editModeLabel = 'Edit Preset Name';
  const editIconLabel = 'Edit Icon';
  const deleteIconLabel = 'Delete Icon';
  const handleChange = jest.fn();
  const handleDelete = jest.fn();
  const validate = jest.fn();

  beforeEach(() => {
    handleChange.mockClear();
    handleDelete.mockClear();
    validate.mockClear();
  });

  it('should render display mode', async () => {
    const testValue = 'Standard';
    setup(
      <PresetListItem
        value={testValue}
        handleChange={handleChange}
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
        handleChange={handleChange}
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
        handleChange={handleChange}
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
        handleChange={handleChange}
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
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(newValue);
  });

  it('should handle change with format change', async () => {
    const testValue = 'Standard';
    const newValue = 'tO pRoPeR cAsInG';
    const expectedNewValue = 'To proper casing';
    const { user } = setup(
      <PresetListItem
        value={testValue}
        handleChange={handleChange}
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
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(expectedNewValue);
  });

  it('should handle change with validation error', async () => {
    const testValue = 'Standard';
    const newValue = 'Temp';
    const errorMsg = 'ERROR';
    validate.mockReturnValue(errorMsg);

    const { user } = setup(
      <PresetListItem
        value={testValue}
        handleChange={handleChange}
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
    expect(handleChange).toHaveBeenCalledTimes(0);
    expect(screen.queryByLabelText(editIconLabel)).not.toBeInTheDocument();
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('should be disabled', async () => {
    const testValue = 'Standard';

    setup(
      <PresetListItem
        value={testValue}
        handleChange={handleChange}
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
