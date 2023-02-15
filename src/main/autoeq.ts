import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { FilterTypeEnum, IFilter, IPreset } from '../common/constants';

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

  //         filter#               PK/LS/HS            <freq> HZ                 Gain <gain>     dB  Q         <quality>
  const LINE_REGEX = new RegExp(
    'Filter ([\\d]+)[:][a-zA-Z\\s]+(PK|LS|HS)[a-zA-Z\\s]+([\\d]+)[a-zA-Z\\s]+([-]?[\\d]*[.][\\d]*)[a-zA-Z\\s]+([\\d]*[.][\\d]*)'
  );

  let preAmpParsed = 0;
  const filterIds: string[] = [];
  const filterTypes: FilterTypeEnum[] = [];
  const frequencies: number[] = [];
  const gains: number[] = [];
  const qualities: number[] = [];

  // todo: how to use device and string??
  const file = fs.readFileSync(
    'A-Audio Elite (bass mode) ParametricEQ.txt',
    'utf8'
  );
  file.split('\n').forEach((line) => {
    if (line.match(PREAMP_REGEX)) {
      const match = line.match(PREAMP_REGEX);
      if (match == null || match.length !== 2) {
        throw new Error(
          `Preamp regex matched but could not extract all information for preamp: Length is: ${match.length}`
        );
      }
      preAmpParsed = parseFloat(match[1]);
    } else if (line.match(LINE_REGEX)) {
      const match = line.match(LINE_REGEX);
      if (match == null || match.length !== 6) {
        throw new Error(
          `Line regex matched but could not extract all information for filters. Length is: ${match.length}`
        );
      }
      const filterId = match[1];
      let filterType;
      if (match[2] === 'PK') {
        filterType = FilterTypeEnum.PK;
      } else if (match[2] === 'LS') {
        filterType = FilterTypeEnum.LSC;
      } else if (match[2] === 'HS') {
        filterType = FilterTypeEnum.HSC;
      } else {
        throw new Error('Unknown filter type');
      }
      const frequency = parseInt(match[3], 10);
      const gain = parseFloat(match[4]);
      const quality = parseFloat(match[5]);
      filterIds.push(filterId);
      filterTypes.push(filterType);
      frequencies.push(frequency);
      gains.push(gain);
      qualities.push(quality);
    }
  });

  const filtersList: IFilter[] = [];

  // what is id here???
  for (let i = 0; i < filterIds.length; i += 1) {
    filtersList.push({
      id: filterIds[i],
      frequency: frequencies[i],
      gain: gains[i],
      type: filterTypes[i],
      quality: qualities[i],
    });
  }
  const preset: IPreset = {
    preAmp: preAmpParsed,
    filters: filtersList,
  };

  console.log(preset);

  return preset;
};
