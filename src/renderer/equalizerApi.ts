const TIMEOUT = 10000;

/**
 * Get the current main preamplification gain value
 * @returns { Promise<number> } gain - current system gain value in the range [-30, 30]
 */
export const getMainPreAmp = (): Promise<number> => {
  window.electron.ipcRenderer.sendMessage('peace', [5, 5, 0]);

  return new Promise((resolve, reject) => {
    // let timer: any;

    const responseHandler = (arg: unknown) => {
      const result = arg as number;
      const OVERFLOW_OFFSET = 4294967296;

      // If gain is larger than 30, assume overflow occured.
      // If adjusting overflow gives a positive value, default to -30
      if (result / 1000 > 30 && (result - OVERFLOW_OFFSET) / 1000 > 0) {
        console.log('erroneous gain, default to -30');
        resolve(-30);
      }
      const gain =
        result / 1000 > 30 ? (result - OVERFLOW_OFFSET) / 1000 : result / 1000;

      // Round up any lower gain values up to -30
      resolve(Math.max(gain, -30));
      // clearTimeout(timer);
    };

    window.electron.ipcRenderer.once('peace', responseHandler);

    // timer =
    setTimeout(() => {
      reject(new Error('Timeout waiting for a response'));
      window.electron.ipcRenderer.removeListener('peace', responseHandler);
    }, TIMEOUT);
  });
};

/**
 * Adjusts the main preamplification gain value
 * @param {number} gain - new gain value in ms
 */
export const setMainPreAmp = (gain: number) => {
  window.electron.ipcRenderer.sendMessage('peace', [5, 1, gain * 1000]);
};
