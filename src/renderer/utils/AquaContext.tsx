/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useState,
} from 'react';
import {
  DEFAULT_STATE,
  FilterTypeEnum,
  IFilter,
  IState,
} from '../../common/constants';
import { ErrorDescription } from '../../common/errors';

export enum FilterActionEnum {
  FREQUENCY,
  GAIN,
  QUALITY,
  TYPE,
}

type NumericalFilterAction =
  | FilterActionEnum.FREQUENCY
  | FilterActionEnum.GAIN
  | FilterActionEnum.QUALITY;

type FilterAction =
  | { type: NumericalFilterAction; index: number; newValue: number }
  | { type: FilterActionEnum.TYPE; index: number; newValue: FilterTypeEnum };

type FilterDispatch = (action: FilterAction) => void;

export interface IAquaContext extends IState {
  globalError: ErrorDescription | undefined;
  setGlobalError: (newValue?: ErrorDescription) => void;
  setIsEnabled: (newValue: boolean) => void;
  setPreAmp: (newValue: number) => void;
  dispatchFilter: FilterDispatch;
  // setFilterFrequency: (index: number, newFrequency: number) => void;
  // setFilterGain: (index: number, newGain: number) => void;
  // setFilterQuality: (index: number, newQuality: number) => void;
  // setFilterType: (index: number, newType: FilterTypeEnum) => void;
}

// const defaultAquaContext: IAquaContext = {
//   globalError: undefined,
//   isEnabled: DEFAULT_STATE.isEnabled,
//   preAmp: DEFAULT_STATE.preAmp,
//   filters: DEFAULT_STATE.filters,
//   setGlobalError: (_newValue?: ErrorDescription) => {},
//   setIsEnabled: (_newValue: boolean) => {},
//   setPreAmp: (_newValue: number) => {},
//   dispatch: ,
//   // setFilterFrequency: (_index: number, _newFrequency: number) => {},
//   // setFilterGain: (_index: number, _newGain: number) => {},
//   // setFilterQuality: (_index: number, _newQuality: number) => {},
//   // setFilterType: (_index: number, _newType: FilterTypeEnum) => {},
// };

const AquaContext = createContext<IAquaContext | undefined>(undefined);

interface IAquaProviderProps {
  children: ReactNode;
}

type IFilterReducer = (filters: IFilter[], action: FilterAction) => IFilter[];

const filterReducer: IFilterReducer = (
  filters: IFilter[],
  action: FilterAction
) => {
  switch (action.type) {
    case FilterActionEnum.FREQUENCY:
      return filters.map((f, index) =>
        index === action.index ? { ...f, frequency: action.newValue } : f
      );
    case FilterActionEnum.GAIN:
      return filters.map((f, index) =>
        index === action.index ? { ...f, frequency: action.newValue } : f
      );
    case FilterActionEnum.QUALITY:
      return filters.map((f, index) =>
        index === action.index ? { ...f, quality: action.newValue } : f
      );
    case FilterActionEnum.TYPE:
      return filters.map((f, index) =>
        index === action.index ? { ...f, type: action.newValue } : f
      );
    default:
      throw new Error('Unhandled action type should not occur');
  }
};

export const AquaProvider = ({ children }: IAquaProviderProps) => {
  const [globalError, setGlobalError] = useState<
    ErrorDescription | undefined
  >();
  const [isEnabled, setIsEnabled] = useState<boolean>(DEFAULT_STATE.isEnabled);
  const [preAmp, setPreAmp] = useState<number>(DEFAULT_STATE.preAmp);
  const [filters, dispatchFilter] = useReducer<IFilterReducer>(
    filterReducer,
    DEFAULT_STATE.filters
  );

  return (
    <AquaContext.Provider
      value={{
        globalError,
        isEnabled,
        preAmp,
        filters,
        setGlobalError,
        setIsEnabled,
        setPreAmp,
        dispatchFilter,
        // setFilterFrequency,
        // setFilterGain,
        // setFilterQuality,
        // setFilterType,
      }}
    >
      {children}
    </AquaContext.Provider>
  );
};

export const useAquaContext = () => {
  const context = useContext(AquaContext);
  if (context === undefined) {
    throw new Error('useAquaContext must be used within an AquaProvider');
  }
  return context;
};
