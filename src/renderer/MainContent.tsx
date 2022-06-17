import { ErrorDescription } from 'common/errors';
import { useContext, useEffect, useState } from 'react';
import { getFrequency, getGain, setGain } from './equalizerApi';
import { PeaceFoundContext } from './PeaceFoundContext';
import Slider from './Slider';
import './styles/MainContent.scss';

const MainContent = () => {
  const MIN = -30;
  const MAX = 30;
  const NUM_SLIDERS = 10;
  // const FREQS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  const [frequencies, setFrequencies] = useState<number[]>([]);

  const { peaceError, setPeaceError } = useContext(PeaceFoundContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const sliderIds = Array(NUM_SLIDERS)
          .fill(0)
          .map((_, i) => i + 1);
        const result = await Promise.all(
          sliderIds.map((id) => getFrequency(id))
        );
        setFrequencies(result);
      } catch (e) {
        setPeaceError(e as ErrorDescription);
      }
    };
    if (!peaceError) {
      fetchResults();
    }
  }, [peaceError, setPeaceError]);

  return (
    <div className="row center mainContent">
      {frequencies.length === 0 ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div className="col center bandLabel">
            <span>Frequency</span>
            <div className="col">
              <span>30dB</span>
              <span>0dB</span>
              <span>-30dB</span>
            </div>
            <span className="gainLabel">Gain (dB)</span>
          </div>
          {frequencies.map((frequency, index) => (
            <div className="col band" key={frequency}>
              {`${frequency} Hz`}
              <Slider
                name={`${frequency}`}
                min={MIN}
                max={MAX}
                getValue={() => getGain(index + 1)}
                setValue={(newValue: number) => setGain(index + 1, newValue)}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default MainContent;
