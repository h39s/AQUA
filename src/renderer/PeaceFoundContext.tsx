import { createContext } from 'react';

export interface IPeaceFoundContext {
  wasPeaceFound: boolean;
  setWasPeaceFound: (newValue: boolean) => void;
}

const defaultPeaceFoundContext: IPeaceFoundContext = {
  wasPeaceFound: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setWasPeaceFound: (_newValue: boolean) => {},
};

export const PeaceFoundContext = createContext(defaultPeaceFoundContext);
