import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Slider from '../../renderer/Slider';

describe('Slider', () => {
  const name = 'Slider';
  const getValue = jest.fn();
  const setValue = jest.fn();

  beforeEach(() => {
    getValue.mockClear();
    setValue.mockClear();
  });

  it('should render with name and initial value', async () => {
    const testValue = 1;
    getValue.mockReturnValue(testValue);
    await act(async () => {
      render(
        <Slider
          name={name}
          min={-5}
          max={5}
          getValue={getValue}
          setValue={setValue}
        />
      );
    });
    const rangeInput = screen.getByLabelText(`${name}-range`);
    await waitFor(() => expect(rangeInput).not.toBeDisabled());
    expect(rangeInput).toHaveValue(`${testValue}`);
    expect(screen.getByLabelText(`${name}-number`)).toHaveValue(`${testValue}`);
  });

  it('should update range to match number', async () => {
    const testValue = 1;
    getValue.mockReturnValue(testValue);
    await act(async () => {
      render(
        <Slider
          name={name}
          min={-5}
          max={5}
          getValue={getValue}
          setValue={setValue}
        />
      );
    });
    const rangeInput = screen.getByLabelText(`${name}-range`);
    const numberInput = screen.getByLabelText(`${name}-number`);
    expect(rangeInput).toHaveValue(`${testValue}`);
    expect(numberInput).toHaveValue(`${testValue}`);

    numberInput.focus();
    fireEvent.input(numberInput, { target: { value: -6 } });
    expect(numberInput).toHaveValue('-6');
    expect(rangeInput).toHaveValue(`${testValue}`);
    fireEvent.keyDown(numberInput, { key: 'Enter', code: 'Enter' });
    expect(numberInput).toHaveValue('-5');
    expect(rangeInput).toHaveValue('-5');
  });

  it('should update number to match range', async () => {
    const testValue = 1;
    getValue.mockReturnValue(testValue);
    await act(async () => {
      render(
        <Slider
          name={name}
          min={-5}
          max={5}
          getValue={getValue}
          setValue={setValue}
        />
      );
    });
    const rangeInput = screen.getByLabelText(`${name}-range`);
    const numberInput = screen.getByLabelText(`${name}-number`);
    expect(rangeInput).toHaveValue(`${testValue}`);
    expect(numberInput).toHaveValue(`${testValue}`);

    fireEvent.input(rangeInput, { target: { value: 4 } });
    expect(rangeInput).toHaveValue('4');
    expect(numberInput).toHaveValue('4');
  });
});
