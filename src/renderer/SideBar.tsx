import { getMainPreAmp, setMainPreAmp } from './equalizerApi';
import EqualizerEnablerSwitch from './EqualizerEnablerSwitch';
import Slider from './Slider';

const SideBar = () => {
  const MIN = -30;
  const MAX = 30;

  return (
    <div className="col">
      <EqualizerEnablerSwitch id="equalizerEnabler" />
      <Slider
        name="Pre-Amplification Gain (dB)"
        min={MIN}
        max={MAX}
        getValue={getMainPreAmp}
        setValue={setMainPreAmp}
      />
    </div>
  );
};

export default SideBar;
