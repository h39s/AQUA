import { DefineStepFunction } from 'jest-cucumber';
import { getDefaultFilterWithId, IState } from 'common/constants';
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
      isAutoPreAmpOn: false,
      isGraphViewOn: false,
      preAmp: 0,
      filters: { unique_id: getDefaultFilterWithId() },
    };
    const configDirPath = await getConfigPath();
    flush(emptyState, configDirPath);
  });
};
