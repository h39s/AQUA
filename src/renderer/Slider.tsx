import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { getMainPreAmp, setMainPreAmp } from './equalizerApi';
import { clamp } from './utils';
import './Slider.css';

export default function Slider() {
  const MIN = -30;
  const MAX = 30;
  const [preAmpGain, setPreAmpGain] = useState(0);
  const [inputGain, setInputGain] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      const initGain = await getMainPreAmp();
      setPreAmpGain(initGain);
      setInputGain(initGain);
    };

    fetchResults();
  }, []);

  const listenForEnter = (e: KeyboardEvent, handler: () => void) => {
    if (e.code === 'Enter') {
      handler();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue: number = clamp(parseInt(e.target.value, 10), MIN, MAX);
    setMainPreAmp(newValue);
    setPreAmpGain(newValue);
    setInputGain(newValue);
  };

  const handleDeltaChange = (isIncrement: boolean) => {
    if (preAmpGain < 30 && isIncrement) {
      setMainPreAmp(preAmpGain + 1);
      setPreAmpGain(preAmpGain + 1);
      setInputGain(preAmpGain + 1);
    } else if (preAmpGain > -30 && !isIncrement) {
      setMainPreAmp(preAmpGain - 1);
      setPreAmpGain(preAmpGain - 1);
      setInputGain(preAmpGain - 1);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue: number = parseInt(e.target.value, 10);
    setInputGain(newValue);
  };

  const handleSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      const newValue: number = clamp(inputGain, MIN, MAX);
      setMainPreAmp(newValue);
      setPreAmpGain(newValue);
      setInputGain(newValue);
    }
  };

  return (
    <div className="col center slider">
      <div
        role="button"
        aria-label="Increase pre-amplification gain"
        className="slider-top"
        onClick={() => handleDeltaChange(true)}
        onKeyDown={(e) => listenForEnter(e, () => handleDeltaChange(true))}
        tabIndex={0}
      />
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={preAmpGain}
        onChange={handleChange}
      />
      <div
        role="button"
        aria-label="Decrease pre-amplification gain"
        className="slider-bottom"
        onClick={() => handleDeltaChange(false)}
        onKeyDown={(e) => listenForEnter(e, () => handleDeltaChange(false))}
        tabIndex={0}
      />
      <input
        type="number"
        min={MIN}
        max={MAX}
        value={inputGain}
        onChange={handleInput}
        onKeyDown={handleSubmit}
      />
      Pre-Amplification Gain
    </div>
  );
}
