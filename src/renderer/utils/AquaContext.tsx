import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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
import { getEqualizerState } from './equalizerApi';

export enum FilterActionEnum {
  FREQUENCY,
  GAIN,
  QUALITY,
  TYPE,
  INIT,
}

type NumericalFilterAction =
  | FilterActionEnum.FREQUENCY
  | FilterActionEnum.GAIN
  | FilterActionEnum.QUALITY;

export type FilterAction =
  | { type: NumericalFilterAction; index: number; newValue: number }
  | { type: FilterActionEnum.TYPE; index: number; newValue: FilterTypeEnum }
  | { type: FilterActionEnum.INIT; filters: IFilter[] };

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

const AquaContext = createContext<IAquaContext | undefined>(undefined);

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
    case FilterActionEnum.INIT:
      return action.filters;
    default:
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
  const [preAmp, setPreAmp] = useState<number>(DEFAULT_STATE.preAmp);
  const [filters, dispatchFilter] = useReducer<IFilterReducer>(
    filterReducer,
    DEFAULT_STATE.filters
  );

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const state = await getEqualizerState();
        setIsEnabled(state.isEnabled);
        setPreAmp(state.preAmp);
        dispatchFilter({ type: FilterActionEnum.INIT, filters: state.filters });
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    };
    fetchResults();
  }, []);

  return (
    <AquaProviderWrapper
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
