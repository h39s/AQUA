import { getMainPreAmp, setMainPreAmp } from './utils/equalizerApi';
import EqualizerEnablerSwitch from './components/EqualizerEnablerSwitch';
import Slider from './components/Slider';
import './styles/SideBar.scss';

const SideBar = () => {
  const MIN = -30;
  const MAX = 30;

  return (
    <div className="col sideBar center">
      <div>
        <h3>Enable</h3>
        <EqualizerEnablerSwitch id="equalizerEnabler" />
      </div>
      <div>
        <h3>Pre-Amp Gain (dB)</h3>
        <Slider
          name="Pre-Amplification Gain (dB)"
          min={MIN}
          max={MAX}
          getValue={getMainPreAmp}
          setValue={setMainPreAmp}
        />
      </div>
    </div>
  );
};

export default SideBar;
