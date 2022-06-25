import FrequencyBand from './FrequencyBand';
import './styles/MainContent.scss';

const MainContent = () => {
  const NUM_SLIDERS = 10;
  // const FREQS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  const sliderIndicies = Array(NUM_SLIDERS)
    .fill(0)
    .map((_, i) => i + 1);

  return (
    <div className="row center mainContent">
      {sliderIndicies.length === 0 ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div className="col center bandLabel">
            <span className="rowLabel">Frequency (Hz)</span>
            <div className="col">
              <span>30dB</span>
              <span>0dB</span>
              <span>-30dB</span>
            </div>
            <span className="rowLabel">Gain (dB)</span>
          </div>
          {sliderIndicies.map((sliderIndex) => (
            <FrequencyBand
              sliderIndex={sliderIndex}
              key={`slider-${sliderIndex}`}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default MainContent;
