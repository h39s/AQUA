import { ErrorDescription } from 'common/errors';
import { setMainPreAmp } from './utils/equalizerApi';
import EqualizerEnablerSwitch from './components/EqualizerEnablerSwitch';
import Slider from './components/Slider';
import './styles/SideBar.scss';
import { useAquaContext } from './utils/AquaContext';
import Switch from './widgets/Switch';
import AutoPreAmpEnablerSwitch from './components/AutoPreAmpEnablerSwitch';

interface Props {
  showChartView: boolean;
  toggleShowChartView: () => void;
}

const SideBar = ({ showChartView, toggleShowChartView }: Props) => {
  const MIN = -30;
  const MAX = 30;

  const { preAmp, setGlobalError, setPreAmp, setAutoPreAmpOn } =
    useAquaContext();

  const setGain = async (newValue: number) => {
    try {
      await setAutoPreAmpOn(false);
      await setMainPreAmp(newValue);
      setPreAmp(newValue);
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
  };

  return (
    <div className="col sideBar center">
      <div className="col center">
        <h4>Enable</h4>
        <EqualizerEnablerSwitch id="equalizerEnabler" />
      </div>
      <div>
        <h4>Pre-Amp Gain</h4>
        <div>+30 dB</div>
        <Slider
          name="Pre-Amplification Gain (dB)"
          min={MIN}
          max={MAX}
          value={preAmp}
          sliderHeight={100}
          setValue={setGain}
        >
          <div>-30 dB</div>
        </Slider>
      </div>
      <div className="col center">
        <h4>Auto Pre-amp</h4>
        <AutoPreAmpEnablerSwitch id="autoPreAmpEnabler" />
      </div>
      <div className="col center">
        <h4>Graph EQ</h4>
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
