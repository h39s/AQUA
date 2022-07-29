/* eslint-disable @typescript-eslint/no-unused-vars */
import { DEFAULT_STATE } from 'common/constants';
import { ErrorDescription } from 'common/errors';
import { FilterAction, IAquaContext } from 'renderer/utils/AquaContext';

const defaultAquaContext: IAquaContext = {
  isLoading: false,
  globalError: undefined,
  isEnabled: DEFAULT_STATE.isEnabled,
  isAutoPreAmpOn: DEFAULT_STATE.isAutoPreAmpOn,
  preAmp: DEFAULT_STATE.preAmp,
  filters: DEFAULT_STATE.filters,
  performHealthCheck: () => {},
  setGlobalError: (_newValue?: ErrorDescription) => {},
  setIsEnabled: (_newValue: boolean) => {},
  setAutoPreAmpOn: (_newValue: boolean) => {},
  setPreAmp: (_newValue: number) => {},
  dispatchFilter: (_action: FilterAction) => {},
};

export default defaultAquaContext;
