const TIMEOUT = 1000;

interface TSuccess {
  result: number;
}

interface TError {
  error: string;
}

type TResult = TSuccess | TError;

const promisifyResult = <Type>(
  responseHandler: (
    arg: TResult,
    resolve: (value: Type | PromiseLike<Type>) => void,
    reject: (reason?: any) => void
  ) => void
) => {
  return new Promise<Type>((resolve, reject) => {
    let timer: NodeJS.Timeout;

    const handler = (arg: unknown) => {
      responseHandler(arg as TResult, resolve, reject);
      clearTimeout(timer);
    };

    window.electron.ipcRenderer.once('peace', handler);

    timer = setTimeout(() => {
      reject(new Error('Timeout waiting for a response'));
      window.electron.ipcRenderer.removeListener('peace', handler);
    }, TIMEOUT);
  });
};

/**
 * Get the current main preamplification gain value
 * @returns { Promise<number> } gain - current system gain value in the range [-30, 30]
 */
export const getMainPreAmp = (): Promise<number> => {
  window.electron.ipcRenderer.sendMessage('peace', [5, 5, 0]);

  const responseHandler = (
    arg: TResult,
    resolve: (value: number | PromiseLike<number>) => void,
    reject: (reason?: any) => void
  ) => {
    if ('error' in arg) {
      reject(new Error(arg.error));
    }
    const { result } = arg as TSuccess;
    const OVERFLOW_OFFSET = 4294967296;

    // If gain is larger than 30, assume overflow occured.
    // If adjusting overflow gives a positive value, default to -30
    if (result / 1000 > 30 && (result - OVERFLOW_OFFSET) / 1000 > 0) {
      console.log('erroneous gain, default to -30');
      resolve(-30);
      return;
    }

    const gain =
      result / 1000 > 30 ? (result - OVERFLOW_OFFSET) / 1000 : result / 1000;

    // Round up any lower gain values up to -30
    resolve(Math.max(gain, -30));
  };
  return promisifyResult(responseHandler);
};

/**
 * Adjusts the main preamplification gain value
 * @param {number} gain - new gain value in [-30, 30]
 */
export const setMainPreAmp = (gain: number) => {
  if (gain > 30 || gain < -30) {
    throw new Error('Invalid gain value - outside of range [-30, 30]');
  }
  window.electron.ipcRenderer.sendMessage('peace', [5, 1, gain * 1000]);

  const responseHandler = (
    arg: TResult,
    resolve: (value: number | PromiseLike<number>) => void,
    reject: (reason?: any) => void
  ) => {
    if ('error' in arg) {
      reject(new Error(arg.error));
    }

    const { result } = arg as TSuccess;
    resolve(result);
  };
  return promisifyResult(responseHandler);
};
