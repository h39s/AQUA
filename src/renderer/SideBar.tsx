import { ErrorDescription } from 'common/errors';
import { setMainPreAmp } from './utils/equalizerApi';
import EqualizerEnablerSwitch from './components/EqualizerEnablerSwitch';
import Slider from './components/Slider';
import './styles/SideBar.scss';
import { useAquaContext } from './utils/AquaContext';
import Switch from './widgets/Switch';
import AutoPreampEnablerSwitch from './components/AutoPreampEnablerSwitch';

interface Props {
  showChartView: boolean;
  toggleShowChartView: () => void;
}

const SideBar = ({ showChartView, toggleShowChartView }: Props) => {
  const MIN = -30;
  const MAX = 30;

  const { preAmp, setGlobalError, setPreAmp, setAutoPreampOn } =
    useAquaContext();

  const setGain = async (newValue: number) => {
    try {
      await setAutoPreampOn(false);
      await setMainPreAmp(newValue);
      setPreAmp(newValue);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  return (
    <div className="col sideBar center">
      <div className="col center">
        <h3>Enable</h3>
        <EqualizerEnablerSwitch id="equalizerEnabler" />
      </div>
      <div>
        <h3>Pre-Amp Gain</h3>
        <Slider
          name="Pre-Amplification Gain (dB)"
          min={MIN}
          max={MAX}
          value={preAmp}
          sliderHeight={100}
          setValue={setGain}
        />
      </div>
      <div className="col center">
        <h3>Auto Pre-amp</h3>
        <AutoPreampEnablerSwitch id="autoPreampEnabler" />
      </div>
      <div className="col center">
        <h3>Graph EQ</h3>
        <Switch
          id="chartEnabler"
          isOn={showChartView}
          handleToggle={toggleShowChartView}
          isDisabled={false}
        />
      </div>
    </div>
  );
};

export default SideBar;
