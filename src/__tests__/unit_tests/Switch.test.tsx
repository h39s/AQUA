import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { setup } from '../utils/userEventUtils';
import Switch from '../../renderer/widgets/Switch';

describe('Switch', () => {
  const id = 'switch';
  const onLoad = jest.fn();
  const handleToggle = jest.fn();

  beforeEach(() => {
    onLoad.mockClear();
    handleToggle.mockClear();
  });

  it('should render the on state', () => {
    setup(
      <Switch
        id={id}
        isOn={false}
        onLoad={onLoad}
        isDisabled={false}
        handleToggle={handleToggle}
      />
    );
    expect(onLoad).toHaveBeenCalledTimes(1);

    const input = screen.getByRole('checkbox');
    expect(input).not.toBeChecked();
  });

  it('should render the off state', () => {
    setup(
      <Switch
        id={id}
        isOn
        isDisabled={false}
        onLoad={onLoad}
        handleToggle={handleToggle}
      />
    );
    expect(onLoad).toHaveBeenCalledTimes(1);

    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();
  });

  it('should be able to trigger the toggle handler', async () => {
    const { user } = setup(
      <Switch
        id={id}
        isOn
        isDisabled={false}
        onLoad={onLoad}
        handleToggle={handleToggle}
      />
    );
    expect(onLoad).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('checkbox'));
    expect(handleToggle).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: id }));
    expect(handleToggle).toHaveBeenCalledTimes(2);
  });

  it('should not trigger the toggle handler when disabled', async () => {
    const { user } = setup(
      <Switch
        id={id}
        isOn
        isDisabled
        onLoad={onLoad}
        handleToggle={handleToggle}
      />
    );
    expect(onLoad).toHaveBeenCalledTimes(0);
    await user.click(screen.getByRole('checkbox'));
    expect(handleToggle).toHaveBeenCalledTimes(0);

    // TODO: investigate why this results in handleToggle being invoked
    // await user.click(screen.getByRole('button', { name: id }));
    // expect(handleToggle).toHaveBeenCalledTimes(0);
  });
});
