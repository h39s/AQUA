/*
<AQUA: System-wide parametric audio equalizer interface>
Copyright (C) <2023>  <AQUA Dev Team>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import fs from 'fs';
import { PREAMP_REGEX, FILTER_REGEX } from '../../common/constants';

const headphones = fs.readdirSync('autoeq');

headphones.forEach((headphone) => {
  const headphonePath = `autoeq/${headphone}`;
  const eqFiles = fs.readdirSync(headphonePath);
  eqFiles.forEach((eqFile) => {
    const eqFilePath = `${headphonePath}/${eqFile}`;
    const eqParams = fs.readFileSync(eqFilePath, { encoding: 'utf8' });
    const eqLines = eqParams.split('\n');
    if (eqLines[eqLines.length - 1] === '') {
      eqLines.pop();
    }
    if (eqLines.length === 0) {
      throw new Error(`Empty AutoEQ file: ${eqFilePath}`);
    }

    // console.log(eqParams);

    const preampMatch = eqLines[0].match(PREAMP_REGEX);
    if (preampMatch === null || preampMatch.length !== 2) {
      throw new Error(
        `Preamp regex match error for AutoEQ file: ${eqFilePath}`
      );
    } else if (Number.isNaN(parseFloat(preampMatch[1]))) {
      throw new Error(
        `Preamp float parse error for AutoEQ file: ${eqFilePath}`
      );
    }

    for (let i = 1; i < eqLines.length; i += 1) {
      const filterMatch = eqLines[i].match(FILTER_REGEX);
      if (filterMatch === null || filterMatch.length !== 5) {
        throw new Error(
          `Filter regex match error on line ${i} for AutoEQ file: ${eqFilePath}`
        );
      }

      switch (filterMatch[1]) {
        case 'PK':
        case 'LS':
        case 'HS':
          break;
        default:
          throw new Error(
            `Filter type not (PK|LS|HS) on line ${i} for AutoEQ file: ${eqFilePath}`
          );
      }
      try {
        parseInt(filterMatch[2], 10);
        parseFloat(filterMatch[3]);
        parseFloat(filterMatch[4]);
        // console.log(`Filter ${i}: ON ${filterType} Fc ${frequency} Hz Gain ${gain.toFixed(1)} dB Q ${quality.toFixed(2)}`);
      } catch (err) {
        throw new Error(
          `Filter parameter parse error on line ${i} for AutoEQ file: ${eqFilePath}`
        );
      }
    }
  });
});
