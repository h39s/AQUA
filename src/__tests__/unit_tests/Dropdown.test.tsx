import '@testing-library/jest-dom';
import { act, screen } from '@testing-library/react';
import { setup } from '../utils/userEventUtils';
import Dropdown from '../../renderer/Dropdown';
import { FILTER_OPTIONS } from '../../renderer/icons/FilterTypeIcon';
import { FilterTypeEnum } from '../../common/constants';

describe('Dropdown', () => {
  const name = 'dropdown';
  const handleChange = jest.fn();

  beforeEach(() => {
    handleChange.mockClear();
  });

  it('should render the dropdown and click on an item', async () => {
    const { user } = setup(
      <Dropdown
        name={name}
        value={FilterTypeEnum.PEAK}
        options={FILTER_OPTIONS}
        isDisabled={false}
        handleChange={handleChange}
      />
    );

    const value = screen.getByTitle('Peak Filter');
    expect(value).toBeInTheDocument();
    const dropdown = screen.getByLabelText(name);
    await user.click(dropdown);
    expect(screen.getByLabelText(`${name}-items`)).toBeInTheDocument();

    const newValue = screen.getByLabelText('Notch Filter');
    expect(newValue).toBeInTheDocument();
    await user.click(newValue);
    expect(handleChange).toHaveBeenCalledWith(FilterTypeEnum.NO);
  });

  it('should render the dropdown and select an item using keys', async () => {
    const { user } = setup(
      <Dropdown
        name={name}
        value={FilterTypeEnum.LPQ}
        options={FILTER_OPTIONS}
        isDisabled={false}
        handleChange={handleChange}
      />
    );

    const dropdown = screen.getByLabelText(name);
    await user.click(dropdown);
    const item = screen.getByLabelText('Low Pass Filter');
    expect(item).toHaveFocus();

    await user.keyboard('{ArrowDown}{Enter}');
    expect(handleChange).toHaveBeenCalledWith(FilterTypeEnum.HPQ);
  });

  it('should disable the dropdown', async () => {
    const { user } = setup(
      <Dropdown
        name={name}
        value={FilterTypeEnum.LPQ}
        options={FILTER_OPTIONS}
        isDisabled
        handleChange={handleChange}
      />
    );

    const value = screen.getByTitle('Low Pass Filter');
    expect(value).toBeInTheDocument();
    const dropdown = screen.getByLabelText(name);
    await user.click(dropdown);
    expect(screen.queryByLabelText('Low Pass Filter')).not.toBeInTheDocument();
  });

  it('should close the dropdown when clicking outside', async () => {
    const { user } = setup(
      <div>
        <Dropdown
          name={name}
          value={FilterTypeEnum.PEAK}
          options={FILTER_OPTIONS}
          isDisabled={false}
          handleChange={handleChange}
        />
        <div>Outside</div>
      </div>
    );

    const dropdown = screen.getByLabelText(name);
    await user.click(dropdown);
    const item = screen.getByLabelText('Peak Filter');
    expect(item).toHaveFocus();

    await user.click(screen.getByText('Outside'));
    expect(item).not.toBeInTheDocument();
  });

  it('should close the dropdown when focus moves outside', async () => {
    const { user } = setup(
      <div>
        <Dropdown
          name={name}
          value={FilterTypeEnum.PEAK}
          options={FILTER_OPTIONS}
          isDisabled={false}
          handleChange={handleChange}
        />
        <button type="button">Outside</button>
      </div>
    );

    const dropdown = screen.getByLabelText(name);
    await user.click(dropdown);
    const item = screen.getByLabelText('Peak Filter');
    expect(item).toHaveFocus();

    // Need this because the focus triggers a state update and so we need to wait
    act(() => {
      screen.getByText('Outside').focus();
    });
    expect(item).not.toBeInTheDocument();
  });
});
