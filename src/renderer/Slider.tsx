import { ChangeEvent, useEffect, useState } from 'react';
import { getMainPreAmp, setMainPreAmp } from './equalizerApi';

interface ISliderContent {
  min: number;
  max: number;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SliderContent = ({ min, max, value, onChange }: ISliderContent) => {
  return (
    <div>
      <div className="slider-content-bar" />
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default function Slider() {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue: number = parseInt(e.target.value, 10);
    setMainPreAmp(newValue);
    setPreAmpGain(newValue);
  };

  return (
    <div>
      <SliderContent
        min={MIN}
        max={MAX}
        value={preAmpGain}
        onChange={handleChange}
      />
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={preAmpGain}
        onChange={handleChange}
      />
    </div>
  );
}
