import ChannelEnum from 'common/channels';
import {
  ErrorCode,
  ErrorDescription,
  getErrorDescription,
} from 'common/errors';
import {
  FilterTypeEnum,
  MAX_FREQUENCY,
  MAX_GAIN,
  MAX_QUALITY,
  MIN_FREQUENCY,
  MIN_GAIN,
  MIN_QUALITY,
} from 'common/constants';

const TIMEOUT = 10000;

export interface TSuccess {
  result: number | string;
}

export interface TError {
  errorCode: ErrorCode;
}

type TResult = TSuccess | TError;

const promisifyResult = <Type>(
  responseHandler: (
    arg: TResult,
    resolve: (value: Type | PromiseLike<Type>) => void,
    reject: (reason?: ErrorDescription) => void
  ) => void,
  channel: string
) => {
  return new Promise<Type>((resolve, reject) => {
    let timer: NodeJS.Timeout;

    const handler = (arg: unknown) => {
      responseHandler(arg as TResult, resolve, reject);
      clearTimeout(timer);
    };

    window.electron.ipcRenderer.once(channel, handler);

    timer = setTimeout(() => {
      reject(getErrorDescription(ErrorCode.TIMEOUT));
      window.electron.ipcRenderer.removeListener(channel, handler);
    }, TIMEOUT);
  });
};

const buildResponseHandler = <Type extends string | number | boolean | void>(
  resultEvaluator: (
    result: Type,
    resolve: (value: Type | PromiseLike<Type>) => void,
    reject: (reason?: ErrorDescription) => void
  ) => void
) => {
  return (
    arg: TResult,
    resolve: (value: Type | PromiseLike<Type>) => void,
    reject: (reason?: ErrorDescription) => void
  ) => {
    if ('errorCode' in arg) {
      reject(getErrorDescription(arg.errorCode));
      return;
    }
    const { result } = arg as TSuccess;
    resultEvaluator(result as Type, resolve, reject);
  };
};

const simpleResponseHandler = buildResponseHandler<number>(
  (result, resolve) => {
    resolve(result);
  }
);

const setterResponseHandler = buildResponseHandler<void>((_result, resolve) =>
  resolve()
);

/**
 * Perform a health check to verify whether EqualizerAPO is installed
 * @returns { Promise<void> } exception if EqualizerAPO is not okay.
 */
export const healthCheck = (): Promise<void> => {
  const channel = ChannelEnum.HEALTH_CHECK;
  window.electron.ipcRenderer.sendMessage(channel, []);
  return promisifyResult(setterResponseHandler, channel);
};

/**
 * Enable Equalizer
 * @returns { Promise<void> } exception if failed.
 */
export const enableEqualizer = (): Promise<void> => {
  const channel = ChannelEnum.SET_ENABLE;
  window.electron.ipcRenderer.sendMessage(channel, [1]);
  return promisifyResult(setterResponseHandler, channel);
};

/**
 * Disable Equalizer
 * @returns { Promise<void> } exception if failed.
 */
export const disableEqualizer = (): Promise<void> => {
  const channel = ChannelEnum.SET_ENABLE;
  window.electron.ipcRenderer.sendMessage(channel, [0]);
  return promisifyResult(setterResponseHandler, channel);
};

/**
 * Get the current equalizer status
 * @returns { Promise<boolean> } true for on, false for off, exception otherwise
 */
export const getEqualizerStatus = (): Promise<boolean> => {
  const channel = ChannelEnum.GET_ENABLE;
  window.electron.ipcRenderer.sendMessage(channel, []);

  const responseHandler = buildResponseHandler<boolean>((result, resolve) =>
    resolve(result)
  );
  return promisifyResult(responseHandler, channel);
};

/**
 * Get the current main preamplification gain value
 * @returns { Promise<number> } gain - current system gain value in the range [-30, 30]
 */
export const getMainPreAmp = (): Promise<number> => {
  const channel = ChannelEnum.GET_PREAMP;
  window.electron.ipcRenderer.sendMessage(channel, []);
  return promisifyResult(simpleResponseHandler, channel);
};

/**
 * Adjusts the main preamplification gain value
 * @param {number} gain - new gain value in [-30, 30]
 */
export const setMainPreAmp = (gain: number) => {
  const channel = ChannelEnum.SET_PREAMP;
  if (gain > MAX_GAIN || gain < MIN_GAIN) {
    throw new Error(
      `Invalid gain value - outside of range [${MIN_GAIN}, ${MAX_GAIN}]`
    );
  }
  window.electron.ipcRenderer.sendMessage(channel, [gain]);
  return promisifyResult(setterResponseHandler, channel);
};

/**
 * Get the a slider's gain value
 * @param {number} index - index of the slider being adjusted
 * @returns { Promise<number> } gain - current system gain value in the range [-30, 30]
 */
export const getGain = (index: number): Promise<number> => {
  const channel = ChannelEnum.GET_FILTER_GAIN;
  window.electron.ipcRenderer.sendMessage(channel, [index]);
  return promisifyResult(simpleResponseHandler, channel + index);
};

