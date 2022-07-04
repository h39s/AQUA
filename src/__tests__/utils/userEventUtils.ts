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
