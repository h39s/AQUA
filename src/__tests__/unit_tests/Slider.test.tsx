import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AquaProviderWrapper } from 'renderer/utils/AquaContext';
import defaultAquaContext from '../utils/mockAquaProvider';
import { clearAndType, setup } from '../utils/userEventUtils';
import Slider from '../../renderer/components/Slider';

describe('Slider', () => {
  const name = 'Slider';
  const setValue = jest.fn();

  beforeEach(() => {
    setValue.mockClear();
  });

  it('should render with name and initial value', async () => {
    const testValue = 1;
    await act(async () => {
      setup(
        <AquaProviderWrapper value={defaultAquaContext}>
          <Slider
            name={name}
            min={-5}
            max={5}
            value={testValue}
            setValue={setValue}
          />
        </AquaProviderWrapper>
      );
    });
    const rangeInput = screen.getByLabelText(`${name}-range`);
    await waitFor(() => expect(rangeInput).not.toBeDisabled());
    expect(rangeInput).toHaveValue(`${testValue}`);
    expect(screen.getByLabelText(`${name}-number`)).toHaveValue(`${testValue}`);
  });

  it('should update range to match number', async () => {
    const user = userEvent.setup();
    const testValue = 1;
    await act(async () => {
      setup(
        <AquaProviderWrapper value={defaultAquaContext}>
          <Slider
            name={name}
            min={-5}
            max={5}
            value={testValue}
            setValue={setValue}
          />
        </AquaProviderWrapper>
      );
    });
    const rangeInput = screen.getByLabelText(`${name}-range`);
    const numberInput = screen.getByLabelText(`${name}-number`);
    expect(rangeInput).toHaveValue(`${testValue}`);
    expect(numberInput).toHaveValue(`${testValue}`);

    await clearAndType(user, numberInput, '-6');
    expect(numberInput).toHaveValue('-6');
    expect(rangeInput).toHaveValue(`${testValue}`);

    await user.keyboard('{Enter}');
    expect(numberInput).toHaveValue('-5');
    expect(rangeInput).toHaveValue('-5');
  });

  it('should update number to match range', async () => {
    const testValue = 1;
    await act(async () => {
      setup(
        <AquaProviderWrapper value={defaultAquaContext}>
          <Slider
            name={name}
            min={-5}
            max={5}
            value={testValue}
            setValue={setValue}
          />
        </AquaProviderWrapper>
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

  it('should increment value by 0.1 using the up arrow', async () => {
    const testValue = 1;
    const user = userEvent.setup();
    await act(async () => {
      setup(
        <AquaProviderWrapper value={defaultAquaContext}>
          <Slider
            name={name}
            min={-5}
            max={5}
            value={testValue}
            setValue={setValue}
          />
        </AquaProviderWrapper>
      );
    });

    const rangeInput = screen.getByLabelText(`${name}-range`);
    const numberInput = screen.getByLabelText(`${name}-number`);

    const arrow = screen.getByLabelText(`Increase ${name}-range`);
    await user.click(arrow);
    expect(rangeInput).toHaveValue('1.1');
    expect(numberInput).toHaveValue('1.1');
  });

  it('should alow up to two decimal digits in number', async () => {
    const user = userEvent.setup();
    const testValue = 1;
    await act(async () => {
      setup(
        <AquaProviderWrapper value={defaultAquaContext}>
          <Slider
            name={name}
            min={-5}
            max={5}
            value={testValue}
            setValue={setValue}
          />
        </AquaProviderWrapper>
      );
    });
    const numberInput = screen.getByLabelText(`${name}-number`);
    await clearAndType(user, numberInput, '-1.123');
    expect(numberInput).toHaveValue('-1.123');
    await user.keyboard('{Enter}');
    expect(numberInput).toHaveValue('-1.12');
  });
});
