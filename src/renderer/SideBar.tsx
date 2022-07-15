import { ErrorDescription } from 'common/errors';
import { setMainPreAmp } from './utils/equalizerApi';
import EqualizerEnablerSwitch from './components/EqualizerEnablerSwitch';
import Slider from './components/Slider';
import './styles/SideBar.scss';
import { useAquaContext } from './utils/AquaContext';

const SideBar = () => {
  const MIN = -30;
  const MAX = 30;

  const { preAmp, setGlobalError, setPreAmp } = useAquaContext();

  const setGain = async (newValue: number) => {
    try {
      await setMainPreAmp(newValue);
      setPreAmp(newValue);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

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
          value={preAmp}
          setValue={setGain}
        />
      </div>
    </div>
  );
};

export default SideBar;
