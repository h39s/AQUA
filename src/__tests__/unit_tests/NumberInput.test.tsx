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
        showLabel
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
        floatPrecision={1}
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
        floatPrecision={3}
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
        floatPrecision={1}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    await clearAndType(user, input, '-2.6e10');
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
        floatPrecision={2}
        shouldRoundToHalf
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    await clearAndType(user, input, '-1.1621');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(-1.15);
  });

  it('should be able to enter 0', async () => {
    const testValue = 1;
    const { user } = setup(
      <NumberInput
        name={id}
        min={-5}
        max={5}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
        floatPrecision={2}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    await clearAndType(user, input, '01234');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(0);

    await user.type(input, '.134');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(0.13);
  });

  it('should be able to enter a number in the range without a 0 prior to the decimal point', async () => {
    const testValue = 1;
    const { user } = setup(
      <NumberInput
        name={id}
        min={-5}
        max={5}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
        floatPrecision={2}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    await clearAndType(user, input, '-.12');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(-0.12);

    await clearAndType(user, input, '.56');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(0.56);
  });

  it('should not be able to enter a negative sign for integers when min is non-negative', async () => {
    const testValue = 1;
    const { user } = setup(
      <NumberInput
        name={id}
        min={0}
        max={5}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    await clearAndType(user, input, '-1');
    expect(input).toHaveValue('1');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(1);
  });

  it('should not be able to enter a negative sign for floats when min is non-negative', async () => {
    const testValue = 1;
    const { user } = setup(
      <NumberInput
        name={id}
        min={0}
        max={5}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
        floatPrecision={2}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    await clearAndType(user, input, '-1.12');
    expect(input).toHaveValue('1.12');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(1.12);
  });

  it('should be able to enter a decimal number with the leading 0 between -1 and 1', async () => {
    const testValue = 1;
    const { user } = setup(
      <NumberInput
        name={id}
        min={-5}
        max={5}
        handleSubmit={handleSubmit}
        value={testValue}
        isDisabled={false}
        floatPrecision={2}
      />
    );
    const input = screen.getByLabelText(id);
    expect(input).toHaveValue(`${testValue}`);

    await clearAndType(user, input, '-0.12');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(-0.12);

    await clearAndType(user, input, '0.6');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toBeCalledWith(0.6);
  });
});
