import { getPeaceWindowHandle, isPeaceRunning } from 'common/peaceIPC';
import { DefineStepFunction } from 'jest-cucumber';
import { Driver } from '__tests__/utils/webdriver';
import registry from '../../../main/registry';

export const givenPeaceIsInstalled = (given: DefineStepFunction) => {
  given('Peace is installed', async () => {
    if (!(await registry.isPeaceInstalled())) {
      console.log('Peace not installed');
    }
    // TODO we can check peace is installed. find a way to install peace
  });
};

export const givenPeaceIsRunning = (given: DefineStepFunction) => {
  given('Peace is running', () => {
    const peaceHWnd = getPeaceWindowHandle();
    const foundPeace = isPeaceRunning(peaceHWnd);
    if (foundPeace) {
      console.log('Peace not installed');
    }
    // TODO we can check peace is running. find a way to start it
  });
};

export const thenPeaceFrequencyGain = (
  then: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  then(
    /^Peace should show gain of (\d+)dB for frequency (\d+)Hz$/,
    async (gain: number, frequency: number) => {
      console.log(`gain: ${gain}`);
      console.log(`frequency: ${frequency}`);
      // TODO ask peace for gain of a specific frequency
      console.log(await webdriver.driver);
    }
  );
};
