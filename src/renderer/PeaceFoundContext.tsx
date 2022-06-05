import { createContext } from 'react';
import { ErrorDescription } from '../common/errors';

export interface IPeaceFoundContext {
  peaceError: ErrorDescription | undefined;
  setPeaceError: (newValue?: ErrorDescription) => void;
}

const defaultPeaceFoundContext: IPeaceFoundContext = {
  peaceError: undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPeaceError: (_newValue?: ErrorDescription) => {},
};

export const PeaceFoundContext = createContext(defaultPeaceFoundContext);
