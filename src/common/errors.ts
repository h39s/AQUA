export enum ErrorCode {
  PEACE_UNKNOWN_ERROR = 0,
  PEACE_NOT_INSTALLED = 1,
  PEACE_NOT_RUNNING = 2,
  PEACE_NOT_READY = 3,
  PEACE_TIMEOUT = 4,
  NEGATIVE_FREQUENCY = 5,
  INVALID_PARAMETER = 6,
  CONFIG_NOT_FOUND = 7,
}

export type ErrorDescription = {
  shortError: string;
  action: string;
  code: ErrorCode;
};

export const errors: Record<ErrorCode, ErrorDescription> = {
  [ErrorCode.PEACE_UNKNOWN_ERROR]: {
    shortError: 'Unknown error occured with Peace.',
    action: 'Please restart PeaceGUI and try again.',
    code: ErrorCode.PEACE_UNKNOWN_ERROR,
  },
  [ErrorCode.PEACE_NOT_INSTALLED]: {
    shortError: 'Peace not installed.',
    action:
      'Please install PeaceGUI and launch Peace outside of the Peace Installation GUI before retrying.',
    code: ErrorCode.PEACE_NOT_INSTALLED,
  },
  [ErrorCode.PEACE_NOT_RUNNING]: {
    shortError: 'Peace not running.',
    action: 'Please launch PeaceGUI before retrying.',
    code: ErrorCode.PEACE_NOT_RUNNING,
  },
  [ErrorCode.PEACE_NOT_READY]: {
    shortError: 'Peace not ready yet.',
    action: 'Please launch PeaceGUI before retrying.',
    code: ErrorCode.PEACE_NOT_READY,
  },
  [ErrorCode.PEACE_TIMEOUT]: {
    shortError: 'Timeout waiting for a response.',
    action:
      'Please restart the application. If the error persists, try reaching out to the developers to resolve the issue.',
    code: ErrorCode.PEACE_TIMEOUT,
  },
  [ErrorCode.NEGATIVE_FREQUENCY]: {
    shortError: 'Invalid frequency - frequency is negative',
    action: '',
    code: ErrorCode.NEGATIVE_FREQUENCY,
  },
  [ErrorCode.INVALID_PARAMETER]: {
    shortError: 'Invalid parameter.',
    action: '',
    code: ErrorCode.NEGATIVE_FREQUENCY,
  },
  [ErrorCode.CONFIG_NOT_FOUND]: {
    shortError: 'Unable to locate the configuration file for EqualizerAPO.',
    action:
      'Please check whether the config.txt file exists in the config folder of EqualizerAPO.',
    code: ErrorCode.CONFIG_NOT_FOUND,
  },
};

export const getErrorDescription = (code: ErrorCode) => errors[code];