/**
 * Adjusts a slider's gain value
 * @param {number} index - index of the slider being adjusted
 * @param {number} gain - new gain value in [-30, 30]
 */
export const setGain = (index: number, gain: number) => {
  const channel = ChannelEnum.SET_FILTER_GAIN;
  if (gain > MAX_GAIN || gain < MIN_GAIN) {
    throw new Error(
      `Invalid gain value - outside of range [${MIN_GAIN}, ${MAX_GAIN}]`
    );
  }
  window.electron.ipcRenderer.sendMessage(channel, [index, gain]);
  return promisifyResult(setterResponseHandler, channel + index);
};

/**
 * Get a slider's frequency
 * @param {number} index - index of the slider being adjusted
 * @returns { Promise<number> } frequency - frequency value in the range [0, 20000]
 */
export const getFrequency = (index: number): Promise<number> => {
  const channel = ChannelEnum.GET_FILTER_FREQUENCY;
  window.electron.ipcRenderer.sendMessage(channel, [index]);
  return promisifyResult(simpleResponseHandler, channel + index);
};

/**
 * Adjusts a slider's frequency
 * @param {number} index - index of the slider being adjusted
 * @param {frequency} frequency - new frequency value in [0, 20000]
 */
export const setFrequency = (index: number, frequency: number) => {
  const channel = ChannelEnum.SET_FILTER_FREQUENCY;
  if (frequency <= MIN_FREQUENCY || frequency > MAX_FREQUENCY) {
    throw new Error(
      `Invalid gain value - outside of range (${MIN_FREQUENCY}, ${MAX_FREQUENCY}]`
    );
  }
  window.electron.ipcRenderer.sendMessage(channel, [index, frequency]);
  return promisifyResult(setterResponseHandler, channel + index);
};

/**
 * Get a slider's quality
 * @param {number} index - index of the slider being adjusted
 * @returns { Promise<number> } quality - value in the range [0.001, 999.999]
 */
export const getQuality = (index: number): Promise<number> => {
  const channel = ChannelEnum.GET_FILTER_QUALITY;
  window.electron.ipcRenderer.sendMessage(channel, [index]);
  return promisifyResult(simpleResponseHandler, channel + index);
};

/**
 * Adjusts a slider's quality
 * @param {number} index - index of the slider being adjusted
 * @param {number} quality - new quality value in [0.001, 999.999]
 */
export const setQuality = (index: number, quality: number) => {
  const channel = ChannelEnum.SET_FILTER_QUALITY;
  if (quality < MIN_QUALITY || quality > MAX_QUALITY) {
    throw new Error(
      `Invalid quality value - outside of range [${MIN_QUALITY}, ${MAX_QUALITY}]`
    );
  }
  window.electron.ipcRenderer.sendMessage(channel, [index, quality]);
  return promisifyResult(setterResponseHandler, channel + index);
};

/**
 * Get a slider's quality
 * @param {number} index - index of the slider being adjusted
 * @returns { Promise<FilterTypeEnum> } filter type - value in FilterTypeEnum
 */
export const getType = (index: number): Promise<FilterTypeEnum> => {
  const channel = ChannelEnum.GET_FILTER_TYPE;
  window.electron.ipcRenderer.sendMessage(channel, [index]);
  return promisifyResult<FilterTypeEnum>(
    buildResponseHandler<FilterTypeEnum>((result, resolve) => {
      resolve(result);
    }),
    channel + index
  );
};

/**
 * Adjusts a slider's quality
 * @param {number} index - index of the slider being adjusted
 * @param {string} filterType - new filter type
 */
export const setType = (index: number, filterType: string) => {
  const channel = ChannelEnum.SET_FILTER_TYPE;
  window.electron.ipcRenderer.sendMessage(channel, [index, filterType]);
  return promisifyResult(setterResponseHandler, channel + index);
};

/**
 * Get number of equalizer bands
 * @returns { Promise<number> } exception if failed
 */
export const getEqualizerSliderCount = (): Promise<number> => {
  const channel = ChannelEnum.GET_FILTER_COUNT;
  window.electron.ipcRenderer.sendMessage(channel, []);
  return promisifyResult(simpleResponseHandler, channel);
};

/**
 * Add another slider
 * @returns { Promise<void> } exception if failed
 */
export const addEqualizerSlider = (): Promise<void> => {
  const channel = ChannelEnum.ADD_FILTER;
  window.electron.ipcRenderer.sendMessage(channel, []);
  return promisifyResult(setterResponseHandler, channel);
};

/**
 * Remove rightmost slider
 * @returns { Promise<void> } exception if failed
 */
export const removeEqualizerSlider = (index: number): Promise<void> => {
  const channel = ChannelEnum.REMOVE_FILTER;
  window.electron.ipcRenderer.sendMessage(channel, [index]);
  return promisifyResult(setterResponseHandler, channel);
};
