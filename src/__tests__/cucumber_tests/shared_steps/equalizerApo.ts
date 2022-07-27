import { DefineStepFunction } from 'jest-cucumber';
import { IState } from 'common/constants';
import { flush } from 'main/flush';
import { getConfigPath, isEqualizerAPOInstalled } from 'main/registry';

export const givenEqualizerApoIsInstalled = (given: DefineStepFunction) => {
  given('EqualizerAPO is installed', async () => {
    if (!(await isEqualizerAPOInstalled())) {
      throw new Error('EqualizerAPO not installed');
    }
    // TODO find a way to install EqualizerAPO
  });
};

export const givenCanWriteToAquaConfig = (given: DefineStepFunction) => {
  given('Aqua can write to Aqua config', async () => {
    const emptyState: IState = {
      isEnabled: false,
      isAutoPreampOn: false,
      preAmp: 0,
      filters: [],
    };
    const configDirPath = await getConfigPath();
    flush(emptyState, configDirPath);
  });
};
