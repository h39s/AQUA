import { KeyboardEvent, useEffect, useContext, useState } from 'react';
import { PeaceFoundContext } from './PeaceFoundContext';
import './styles/Switch.scss';

interface ISwitchProps {
  isOn: boolean | undefined;
  handleToggle: () => void;
  id: string;
  onLoad: () => void;
}

// Structure taken from https://upmostly.com/tutorials/build-a-react-switch-toggle-component
export default function Switch({
  isOn,
  handleToggle,
  id,
  onLoad,
}: ISwitchProps) {
  const { peaceError } = useContext(PeaceFoundContext);
  const [isKeyDown, setIsKeyDown] = useState(false);
  useEffect(() => {
    if (!peaceError) {
      onLoad();
    }
  }, [onLoad, peaceError]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter' && !isKeyDown) {
      handleToggle();
      setIsKeyDown(true);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      setIsKeyDown(false);
    }
  };

  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className="switch-checkbox"
        id={id}
        type="checkbox"
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="switch-label" htmlFor={id}>
        <span className="switch-button" />
      </label>
    </>
  );
}
