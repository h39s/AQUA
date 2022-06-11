import './Switch.css';
import { useEffect, useContext, ChangeEventHandler } from 'react';
import { PeaceFoundContext } from './PeaceFoundContext';

interface ISwitchProps {
  isOn: boolean | undefined;
  handleToggle: ChangeEventHandler<HTMLInputElement>;
  id: string;
  onLoad: () => void;
}

// Taken from https://upmostly.com/tutorials/build-a-react-switch-toggle-component
export default function Switch({
  isOn,
  handleToggle,
  id,
  onLoad,
}: ISwitchProps) {
  const { peaceError } = useContext(PeaceFoundContext);
  useEffect(() => {
    console.log(`peaceError ${peaceError}`);
    if (!peaceError) {
      onLoad();
    }
  }, [onLoad, peaceError]);

  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={id}
        type="checkbox"
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        style={{ background: isOn ? '#06D6A0' : '' }}
        className="react-switch-label"
        htmlFor={id}
      >
        <span className="react-switch-button" />
      </label>
    </>
  );
}
