import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {
  DEFAULT_FILTER,
  DEFAULT_STATE,
  FilterTypeEnum,
  IFilter,
  IState,
} from '../../common/constants';
import { ErrorDescription } from '../../common/errors';
import { getEqualizerState } from './equalizerApi';

export enum FilterActionEnum {
  INIT,
  FREQUENCY,
  GAIN,
  QUALITY,
  TYPE,
  ADD,
  REMOVE,
}

type NumericalFilterAction =
  | FilterActionEnum.FREQUENCY
  | FilterActionEnum.GAIN
  | FilterActionEnum.QUALITY;

export type FilterAction =
  | { type: FilterActionEnum.INIT; filters: IFilter[] }
  | { type: NumericalFilterAction; index: number; newValue: number }
  | { type: FilterActionEnum.TYPE; index: number; newValue: FilterTypeEnum }
  | { type: FilterActionEnum.ADD }
  | { type: FilterActionEnum.REMOVE; index: number };

type FilterDispatch = (action: FilterAction) => void;

export interface IAquaContext extends IState {
  isLoading: boolean;
  globalError: ErrorDescription | undefined;
  performHealthCheck: () => void;
  setGlobalError: (newValue?: ErrorDescription) => void;
  setIsEnabled: (newValue: boolean) => void;
  setAutoPreampOn: (newValue: boolean) => void;
  setPreAmp: (newValue: number) => void;
  dispatchFilter: FilterDispatch;
}

const AquaContext = createContext<IAquaContext | undefined>(undefined);

type IFilterReducer = (filters: IFilter[], action: FilterAction) => IFilter[];

const filterReducer: IFilterReducer = (
  filters: IFilter[],
  action: FilterAction
) => {
  switch (action.type) {
    case FilterActionEnum.INIT:
      return action.filters;
    case FilterActionEnum.FREQUENCY:
      return filters.map((f, index) =>
        index === action.index ? { ...f, frequency: action.newValue } : f
      );
    case FilterActionEnum.GAIN:
      return filters.map((f, index) =>
        index === action.index ? { ...f, gain: action.newValue } : f
      );
    case FilterActionEnum.QUALITY:
      return filters.map((f, index) =>
        index === action.index ? { ...f, quality: action.newValue } : f
      );
    case FilterActionEnum.TYPE:
      return filters.map((f, index) =>
        index === action.index ? { ...f, type: action.newValue } : f
      );
    case FilterActionEnum.ADD:
      return [...filters, { ...DEFAULT_FILTER }];
    case FilterActionEnum.REMOVE:
      return filters.filter((_, index) => index !== action.index);
    default:
      // This throw does not actually do anything because
      // we are in a reducer
      throw new Error('Unhandled action type should not occur');
  }
};

export interface IAquaProviderWrapperProps {
  value: IAquaContext;
  children: ReactNode;
}

interface IAquaProviderProps {
  children: ReactNode;
}

export const AquaProviderWrapper = ({
  value,
  children,
}: IAquaProviderWrapperProps) => {
  return <AquaContext.Provider value={value}>{children}</AquaContext.Provider>;
};

export const AquaProvider = ({ children }: IAquaProviderProps) => {
  const [globalError, setGlobalError] = useState<
    ErrorDescription | undefined
  >();
  const [isEnabled, setIsEnabled] = useState<boolean>(DEFAULT_STATE.isEnabled);
  const [isAutoPreampOn, setAutoPreampOn] = useState<boolean>(
    DEFAULT_STATE.isAutoPreampOn
  );
  const [preAmp, setPreAmp] = useState<number>(DEFAULT_STATE.preAmp);
  const [filters, dispatchFilter] = useReducer<IFilterReducer>(
    filterReducer,
    DEFAULT_STATE.filters
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const performHealthCheck = useCallback(async () => {
    setIsLoading(true);
    try {
      const state = await getEqualizerState();
      setIsEnabled(state.isEnabled);
      setAutoPreampOn(state.isAutoPreampOn);
      setPreAmp(state.preAmp);
      dispatchFilter({ type: FilterActionEnum.INIT, filters: state.filters });
      setGlobalError(undefined);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    performHealthCheck();
  }, [performHealthCheck]);

  return (
    <AquaProviderWrapper
      value={{
        isLoading,
        globalError,
        isEnabled,
        isAutoPreampOn,
        preAmp,
        filters,
        performHealthCheck,
        setGlobalError,
        setIsEnabled,
        setAutoPreampOn,
        setPreAmp,
        dispatchFilter,
      }}
    >
      {children}
    </AquaProviderWrapper>
  );
};

export const useAquaContext = () => {
  const context = useContext(AquaContext);
  if (context === undefined) {
    throw new Error('useAquaContext must be used within an AquaProvider');
  }
  return context;
};
