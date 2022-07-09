import { KeyboardEvent, useEffect, useContext } from 'react';
import { AquaContext } from '../utils/AquaContext';
import '../styles/Switch.scss';

interface ISwitchProps {
  id: string;
  isOn: boolean;
  handleToggle: () => void;
  onLoad: () => void;
}

// Structure taken from https://upmostly.com/tutorials/build-a-react-switch-toggle-component
export default function Switch({
  id,
  isOn,
  handleToggle,
  onLoad,
}: ISwitchProps) {
  const { globalError } = useContext(AquaContext);
  useEffect(() => {
    if (!globalError) {
      onLoad();
    }
  }, [onLoad, globalError]);

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
        disabled={!!globalError}
      />
      <div role="button" className="switch-label" aria-label={id}>
        <span className="switch-button" />
      </div>
    </label>
  );
}
