import '@testing-library/jest-dom';
import { act, screen } from '@testing-library/react';
import { setup } from '../utils/userEventUtils';
import Dropdown from '../../renderer/widgets/Dropdown';
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
        value={FilterTypeEnum.PK}
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

  it('should render the dropdown and select an item using tab', async () => {
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

    await user.keyboard('{Tab}{Enter}');
    expect(handleChange).toHaveBeenCalledWith(FilterTypeEnum.HPQ);
  });

  it('should prevent using arrow keys to leave the dropdown menu', async () => {
    const { user } = setup(
      <div>
        <button type="button">Above</button>
        <Dropdown
          name={name}
          value={FILTER_OPTIONS[0].value}
          options={FILTER_OPTIONS}
          isDisabled={false}
          handleChange={handleChange}
        />
        <button type="button">Below</button>
      </div>
    );
    // Open the dropdown menu
    const dropdown = screen.getByLabelText(name);
    await user.click(dropdown);
    const firstItem = screen.getByLabelText(FILTER_OPTIONS[0].label);
    expect(firstItem).toHaveFocus();

    // Use tab to navigate above the dropdown menu
    await user.keyboard('{Shift>}{ArrowUp}{ArrowUp}{/Shift}'); // Hold Shift down when pressing Tab
    expect(firstItem).toHaveFocus();

    // Use tab to navigate below the dropdown menu
    const tabInstructions = Array(FILTER_OPTIONS.length)
      .fill('{ArrowDown}')
      .join('');
    await user.keyboard(tabInstructions);
    const lastItem = screen.getByLabelText(
      FILTER_OPTIONS[FILTER_OPTIONS.length - 1].label
    );
    expect(lastItem).toHaveFocus();
  });

  it('should allow using tab to leave the dropdown menu', async () => {
    const { user } = setup(
      <div>
        <button type="button">Above</button>
        <Dropdown
          name={name}
          value={FILTER_OPTIONS[0].value}
          options={FILTER_OPTIONS}
          isDisabled={false}
          handleChange={handleChange}
        />
        <button type="button">Below</button>
      </div>
    );
    // Open the dropdown menu
    const dropdown = screen.getByLabelText(name);
    await user.click(dropdown);
    let menuItem = screen.getByLabelText(FILTER_OPTIONS[0].label);
    expect(menuItem).toHaveFocus();
    // Use tab to navigate above the dropdown menu
    await user.keyboard('{Shift>}{Tab}{Tab}{/Shift}'); // Hold Shift down when pressing Tab
    expect(screen.getByText('Above')).toHaveFocus();
    expect(menuItem).not.toBeInTheDocument();

    // Open the dropdown menu
    await user.click(dropdown);
    menuItem = screen.getByLabelText(FILTER_OPTIONS[0].label);
    expect(menuItem).toHaveFocus();
    // Use tab to navigate below the dropdown menu
    const tabInstructions = Array(FILTER_OPTIONS.length).fill('{Tab}').join('');
    await user.keyboard(tabInstructions);
    expect(screen.getByText('Below')).toHaveFocus();
    expect(menuItem).not.toBeInTheDocument();
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
          value={FilterTypeEnum.PK}
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
          value={FilterTypeEnum.PK}
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
