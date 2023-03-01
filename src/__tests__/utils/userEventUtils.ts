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
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Config,
  UserEvent,
} from '@testing-library/user-event/dist/types/setup';
import { typeOptions } from '@testing-library/user-event/dist/types/utility';

export const setup = (
  jsx: React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<unknown>
  >
) => {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
};

export const clearAndType = async (
  user: UserEvent,
  element: Element,
  text: string,
  options?: (Partial<Config> & typeOptions) | undefined
) => {
  await user.clear(element);
  return user.type(element, text, options);
};
