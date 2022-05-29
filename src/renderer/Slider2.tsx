import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { getMainPreAmp, setMainPreAmp } from './equalizerApi';
import { clamp } from './utils';
import './Slider.css';

export default function Slider2() {
  const MIN = -30;
  const MAX = 30;
  const [preAmpGain, setPreAmpGain] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      const initGain = await getMainPreAmp();
      setPreAmpGain(initGain);
    };

    fetchResults();
  }, []);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue: number = parseInt(e.target.value, 10);
    if (newValue >= MIN && newValue <= MAX) {
      setMainPreAmp(newValue);
      setPreAmpGain(newValue);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue: number = clamp(parseInt(e.target.value, 10), MIN, MAX);
    setMainPreAmp(newValue);
    setPreAmpGain(newValue);
  };

  return (
    <div className="col center slider2">
      <div className="slider-wrapper">
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={preAmpGain}
          onChange={handleChange}
        />
      </div>
      <input
        type="number"
        min={MIN}
        max={MAX}
        value={preAmpGain}
        onChange={handleInput}
      />
      Pre-Amplification Gain
    </div>
  );
}
