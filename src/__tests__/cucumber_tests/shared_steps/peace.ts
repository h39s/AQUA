import { getPeaceWindowHandle, isPeaceRunning } from 'common/peaceIPC';
import { DefineStepFunction } from 'jest-cucumber';
// import registry from '../../../main/registry';

export const givenPeaceIsInstalled = (given: DefineStepFunction) => {
  given('Peace is installed', async () => {
    // if (!(await registry.isPeaceInstalled())) {
    //   throw new Error('Peace not installed');
    // }
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
      // Wait 500 ms before trying again
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error('Peace not running');
    // TODO find a way to start peace
  });
};

export const thenPeaceFrequencyGain = (then: DefineStepFunction) => {
  then(
    /^Peace should show gain of (\d+)dB for frequency (\d+)Hz$/,
    async (gain: number, frequency: number) => {
      console.log(`gain: ${gain}`);
      console.log(`frequency: ${frequency}`);
      // TODO ask peace for gain of a specific frequency
    }
  );
};
