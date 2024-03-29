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
import { fireEvent, screen } from '@testing-library/react';
import { setup } from '__tests__/utils/userEventUtils';
import RangeInput from '../../renderer/widgets/RangeInput';

describe('RangeInput', () => {
  const name = 'Range Input';
  const handleChange = jest.fn();
  const handleMouseUp = jest.fn();

  beforeEach(() => {
    handleChange.mockClear();
    handleMouseUp.mockClear();
  });

  it('should render with name', () => {
    const testValue = 1;
    setup(
      <RangeInput
        name={name}
        min={1}
        max={5}
        handleChange={handleChange}
        handleMouseUp={handleMouseUp}
        height="150px"
        value={testValue}
        isDisabled={false}
      />
    );
    expect(screen.getByLabelText(name)).toHaveValue(`${testValue}`);
  });

  it('should allow input to be changed to a negative value', () => {
    const testValue = 0;
    setup(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleMouseUp={handleMouseUp}
        height="150px"
        value={testValue}
        isDisabled={false}
      />
    );
    const input = screen.getByLabelText(name);
    expect(input).toHaveValue(`${testValue}`);

    fireEvent.input(input, {
      target: { value: -5 },
    });

    expect(handleChange).toBeCalledWith(-5);
  });

  it('should allow input to be changed to a positive value', () => {
    const testValue = 0;
    setup(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleMouseUp={handleMouseUp}
        height="150px"
        value={testValue}
        isDisabled={false}
      />
    );
    const input = screen.getByLabelText(name);
    expect(input).toHaveValue(`${testValue}`);

    fireEvent.input(input, {
      target: { value: 5 },
    });

    expect(handleChange).toBeCalledWith(5);
  });

  it('should increase value using up arrow', async () => {
    const testValue = 0;
    const { user } = setup(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleMouseUp={handleMouseUp}
        height="150px"
        value={testValue}
        isDisabled={false}
      />
    );
    const arrow = screen.getByLabelText(`Increase ${name}`);
    await user.click(arrow);
    expect(handleChange).toBeCalledWith(1);
  });

  it('should decrease value using down arrow', async () => {
    const testValue = 0;
    const { user } = setup(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleMouseUp={handleMouseUp}
        height="150px"
        value={testValue}
        isDisabled={false}
      />
    );
    const arrow = screen.getByLabelText(`Decrease ${name}`);
    await user.click(arrow);
    expect(handleChange).toBeCalledWith(-1);
  });

  it('should increase value when scrolling up', async () => {
    const testValue = 0;
    setup(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleMouseUp={handleMouseUp}
        height="150px"
        value={testValue}
        isDisabled={false}
      />
    );
    const slider = screen.getByLabelText(`${name}`);
    fireEvent.wheel(slider, { deltaY: -100 });
    expect(handleChange).toBeCalledWith(1);
  });

  it('should increase value when scrolling down', async () => {
    const testValue = 0;
    setup(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleMouseUp={handleMouseUp}
        height="150px"
        value={testValue}
        isDisabled={false}
      />
    );
    const slider = screen.getByLabelText(`${name}`);
    fireEvent.wheel(slider, { deltaY: 43 });
    expect(handleChange).toBeCalledWith(-1);
  });

  it('should increment value using up arrow for non-zero precision', async () => {
    const testValue = 0;
    const { user } = setup(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleMouseUp={handleMouseUp}
        height="150px"
        value={testValue}
        isDisabled={false}
        incrementPrecision={1}
        displayPrecision={1}
      />
    );
    const arrow = screen.getByLabelText(`Increase ${name}`);
    await user.click(arrow);
    expect(handleChange).toBeCalledWith(0.1);
  });

  it('should increment value using up arrow for non-integer increment', async () => {
    const testValue = 0.4;
    const { user } = setup(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleMouseUp={handleMouseUp}
        height="150px"
        value={testValue}
        isDisabled={false}
        incrementPrecision={0}
        displayPrecision={1}
      />
    );
    const arrow = screen.getByLabelText(`Increase ${name}`);
    await user.click(arrow);
    expect(handleChange).toBeCalledWith(1.4);
  });

  it('should be disabled', async () => {
    const testValue = 0;
    const { user } = setup(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleMouseUp={handleMouseUp}
        height="150px"
        value={testValue}
        isDisabled
      />
    );

    const input = screen.getByLabelText(name);
    expect(input).toBeDisabled();

    const downArrow = screen.getByLabelText(`Decrease ${name}`);
    expect(downArrow).toHaveAttribute('aria-disabled', 'true');
    await user.click(downArrow);
    expect(handleChange).not.toHaveBeenCalled();

    const upArrow = screen.getByLabelText(`Increase ${name}`);
    expect(upArrow).toHaveAttribute('aria-disabled', 'true');
    await user.click(upArrow);
    expect(handleChange).not.toHaveBeenCalled();

    const slider = screen.getByLabelText(`${name}`);
    fireEvent.wheel(slider, { deltaY: -100 });
    expect(handleChange).not.toHaveBeenCalled();
  });
});
