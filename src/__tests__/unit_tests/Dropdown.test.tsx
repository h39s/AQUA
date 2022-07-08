import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
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

  it('should render the dropdown', async () => {
    const { user } = setup(
      <Dropdown
        name={name}
        value={FilterTypeEnum.PEAK}
        options={FILTER_OPTIONS}
        handleChange={handleChange}
      />
    );

    const value = screen.getByTitle('Peak Filter');
    expect(value).toBeInTheDocument();
    const dropdown = screen.getByLabelText(name);
    await user.click(dropdown);
    expect(screen.getByLabelText(`${name}-items`)).toBeInTheDocument();

    const newValue = screen.getByTitle('Notch Filter');
    expect(newValue).toBeInTheDocument();
    await user.click(newValue);
    expect(handleChange).toHaveBeenCalledWith(FilterTypeEnum.NO);
  });
});
