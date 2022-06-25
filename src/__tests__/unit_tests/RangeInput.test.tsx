import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import RangeInput from '../../renderer/RangeInput';

describe('RangeInput', () => {
  const name = 'Range Input';
  const handleChange = jest.fn();

  beforeEach(() => {
    handleChange.mockClear();
  });

  it('should render with name', () => {
    const testValue = 1;
    render(
      <RangeInput
        name={name}
        min={1}
        max={5}
        handleChange={handleChange}
        value={testValue}
        isDisabled={false}
      />
    );
    expect(screen.getByLabelText(name)).toHaveValue(`${testValue}`);
  });

  it('should allow input to be changed to a negative value', () => {
    const testValue = 0;
    render(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
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
    render(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
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

  it('should increase value using up arrow', () => {
    const testValue = 0;
    render(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
        value={testValue}
        isDisabled={false}
      />
    );
    const arrow = screen.getByLabelText(`Increase ${name}`);
    fireEvent.mouseDown(arrow);
    fireEvent.mouseUp(arrow);
    expect(handleChange).toBeCalledWith(1);
  });

  it('should decrease value using down arrow', () => {
    const testValue = 0;
    render(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
        value={testValue}
        isDisabled={false}
      />
    );
    const arrow = screen.getByLabelText(`Decrease ${name}`);
    fireEvent.mouseDown(arrow);
    fireEvent.mouseUp(arrow);
    expect(handleChange).toBeCalledWith(-1);
  });

  it('should be disabled', () => {
    const testValue = 0;
    render(
      <RangeInput
        name={name}
        min={-5}
        max={5}
        handleChange={handleChange}
        value={testValue}
        isDisabled
      />
    );

    const input = screen.getByLabelText(name);
    expect(input).toBeDisabled();

    const downArrow = screen.getByLabelText(`Decrease ${name}`);
    expect(downArrow).toHaveAttribute('aria-disabled', 'true');
    fireEvent.mouseDown(downArrow);
    fireEvent.mouseUp(downArrow);
    expect(handleChange).not.toHaveBeenCalled();

    const upArrow = screen.getByLabelText(`Increase ${name}`);
    expect(upArrow).toHaveAttribute('aria-disabled', 'true');
    fireEvent.mouseDown(upArrow);
    fireEvent.mouseUp(upArrow);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
