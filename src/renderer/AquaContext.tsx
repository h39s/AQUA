import { createContext } from 'react';
import { ErrorDescription } from '../common/errors';

export interface IAquaContext {
  globalError: ErrorDescription | undefined;
  setGlobalError: (newValue?: ErrorDescription) => void;
}

const defaultAquaContext: IAquaContext = {
  globalError: undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setGlobalError: (_newValue?: ErrorDescription) => {},
};

export const AquaContext = createContext(defaultAquaContext);
