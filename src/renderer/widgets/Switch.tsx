import { KeyboardEvent, useEffect } from 'react';
import '../styles/Switch.scss';

interface ISwitchProps {
  id: string;
  isOn: boolean;
  isDisabled: boolean;
  handleToggle: () => void;
  onLoad: () => void;
}

// Structure taken from https://upmostly.com/tutorials/build-a-react-switch-toggle-component
export default function Switch({
  id,
  isOn,
  isDisabled,
  handleToggle,
  onLoad,
}: ISwitchProps) {
  useEffect(() => {
    if (!isDisabled) {
      onLoad();
    }
  }, [onLoad, isDisabled]);

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleToggle();
    }
  };

  return (
    <label className="switch" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={isOn}
        aria-checked={isOn}
        className="switch-checkbox"
        onChange={handleToggle}
        onKeyUp={handleKeyUp}
        disabled={isDisabled}
      />
      <div role="button" className="switch-label" aria-label={id}>
        <span className="switch-button" />
      </div>
    </label>
  );
}
