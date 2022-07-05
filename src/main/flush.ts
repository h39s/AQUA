import fs from 'fs';
import path from 'path';

export enum FilterTypeEnum {
  PEAK = 'PK', // ["PK",True,True]
  LPQ = 'LPQ', // ["LPQ",False,True]
  HPQ = 'HPQ', // ["HPQ",False,True]
  BP = 'BP', // ["BP",False,True]
  LS = 'LS', // ["LS",True,False]
  HS = 'HS', // ["HS",True,False]
  NO = 'NO', // ["NO",False,True]
  AP = 'AP', // ["AP",False,True]
  LSC = 'LSC', // ["LSC",True,True]
  HSC = 'HSC', // ["HSC",True,True]
  BWLP = 'BWLP', // ["BWLP",False,True]
  BWHP = 'BWHP', // ["BWHP",False,True]
  LRLP = 'LRLP', // ["LRLP",False,True]
  LRHP = 'LRHP', // ["LRHP",False,True]
  LSCQ = 'LSCQ', // ["LSCQ",True,True]
  HSCQ = 'HSCQ', // ["HSCQ",True,True]
}

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

  // We assume when that equalizerAPO will interpret the lack of an explicit
  // preamp to mean 0dB for the preamp.
  if (state.preAmp) {
    output.push(`Preamp: ${state.preAmp}dB`);
  }

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
const AQUA_LOCAL_CONFIG_FILENAME = 'state.txt';
const AQUA_CONFIG_FILENAME = 'aqua.txt';
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

export const flush = (state: IState, configPath: string) => {
  try {
    fs.writeFileSync(
      addFileToPath(configPath, AQUA_CONFIG_FILENAME),
      stateToString(state),
      {
        encoding: 'utf8',
      }
    );
  } catch (ex) {
    console.log('Failed to write to');
  }
};

export const checkConfigFile = (configPath: string) => {
  try {
    const content = fs.readFileSync(
      addFileToPath(configPath, CONFIG_FILENAME),
      {
        encoding: 'utf8',
      }
    );
    return content.search(CONFIG_CONTENT) !== -1;
  } catch (ex) {
    throw new Error(`Unable to locate config file at ${configPath}`);
  }
};

export const updateConfig = (configPath: string) => {
  try {
    fs.writeFileSync(
      addFileToPath(configPath, CONFIG_FILENAME),
      CONFIG_CONTENT,
      {
        encoding: 'utf8',
      }
    );
  } catch (ex) {
    throw new Error(`Unable to locate config file at ${configPath}`);
  }
};
