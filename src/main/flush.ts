import fs from 'fs';
import path from 'path';
import { FilterTypeEnum } from '../common/constants';

interface IFilter {
  frequency: number;
  gain: number;
  type: FilterTypeEnum;
  quality: number;
}

export interface IState {
  isEnabled: boolean;
  preAmp: number;
  filters: IFilter[];
}

const FIXED_FREQUENCIES = [
  32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000,
];

export const DEFAULT_FILTER: IFilter = {
  frequency: 1000,
  gain: 0,
  quality: 1,
  type: FilterTypeEnum.PEAK,
};

const DEFAULT_FILTERS: IFilter[] = FIXED_FREQUENCIES.map((f) => {
  return {
    frequency: f,
    gain: 0,
    quality: 1,
    type: FilterTypeEnum.PEAK,
  };
});

const DEFAULT_STATE: IState = {
  isEnabled: true,
  preAmp: 0,
  filters: DEFAULT_FILTERS,
};

export const stateToString = (state: IState) => {
  if (!state.isEnabled) {
    return '';
  }

  let output: string[] = [];

  output.push('Device: all');
  output.push('Channel: all');
  output.push(`Preamp: ${state.preAmp}dB`);

  // Using individual filter bands
  output = output.concat(
    state.filters.flatMap(
      ({ frequency, gain, type, quality }, index) =>
        `Filter${index}: ON ${type} Fc ${frequency} Hz Gain ${gain} dB Q ${quality}`
    )
  );

  // TODO: Figure out when to use GraphicEQ
  // `${Frequency} ${Gain};`

  return output.join('\n\r');
};

export const serializeState = (state: IState) => {
  return JSON.stringify(state);
};

const CONFIG_CONTENT = 'Include: aqua.txt';
export const AQUA_LOCAL_CONFIG_FILENAME = 'state.txt';
export const AQUA_CONFIG_FILENAME = 'aqua.txt';
const CONFIG_FILENAME = 'config.txt';

const addFileToPath = (pathPrefix: string, fileName: string) => {
  return path.join(pathPrefix, fileName);
};

export const fetchSettings = () => {
  try {
    const content = fs.readFileSync(AQUA_LOCAL_CONFIG_FILENAME, {
      encoding: 'utf8',
    });
    return JSON.parse(content) as IState;
  } catch (ex) {
    // if unable to fetch the state, use a default one
    return DEFAULT_STATE;
  }
};

export const save = (state: IState) => {
  try {
    fs.writeFileSync(AQUA_LOCAL_CONFIG_FILENAME, serializeState(state), {
      encoding: 'utf8',
    });
  } catch (ex) {
    console.log('Failed to save to %d', AQUA_LOCAL_CONFIG_FILENAME);
    throw ex;
  }
};

export const flush = (state: IState, configDirPath: string) => {
  const configPath = addFileToPath(configDirPath, AQUA_CONFIG_FILENAME);
  try {
    fs.writeFileSync(configPath, stateToString(state), {
      encoding: 'utf8',
    });
  } catch (ex) {
    console.log(`Failed to flush to ${configPath}`);
  }
};

export const checkConfigFile = (configDirPath: string) => {
  const configPath = addFileToPath(configDirPath, CONFIG_FILENAME);
  try {
    const content = fs.readFileSync(configPath, {
      encoding: 'utf8',
    });
    return content.search(CONFIG_CONTENT) !== -1;
  } catch (ex) {
    throw new Error(`Unable to locate config file at ${configPath}`);
  }
};

export const updateConfig = (configDirPath: string) => {
  const configPath = addFileToPath(configDirPath, CONFIG_FILENAME);
  try {
    fs.writeFileSync(configPath, CONFIG_CONTENT, {
      encoding: 'utf8',
    });
  } catch (ex) {
    throw new Error(`Unable to locate config file at ${configPath}`);
  }
};
