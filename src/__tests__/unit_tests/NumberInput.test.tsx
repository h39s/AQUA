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
        type="int"
      />
    );
    expect(screen.getByText(id)).toBeInTheDocument();
    expect(screen.getByLabelText(id)).toHaveValue(`${testValue}`);
  });

  it('should allow input to be changed to a negative sign', () => {
    const testValue = 0;
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
        type="float"
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    fireEvent.input(input, {
      target: { value: '-' },
    });
    expect(input).toHaveValue('-');
  });

  it('should allow input to be changed to a negative value', () => {
    const testValue = 0;
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
        type="int"
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

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
        type="int"
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
        max={4.3}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
        showArrows={false}
        showLabel={false}
        type="float"
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(handleSubmit).toBeCalledWith(4.3);
  });

  it('should be disabled', () => {
    const testValue = 0;
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
        type="int"
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);
    expect(input).toBeDisabled();
  });

  it('should be able to truncate to the correct float precision', () => {
    const testValue = 1;
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
        type="float"
        floatPrecision={0.001}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    fireEvent.input(input, {
      target: { value: '1.6912' },
    });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(handleSubmit).toBeCalledWith(1.691);

    fireEvent.change(input, {
      target: { value: '-2.60000' },
    });
    screen.logTestingPlaygroundURL();
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(handleSubmit).toBeCalledWith(-2.6);
  });

  it('should not accept bad inputs for float input', () => {
    const testValue = 2;
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
        type="float"
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    fireEvent.input(input, {
      target: { value: '-2.6e10' },
    });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(handleSubmit).toBeCalledWith(2);
  });

  it('should be able to round to the correct float precision', () => {
    const testValue = 0;
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
        type="float"
        floatPrecision={0.01}
        round
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    fireEvent.input(input, {
      target: { value: '-1.1621' },
    });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(handleSubmit).toBeCalledWith(-1.15);
  });
});
