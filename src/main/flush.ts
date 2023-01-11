import fs from 'fs';
import path from 'path';
import {
  getDefaultState,
  IFilter,
  IState,
  PRESETS_DIR,
} from '../common/constants';

export const stateToString = (state: IState) => {
  if (!state.isEnabled) {
    return '';
  }

  let output: string[] = [];

  output.push('Device: all');
  output.push('Channel: all');
  // This line MUST be "Preamp" without a capitalized P for Equalizer APO to work
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

export const serializeFilters = (filters: IFilter[]) => {
  return JSON.stringify(filters);
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
    return getDefaultState();
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

export const savePreset = (preset_name: string, filters: IFilter[]) => {
  // need to create presets dir first...... should we do this in the install?
  try {
    fs.writeFileSync(PRESETS_DIR + preset_name, serializeFilters(filters), {
      encoding: 'utf8',
    });
  } catch (ex) {
    console.log('Failed to save to preset %d', preset_name);
    throw ex;
  }

  console.log(`Wrote preset for: ${preset_name}`);
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
