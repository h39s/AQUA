import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import NumberInput from '../../renderer/NumberInput';

describe('NumberInput', () => {
  const id = 'Number Input';
  const handleSubmit = jest.fn();

  beforeEach(() => {
    handleSubmit.mockClear();
  });

  it('should render with name', () => {
    const testValue = 1;
    render(
      <NumberInput
        name={id}
        min={1}
        max={5}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
        showArrows={false}
        showLabel
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
        min={-5}
        max={5}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
        showArrows={false}
        showLabel={false}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(testValue);

    fireEvent.input(input, {
      target: { value: '-' },
    });
    expect(input).toHaveValue('-');
  });

  it('should allow input to be changed to a negative value', () => {
    const testValue = '';
    render(
      <NumberInput
        name={id}
        min={-5}
        max={5}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
        showArrows={false}
        showLabel={false}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(testValue);

    fireEvent.input(input, {
      target: { value: '-1' },
    });
    expect(input).toHaveValue('-1');
  });

  it('should clamp submitted values below the minimum to be within the threshold', () => {
    const testValue = -6;
    render(
      <NumberInput
        name={id}
        min={-5}
        max={5}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
        showArrows={false}
        showLabel={false}
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
        min={-5}
        max={5}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
        showArrows={false}
        showLabel={false}
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
        min={-5}
        max={5}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled
        showArrows={false}
        showLabel={false}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(testValue);
    expect(input).toBeDisabled();
  });
});
