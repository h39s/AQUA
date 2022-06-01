import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useContext,
  useRef,
  useState,
} from 'react';
import { getMainPreAmp, setMainPreAmp } from './equalizerApi';
import { PeaceFoundContext } from './PeaceFoundContext';
import { clamp, useInterval } from './utils';
import './Slider.css';

export default function Slider() {
  const MIN = -30;
  const MAX = 30;
  const INTERVAL = 200;
  const [preAmpGain, setPreAmpGain] = useState<number>(0);
  const [inputGain, setInputGain] = useState<number | '' | '-'>(0);

  const increaseButtonRef = useRef<HTMLDivElement | null>(null);
  const decreaseButtonRef = useRef<HTMLDivElement | null>(null);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [isDecreasing, setIsDecreasing] = useState(false);

  const { setWasPeaceFound } = useContext(PeaceFoundContext);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // TODO: figure out invalid result when interface type wasn't selected
        const initGain = await getMainPreAmp();
        console.log('result from getMainPreAmp', initGain);
        setPreAmpGain(initGain);
        setInputGain(initGain);
      } catch (e) {
        setWasPeaceFound(false);
      }
    };

    fetchResults();
  }, [setWasPeaceFound]);

  // Helpers for adjusting the preamp gain value
  const handleChangeGain = async (newValue: number) => {
    setPreAmpGain(newValue);
    setInputGain(newValue);
    try {
      const res = await setMainPreAmp(newValue);
      console.log('result from setMainPreAmp', res);
    } catch (e) {
      setWasPeaceFound(false);
    }
  };

  const handleDeltaChangeGain = (isIncrement: boolean) => {
    if (preAmpGain < MAX && isIncrement) {
      handleChangeGain(preAmpGain + 1);
    } else if (preAmpGain > MIN && !isIncrement) {
      handleChangeGain(preAmpGain - 1);
    }
  };

  // Hooks for continuously increasing/decreasing gain
  useInterval(
    () => handleDeltaChangeGain(true),
    isIncreasing ? INTERVAL : undefined
  );

  useInterval(
    () => handleDeltaChangeGain(false),
    isDecreasing ? INTERVAL : undefined
  );

  // Handlers for pausing continous change of the gain
  const stopIncrement = () => {
    setIsIncreasing(false);
    increaseButtonRef.current?.removeEventListener('mouseleave', stopIncrement);
  };

  const stopDecrement = () => {
    setIsDecreasing(false);
    decreaseButtonRef.current?.removeEventListener('mouseleave', stopDecrement);
  };

  // Handlers for various input types
  const handleArrowInput = (isIncrement: boolean) => {
    if (isIncrement) {
      // Manually alter gain once to simulate click
      handleDeltaChangeGain(true);

      // Begin timer for continous adjustment
      setIsIncreasing(true);
      increaseButtonRef.current?.addEventListener('mouseleave', stopIncrement);
    } else {
      // Manually alter gain once to simulate click
      handleDeltaChangeGain(false);

      // Begin timer for continous adjustment
      setIsDecreasing(true);
      decreaseButtonRef.current?.addEventListener('mouseleave', stopDecrement);
    }
  };

  const handleRangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue: number = clamp(parseInt(e.target.value, 10), MIN, MAX);
    handleChangeGain(newValue);
  };

  const handleChangeNumberInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const lastChar = value[value.length - 1];

    // Allow user to clear input and type an initial negative sign
    if (value === '' || value === '-') {
      setInputGain(value);
      return;
    }

    // Prevent user from typing non-numerical values
    if (Number.isNaN(parseInt(lastChar, 10))) {
      return;
    }

    const newValue: number = parseInt(value, 10);
    setInputGain(newValue);
  };

  const handleSubmitNumberInput = () => {
    if (inputGain === '' || inputGain === '-') {
      return;
    }
    const newValue: number = clamp(inputGain, MIN, MAX);
    handleChangeGain(newValue);
  };

  // Helper for detecting use of the ENTER key
  const listenForEnter = (e: KeyboardEvent, handler: () => void) => {
    if (e.code === 'Enter') {
      handler();
    }
  };

  return (
    <div className="col center slider">
      <div
        ref={increaseButtonRef}
        role="button"
        aria-label="Increase pre-amplification gain"
        className="slider-top"
        onMouseDown={() => handleArrowInput(true)}
        onMouseUp={stopIncrement}
        onKeyDown={(e) => listenForEnter(e, () => handleDeltaChangeGain(true))}
        tabIndex={0}
      />
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={preAmpGain}
        onChange={handleRangeInput}
      />
      <div
        ref={decreaseButtonRef}
        role="button"
        aria-label="Decrease pre-amplification gain"
        className="slider-bottom"
        onMouseDown={() => handleArrowInput(false)}
        onMouseUp={stopDecrement}
        onKeyDown={(e) => listenForEnter(e, () => handleDeltaChangeGain(false))}
        tabIndex={0}
      />
      <label htmlFor="input gain" className="col center">
        <input
          type="text"
          name="input gain"
          aria-label="Pre-amplification gain"
          value={inputGain}
          onInput={handleChangeNumberInput}
          onKeyDown={(e) => listenForEnter(e, handleSubmitNumberInput)}
        />
        Pre-Amplification Gain (dB)
      </label>
    </div>
  );
}
