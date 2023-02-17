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
    eqLines.pop();

    // console.log(eqParams);

    const preampMatch = eqLines[0].match(PREAMP_REGEX);
    if (preampMatch === null || preampMatch.length !== 2) {
      throw new Error(
        `Preamp regex match error for AutoEQ file: ${eqFilePath}`
      );
    } else {
      let preamp = 0.0;
      try {
        preamp = parseFloat(preampMatch[1]);
        // console.log(`Preamp: ${preamp} dB`);
      } catch (err) {
        throw new Error(
          `Preamp float parse error for AutoEQ file: ${eqFilePath}`
        );
      }
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
        const frequency = parseInt(filterMatch[2], 10);
        const gain = parseFloat(filterMatch[3]);
        const quality = parseFloat(filterMatch[4]);
        // console.log(`Filter ${i}: ON ${filterType} Fc ${frequency} Hz Gain ${gain.toFixed(1)} dB Q ${quality.toFixed(2)}`);
      } catch (err) {
        throw new Error(
          `Filter parameter parse error on line ${i} for AutoEQ file: ${eqFilePath}`
        );
      }
    }
  });
});
