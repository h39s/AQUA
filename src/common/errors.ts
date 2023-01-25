export enum ErrorCode {
  EQUALIZER_APO_NOT_INSTALLED,
  CONFIG_NOT_FOUND,
  TIMEOUT,
  INVALID_PARAMETER,
  FAILURE,
  PRESET_FILE_ERROR,
}

export type ErrorDescription = {
  shortError: string;
  action: string;
  code: ErrorCode;
};

export const errors: Record<ErrorCode, ErrorDescription> = {
  [ErrorCode.EQUALIZER_APO_NOT_INSTALLED]: {
    shortError: 'Equalizer APO is not installed.',
    action: 'Please install Equalizer APO before retrying.',
    code: ErrorCode.EQUALIZER_APO_NOT_INSTALLED,
  },
  [ErrorCode.CONFIG_NOT_FOUND]: {
    shortError: 'Unable to locate the configuration file for EqualizerAPO.',
    action:
      'Please check whether the config.txt file exists in the config folder of EqualizerAPO.',
    code: ErrorCode.CONFIG_NOT_FOUND,
  },
  [ErrorCode.TIMEOUT]: {
    shortError: 'Timeout waiting for a response.',
    action:
      'Please restart the application. If the error persists, try reaching out to the developers to resolve the issue.',
    code: ErrorCode.TIMEOUT,
  },
  [ErrorCode.INVALID_PARAMETER]: {
    shortError: 'Internal Error: Invalid parameter.',
    action: 'Please reach out to the developers to resolve the issue.',
    code: ErrorCode.INVALID_PARAMETER,
  },
  [ErrorCode.FAILURE]: {
    shortError: 'Internal Error: Failed to apply equalizer settings.',
    action:
      'Please restart the application. If the error persists, try reaching out to the developers to resolve the issue.',
    code: ErrorCode.FAILURE,
  },
  [ErrorCode.PRESET_FILE_ERROR]: {
    shortError: 'Internal Error: Failed to read or modify preset files.',
    action:
      'Please check that the preset name is saveable as a file and that the installation directory is in a writeable place. In addition, check that you have available storage space. If the error persists, try reaching out to the developers to resolve the issue.',
    code: ErrorCode.PRESET_FILE_ERROR,
  },
};

export const getErrorDescription = (code: ErrorCode) => errors[code];
