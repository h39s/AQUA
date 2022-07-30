/** ----- Application Constants ----- */

export const MAX_GAIN = 30;
export const MIN_GAIN = -30;

export const MAX_FREQUENCY = 20000;
export const MIN_FREQUENCY = 1;
export const MAX_QUALITY = 100;
export const MIN_QUALITY = 0.001;

export const MAX_NUM_FILTERS = 20; // TODO: Investigate an appropriate value for this
export const MIN_NUM_FILTERS = 1;

// Need to use LPQ and HPQ to allow users to adjust quality for low/high pass filters
// Need to use LSC and HSC to allow users to adjust quality for low/high shelf filters
export enum FilterTypeEnum {
  PK = 'PK', // Peak ["PK",True,True]
  // LPQ = 'LPQ', // Low Pass ["LPQ",False,True]
  // HPQ = 'HPQ', // High Pass ["HPQ",False,True]
  // BP = 'BP', // Band Pass ["BP",False,True]
  // NO = 'NO', // Notch ["NO",False,True]
  // AP = 'AP', // All Pass ["AP",False,True]
  LSC = 'LSC', // Low Shelf ["LSC",True,True]
  HSC = 'HSC', // High Shelf ["HSC",True,True]
  // BWLP = 'BWLP', // Butterworth Low Pass ["BWLP",False,True]
  // BWHP = 'BWHP', // Butterworth High Pass ["BWHP",False,True]
  // LRLP = 'LRLP', // Linkwitz Riley Low Pass ["LRLP",False,True]
  // LRHP = 'LRHP', // Linkwitz Riley High Pass["LRHP",False,True]
  // LSCQ = 'LSCQ', // Low Shelf Q?? ["LSCQ",True,True]
  // HSCQ = 'HSCQ', // High Shelf Q?? ["HSCQ",True,True]
}

export const FilterTypeToLabelMap: Record<FilterTypeEnum, string> = {
  [FilterTypeEnum.PK]: 'Peak Filter',
  // [FilterTypeEnum.LPQ]: 'Low Pass Filter',
  // [FilterTypeEnum.HPQ]: 'High Pass Filter',
  [FilterTypeEnum.LSC]: 'Low Shelf Filter',
  [FilterTypeEnum.HSC]: 'High Shelf Filter',
  // [FilterTypeEnum.NO]: 'Notch Filter',
};

export const WINDOW_WIDTH = 1024;
export const WINDOW_HEIGHT = 626;
export const WINDOW_HEIGHT_EXPANDED = 1036;

/** ----- Application Interfaces ----- */

export interface IFilter {
  frequency: number;
  gain: number;
  type: FilterTypeEnum;
  quality: number;
}

export interface IState {
  isEnabled: boolean;
  isAutoPreAmpOn: boolean;
  isGraphViewOn: boolean;
  preAmp: number;
  filters: IFilter[];
}

/** ----- Default Values ----- */

const FIXED_FREQUENCIES = [
  32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000,
];

export const DEFAULT_FILTER: IFilter = {
  frequency: 1000,
  gain: 0,
  quality: 1,
  type: FilterTypeEnum.PK,
};

const DEFAULT_FILTERS: IFilter[] = FIXED_FREQUENCIES.map((f) => {
  return {
    frequency: f,
    gain: 0,
    quality: 1,
    type: FilterTypeEnum.PK,
  };
});

export const DEFAULT_STATE: IState = {
  isEnabled: true,
  isAutoPreAmpOn: true,
  isGraphViewOn: false,
  preAmp: 0,
  filters: DEFAULT_FILTERS,
};
