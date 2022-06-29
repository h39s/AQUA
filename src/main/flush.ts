import fs from 'fs';

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

  if (state.preAmp) {
    output.push(`Preamp: ${state.preAmp}dB`);
  }

  // Using individual filter bands
  output = output.concat(
    state.filters
      .flatMap(({ frequency, gain, type, quality }, index) => {
        if (!gain) {
          return '';
        }
        return `Filter${index}: ON ${type} Fc ${frequency} Hz Gain ${gain} dB Q ${quality}`;
      })
      .filter((str) => str.length > 0)
  );

  // TODO: Figure out when to use GraphicEQ
  // `${Frequency} ${Gain};`

  return output.join('\n\r');
};

export const serializeState = (state: IState) => {
  return JSON.stringify(state);
};

export const fetch = () => {
  try {
    const content = fs.readFileSync('state.txt', { encoding: 'utf8' });
    return JSON.parse(content) as IState;
  } catch (ex) {
    // if unable to fetch the state, use a default one
    return DEFAULT_STATE;
  }
};

export const save = (state: IState) => {
  fs.writeFileSync('state.txt', serializeState(state), {
    encoding: 'utf8',
  });
};

export const flush = (state: IState) => {
  fs.writeFileSync(
    'C:/Program Files/EqualizerAPO/config/aqua.txt',
    stateToString(state),
    { encoding: 'utf8' }
  );
};
