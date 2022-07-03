import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { clearAndType, setup } from '../utils/userEventUtils';
import NumberInput from '../../renderer/NumberInput';

describe('NumberInput', () => {
  const id = 'Number Input';
  const handleSubmit = jest.fn();

  beforeEach(() => {
    handleSubmit.mockClear();
  });

  it('should render with name', () => {
    const testValue = 1;
    setup(
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

  it('should allow input to be changed to a negative sign', async () => {
    const testValue = 0;
    const { user } = setup(
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

    await clearAndType(user, input, '-');
    expect(input).toHaveValue('-');
  });

  it('should allow input to be changed to a negative value', async () => {
    const testValue = 0;
    const { user } = setup(
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

    await clearAndType(user, input, '-1');
    expect(input).toHaveValue('-1');
  });

  it('should clamp submitted values below the minimum to be within the threshold', async () => {
    const testValue = -6;
    const { user } = setup(
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

    await user.click(input);
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(-5);
  });

  it('should clamp submitted values above the maximum to be within the threshold', async () => {
    const testValue = 6;
    const { user } = setup(
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

    await user.click(input);
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(4.3);
  });

  it('should be disabled', () => {
    const testValue = 0;
    setup(
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

  it('should be able to truncate to the correct float precision', async () => {
    const testValue = 1;
    const { user } = setup(
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

    await clearAndType(user, input, '1.6912');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(1.691);

    await clearAndType(user, input, '-2.60000');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(-2.6);
  });

  it('should not accept bad inputs for float input', async () => {
    const testValue = 2;
    const { user } = setup(
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

    await clearAndType(user, input, '-2.6e10');
    screen.logTestingPlaygroundURL();
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(-2.6);
  });

  it('should be able to round to the correct float precision', async () => {
    const testValue = 0;
    const { user } = setup(
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

    await clearAndType(user, input, '-1.1621');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(-1.15);
  });
});
