import { ErrorDescription } from 'common/errors';
import { useContext, useEffect, useState } from 'react';
import { getFrequency, getGain, setGain } from './equalizerApi';
import { PeaceFoundContext } from './PeaceFoundContext';
import Slider from './Slider';

const MainContent = () => {
  const MIN = -30;
  const MAX = 30;
  const NUM_SLIDERS = 10;

  const sliderIds = Array(NUM_SLIDERS)
    .fill(0)
    .map((_, i) => i + 1);
  const [frequencies, setFrequencies] = useState<number[]>([]);

  const { peaceError, setPeaceError } = useContext(PeaceFoundContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
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
  }, [sliderIds, peaceError, setPeaceError]);

  return (
    <div className="row center mainContent">
      {frequencies.map((frequency, index) => (
        <div className="col">
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
    </div>
  );
};

export default MainContent;
