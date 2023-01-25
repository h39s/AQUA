import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { setup } from '__tests__/utils/userEventUtils';
import TextInput from '../../renderer/widgets/TextInput';

describe('TextInput', () => {
  const name = 'Text Input';
  const handleChange = jest.fn();
  const handleEscape = jest.fn();
  const validate = jest.fn();

  beforeEach(() => {
    handleChange.mockClear();
    handleEscape.mockClear();
    validate.mockClear();
  });

  it('should handle change', async () => {
    const testValue = 'Standard';
    const { user } = setup(
      <TextInput
        value={testValue}
        ariaLabel={name}
        handleChange={handleChange}
        handleEscape={handleEscape}
        isDisabled={false}
      />
    );

    const editInput = screen.getByLabelText(name);
    expect(editInput).toHaveValue(testValue);

    await user.type(editInput, 'ab');
    expect(handleChange).toHaveBeenCalledTimes(2);
    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('should handle change on submit only', async () => {
    const testValue = 'Standard';
    const { user } = setup(
      <TextInput
        value={testValue}
        ariaLabel={name}
        handleChange={handleChange}
        handleEscape={handleEscape}
        isDisabled={false}
        updateOnSubmitOnly
      />
    );

    const editInput = screen.getByLabelText(name);
    expect(editInput).toHaveValue(testValue);

    await user.type(editInput, 'ab');
    expect(handleChange).toHaveBeenCalledTimes(0);

    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should handle change with validation', async () => {
    const testValue = 'Standard';
    const { user } = setup(
      <TextInput
        value={testValue}
        ariaLabel={name}
        handleChange={handleChange}
        handleEscape={handleEscape}
        validate={validate}
        isDisabled={false}
      />
    );

    const editInput = screen.getByLabelText(name);
    expect(editInput).toHaveValue(testValue);

    await user.type(editInput, 'ab');
    expect(validate).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenCalledTimes(2);
    await user.keyboard('{Enter}');
    expect(validate).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('should handle change with validation on submit only', async () => {
    const testValue = 'Standard';
    const { user } = setup(
      <TextInput
        value={testValue}
        ariaLabel={name}
        handleChange={handleChange}
        handleEscape={handleEscape}
        isDisabled={false}
        validate={validate}
        updateOnSubmitOnly
      />
    );

    const editInput = screen.getByLabelText(name);
    expect(editInput).toHaveValue(testValue);

    await user.type(editInput, 'ab');
    expect(validate).toHaveBeenCalledTimes(0);
    expect(handleChange).toHaveBeenCalledTimes(0);

    await user.keyboard('{Enter}');
    expect(validate).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should handle failed validation', async () => {
    const testValue = 'Standard';
    const errorMsg = 'ERROR';
    validate.mockReturnValue(errorMsg);
    const { user } = setup(
      <TextInput
        value={testValue}
        ariaLabel={name}
        handleChange={handleChange}
        handleEscape={handleEscape}
        isDisabled={false}
        validate={validate}
      />
    );

    const editInput = screen.getByLabelText(name);
    expect(editInput).toHaveValue(testValue);

    await user.type(editInput, 'ab');
    expect(validate).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenCalledTimes(0);
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('should handle failed validation on submit only', async () => {
    const testValue = 'Standard';
    const errorMsg = 'ERROR';
    validate.mockReturnValue(errorMsg);
    const { user } = setup(
      <TextInput
        value={testValue}
        ariaLabel={name}
        handleChange={handleChange}
        handleEscape={handleEscape}
        isDisabled={false}
        validate={validate}
        updateOnSubmitOnly
      />
    );

    const editInput = screen.getByLabelText(name);
    expect(editInput).toHaveValue(testValue);

    await user.type(editInput, 'ab');
    expect(validate).toHaveBeenCalledTimes(0);
    await user.keyboard('{Enter}');
    expect(validate).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledTimes(0);
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('should be disabled', async () => {
    const testValue = 'Standard';
    setup(
      <TextInput
        value={testValue}
        ariaLabel={name}
        handleChange={handleChange}
        handleEscape={handleEscape}
        isDisabled
        validate={validate}
      />
    );

    expect(screen.getByLabelText(name)).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });
});
