/*
<AQUA: System-wide parametric audio equalizer interface>
Copyright (C) <2023>  <AQUA Dev Team>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { FilterTypeEnum, getDefaultFilterWithId } from 'common/constants';
import FrequencyBand from 'renderer/components/FrequencyBand';
import { AquaProviderWrapper } from 'renderer/utils/AquaContext';
import defaultAquaContext from '__tests__/utils/mockAquaProvider';
import { setup } from '../utils/userEventUtils';

describe('FrequencyBand', () => {
  const filter = getDefaultFilterWithId();
  const filterTypeDropdownLabel = `${filter.frequency}-filter-type`;
  const filterGainNumberLabel = `${filter.frequency}-gain-number`;
  const filterGainRangeLabel = `${filter.frequency}-gain-range`;
  const trashIconLabel = 'Trash Icon';
  const handleSubmit = jest.fn();

  beforeEach(() => {
    handleSubmit.mockClear();
  });

  it('should render with name', () => {
    setup(
      <AquaProviderWrapper value={defaultAquaContext}>
        <FrequencyBand filter={filter} isMinSliderCount={false} />
      </AquaProviderWrapper>
    );
    expect(screen.getByLabelText(filterTypeDropdownLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(trashIconLabel)).not.toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('should disable gain when filter type is not affected by gain', () => {
    setup(
      <AquaProviderWrapper value={defaultAquaContext}>
        <FrequencyBand
          filter={{ ...filter, type: FilterTypeEnum.NO }}
          isMinSliderCount={false}
        />
        <FrequencyBand
          filter={{ ...filter, type: FilterTypeEnum.LPQ }}
          isMinSliderCount={false}
        />
        <FrequencyBand
          filter={{ ...filter, type: FilterTypeEnum.HPQ }}
          isMinSliderCount={false}
        />
        <FrequencyBand
          filter={{ ...filter, type: FilterTypeEnum.BP }}
          isMinSliderCount={false}
        />
      </AquaProviderWrapper>
    );
    const gainNumberInputs = screen.getAllByLabelText(filterGainNumberLabel);
    gainNumberInputs.forEach((input) => expect(input).toBeDisabled());
    const gainRangeInputs = screen.getAllByLabelText(filterGainRangeLabel);
    gainRangeInputs.forEach((input) => expect(input).toBeDisabled());
  });

  it('should prevent deleting when min slider count is met', () => {
    setup(
      <AquaProviderWrapper value={defaultAquaContext}>
        <FrequencyBand filter={filter} isMinSliderCount />
      </AquaProviderWrapper>
    );
    expect(screen.getByLabelText(trashIconLabel)).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });
});
