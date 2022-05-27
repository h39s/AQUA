import { ChangeEvent, useState } from 'react';

interface ISliderContent {
  min: number;
  max: number;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SliderContent = ({ min, max, value, onChange }: ISliderContent) => {
  const [isDragging, setIsDragging] = useState(false);

  const onMouseMove = (e: MouseEvent) => {
    if (e.button !== 0) {
      return;
    }

    setIsDragging(true);
  };

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue: number = parseInt(e.target.value, 10);
    window.electron.ipcRenderer.sendMessage('peace', [5, 1, newValue * 1000]);
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
