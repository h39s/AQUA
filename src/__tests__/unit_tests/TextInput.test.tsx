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
import { setup } from '__tests__/utils/userEventUtils';
import TextInput from '../../renderer/widgets/TextInput';

describe('TextInput', () => {
  const name = 'Text Input';
  const handleChange = jest.fn();
  const handleSubmit = jest.fn();
  const handleEscape = jest.fn();
  const validate = jest.fn();

  beforeEach(() => {
    handleChange.mockClear();
    handleSubmit.mockClear();
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
        errorMessage=""
      />
    );

    const editInput = screen.getByLabelText(name);
    expect(editInput).toHaveValue(testValue);

    await user.type(editInput, 'ab');
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleSubmit).toHaveBeenCalledTimes(0);
    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleSubmit).toHaveBeenCalledTimes(0);
  });

  it('should handle change on enter only', async () => {
    const testValue = 'Standard';
    const { user } = setup(
      <TextInput
        value={testValue}
        ariaLabel={name}
        handleSubmit={handleSubmit}
        handleEscape={handleEscape}
        isDisabled={false}
        errorMessage=""
      />
    );

    const editInput = screen.getByLabelText(name);
    expect(editInput).toHaveValue(testValue);

    await user.type(editInput, 'ab');
    expect(handleChange).toHaveBeenCalledTimes(0);
    expect(handleSubmit).toHaveBeenCalledTimes(0);

    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledTimes(0);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should handle change on change and on enter', async () => {
    const testValue = 'Standard';
    const { user } = setup(
      <TextInput
        value={testValue}
        ariaLabel={name}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleEscape={handleEscape}
        isDisabled={false}
        errorMessage=""
      />
    );

    const editInput = screen.getByLabelText(name);
    expect(editInput).toHaveValue(testValue);

    await user.type(editInput, 'ab');
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleSubmit).toHaveBeenCalledTimes(0);

    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display error message', async () => {
    const testValue = 'Standard';
    const errorMsg = 'ERROR';
    validate.mockReturnValue(errorMsg);
    setup(
      <TextInput
        value={testValue}
        ariaLabel={name}
        handleChange={handleChange}
        handleEscape={handleEscape}
        isDisabled={false}
        errorMessage={errorMsg}
      />
    );

    const editInput = screen.getByLabelText(name);
    expect(editInput).toHaveValue(testValue);
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('should be disabled', async () => {
    const testValue = 'Standard';
    const { user } = setup(
      <TextInput
        value={testValue}
        ariaLabel={name}
        handleSubmit={handleSubmit}
        handleEscape={handleEscape}
        isDisabled
        errorMessage=""
      />
    );

    expect(screen.getByLabelText(name)).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    const editInput = screen.getByLabelText(name);
    await user.type(editInput, '{Enter}');
    expect(handleSubmit).toBeCalledTimes(0);
  });
});
