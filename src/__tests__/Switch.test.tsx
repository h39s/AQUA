import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Switch from '../renderer/Switch';

describe('Switch', () => {
  const id = 'switch';
  const onLoad = jest.fn();
  const handleToggle = jest.fn();

  beforeEach(() => {
    onLoad.mockClear();
    handleToggle.mockClear();
  });

  it('should render the on state', () => {
    render(
      <Switch
        id={id}
        isOn={false}
        onLoad={onLoad}
        handleToggle={handleToggle}
      />
    );
    expect(onLoad).toHaveBeenCalledTimes(1);

    const input = screen.getByRole('checkbox');
    expect(input).not.toBeChecked();
  });

  it('should render the off state', () => {
    render(<Switch id={id} isOn onLoad={onLoad} handleToggle={handleToggle} />);
    expect(onLoad).toHaveBeenCalledTimes(1);

    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();
  });

  it('should be able to trigger the toggle handler', () => {
    render(<Switch id={id} isOn onLoad={onLoad} handleToggle={handleToggle} />);
    expect(onLoad).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleToggle).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: id }));
    expect(handleToggle).toHaveBeenCalledTimes(2);
  });
});