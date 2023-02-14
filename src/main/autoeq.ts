import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { FilterTypeEnum, IPreset } from '../common/constants';

let AUTOEQ_DIR = './resources/autoeq';
if (!app.isPackaged) {
  // dev mode means there is no resources folder and we must access our repo's autoeq folder.
  AUTOEQ_DIR = path.join(__dirname, '../../autoeq');
}

export const getAutoEqDeviceList = () => {
  return fs.readdirSync(AUTOEQ_DIR);
};

export const getAutoEqResponseList = (device: string) => {
  return fs.readdirSync(path.join(AUTOEQ_DIR, device));
};

export const getAutoEqPreset = (device: string, response: string) => {
  // TODO: parse equalizer apo file and return data as a state
  const preset: IPreset = {
    preAmp: 0.0,
    filters: [
      {
        id: '0',
        frequency: 100,
        gain: 0.0,
        type: FilterTypeEnum.PK,
        quality: 1.0,
      },
    ],
  };
  return preset;
};
