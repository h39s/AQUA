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

/* eslint-disable import/first */

const mockClose = jest.fn();

import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { setup } from '__tests__/utils/userEventUtils';
import Modal from '../../renderer/widgets/Modal';

jest.mock('../../renderer/electron.ts', () => ({
  ipcRenderer: {
    on: jest.fn(),
    once: jest.fn(),
    send: jest.fn(),
    removeAllListeners: jest.fn(),
    closeApp: mockClose,
  },
}));

describe('Modal', () => {
  const headerText = 'Header';
  const bodyText = 'Body';
  const retryText = 'Close & Retry';
  const exitText = 'Exit';
  const onRetry = jest.fn();

  beforeEach(() => {
    mockClose.mockClear();
    onRetry.mockClear();
  });

  it('should render modal', async () => {
    setup(
      <Modal
        isLoading={false}
        headerText={headerText}
        bodyText={bodyText}
        onRetry={onRetry}
      />
    );

    expect(screen.getByText(headerText)).toBeInTheDocument();
    expect(screen.getByText(bodyText)).toBeInTheDocument();
  });

  it('should be disabled', async () => {
    setup(
      <Modal
        isLoading
        headerText={headerText}
        bodyText={bodyText}
        onRetry={onRetry}
      />
    );

    expect(screen.getByText(retryText)).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    expect(screen.getByText(exitText)).toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable retry and enable exit', async () => {
    setup(
      <Modal
        isLoading={false}
        isRetryDisabled
        headerText={headerText}
        bodyText={bodyText}
        onRetry={onRetry}
      />
    );

    expect(screen.getByText(retryText)).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    expect(screen.getByText(exitText)).not.toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('should retry when clicked', async () => {
    const { user } = setup(
      <Modal
        isLoading={false}
        headerText={headerText}
        bodyText={bodyText}
        onRetry={onRetry}
      />
    );

    const retryButton = screen.getByText(retryText);
    expect(retryButton).toBeInTheDocument();
    await user.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should close when clicked', async () => {
    const { user } = setup(
      <Modal
        isLoading={false}
        headerText={headerText}
        bodyText={bodyText}
        onRetry={onRetry}
      />
    );

    const exitButton = screen.getByText(exitText);
    expect(exitButton).toBeInTheDocument();
    await user.click(exitButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
