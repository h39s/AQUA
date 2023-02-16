import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { uid } from 'uid';
import {
  FilterTypeEnum,
  getDefaultFilter,
  IFilter,
  IPreset,
} from '../common/constants';

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
  const PREAMP_REGEX = new RegExp('Preamp:[\\s]*([-][\\d]*[.][\\d]*)');

  // filter #: PK/LS/HS <freq> HZ Gain <gain> dB Q <quality>
  const LINE_REGEX = new RegExp(
    'Filter ([\\d]+)[:][a-zA-Z\\s]+(PK|LS|HS)[a-zA-Z\\s]+([\\d]+)[a-zA-Z\\s]+([-]?[\\d]*[.][\\d]*)[a-zA-Z\\s]+([\\d]*[.][\\d]*)'
  );

  let preAmpParsed = 0;
  const filtersList: IFilter[] = [];

  const file = fs.readFileSync(path.join(AUTOEQ_DIR, device, response), 'utf8');
  file.split('\n').forEach((line) => {
    let match = line.match(PREAMP_REGEX);
    if (match) {
      if (match.length !== 2) {
        throw new Error(`Regex match error on ${line}`);
      }
      preAmpParsed = parseFloat(match[1]);
      return;
    }
    const filter: IFilter = getDefaultFilter();
    match = line.match(LINE_REGEX);
    if (match) {
      if (match.length !== 6) {
        throw new Error(`Regex match error on ${line}`);
      }
      if (match[2] === 'PK') {
        filter.type = FilterTypeEnum.PK;
      } else if (match[2] === 'LS') {
        filter.type = FilterTypeEnum.LSC;
      } else if (match[2] === 'HS') {
        filter.type = FilterTypeEnum.HSC;
      } else {
        // We don't support other filters right now, use PK as default.
        filter.type = FilterTypeEnum.PK;
      }
      filter.frequency = parseInt(match[3], 10);
      filter.gain = parseFloat(match[4]);
      filter.quality = parseFloat(match[5]);
      filtersList.push(filter);
    }
    // Ignore any lines which we do not recognize
  });

  const preset: IPreset = {
    preAmp: preAmpParsed,
    filters: filtersList,
  };

  console.log(preset);

  return preset;
};
