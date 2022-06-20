import { peaceGainOutputToDb } from 'common/peaceConversions';
import {
  getPeaceWindowHandle,
  isPeaceRunning,
  sendPeaceCommand,
} from 'common/peaceIPC';
import { DefineStepFunction } from 'jest-cucumber';
import { Driver } from '__tests__/utils/webdriver';
import registry from '../../../main/registry';

export const givenPeaceIsInstalled = (given: DefineStepFunction) => {
  given('Peace is installed', async () => {
    if (!(await registry.isPeaceInstalled())) {
      throw new Error('Peace not installed');
    }
    // TODO find a way to install peace
  });
};

export const givenPeaceIsRunning = (given: DefineStepFunction) => {
  given('Peace is running', async () => {
    // Need retries as this check can be flakey.
    for (let i = 0; i < 3; i += 1) {
      const peaceHWnd = getPeaceWindowHandle();
      const foundPeace = isPeaceRunning(peaceHWnd);
      if (foundPeace) {
        return;
      }
      // Wait 1s before trying again
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    throw new Error('Peace not running');
    // TODO find a way to start peace
  });
};

export const thenPeaceFrequencyGain = (
  then: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  then(
    /^Peace should show gain of (-?\d+)dB for frequency (\d+)Hz$/,
    async (gain: string, frequency: string) => {
      const sliderElems = await webdriver.driver
        .$('.mainContent')
        .$$('div*=Hz');
      for (let i = 0; i < sliderElems.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const text = await sliderElems[i].getText();
        if (text === `${frequency} Hz`) {
          // eslint-disable-next-line no-await-in-loop
          const peaceHWnd = getPeaceWindowHandle();
          if (!isPeaceRunning(peaceHWnd)) {
            throw new Error('Peace is not running.');
          }
          const peaceGain = sendPeaceCommand(peaceHWnd, 100 + i + 1, 5, 0);
          expect(peaceGainOutputToDb(peaceGain)).toBe(parseInt(gain, 10));
          return;
        }
      }
      throw new Error(`${frequency} Hz gain band not found.`);
    }
  );
};
