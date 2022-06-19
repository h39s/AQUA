import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import NumberInput from '../renderer/NumberInput';

describe('NumberInput', () => {
  const id = 'Number Input';
  const handleChange = jest.fn();
  const handleSubmit = jest.fn();

  beforeEach(() => {
    handleChange.mockClear();
    handleSubmit.mockClear();
  });

  it('should render with name', () => {
    const testValue = 1;
    render(
      <NumberInput
        name={id}
        showLabel
        min={1}
        max={5}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
      />
    );
    expect(screen.getByText(id)).toBeInTheDocument();
    expect(screen.getByLabelText(id)).toHaveValue(`${testValue}`);
  });

  it('should allow input to be changed to a negative sign', () => {
    const testValue = '';
    render(
      <NumberInput
        name={id}
        showLabel={false}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(testValue);

    fireEvent.input(input, {
      target: { value: '-' },
    });

    expect(handleChange).toBeCalledWith('-');
  });

  it('should allow input to be changed to a negative value', () => {
    const testValue = '';
    render(
      <NumberInput
        name={id}
        showLabel={false}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(testValue);

    fireEvent.input(input, {
      target: { value: '-1' },
    });

    expect(handleChange).toBeCalledWith(-1);
  });

  it('should clamp submitted values below the minimum to be within the threshold', () => {
    const testValue = -6;
    render(
      <NumberInput
        name={id}
        showLabel={false}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(handleSubmit).toBeCalledWith(-5);
  });

  it('should clamp submitted values above the maximum to be within the threshold', () => {
    const testValue = 6;
    render(
      <NumberInput
        name={id}
        showLabel={false}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(handleSubmit).toBeCalledWith(5);
  });

  it('should be disabled', () => {
    const testValue = '';
    render(
      <NumberInput
        name={id}
        showLabel={false}
        min={-5}
        max={5}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(testValue);
    expect(input).toBeDisabled();
  });
});
