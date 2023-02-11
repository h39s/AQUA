import { ErrorDescription } from 'common/errors';
import { useCallback, useMemo } from 'react';
import { disableAutoPreAmp, setMainPreAmp } from './utils/equalizerApi';
import EqualizerEnablerSwitch from './components/EqualizerEnablerSwitch';
import Slider from './components/Slider';
import './styles/SideBar.scss';
import { useAquaContext } from './utils/AquaContext';
import AutoPreAmpEnablerSwitch from './components/AutoPreAmpEnablerSwitch';
import GraphViewSwitch from './components/GraphViewSwitch';
import Spinner from './icons/Spinner';

const SideBar = () => {
  const MIN = -30;
  const MAX = 30;

  const {
    isGraphViewOn,
    isLoading,
    preAmp,
    setGlobalError,
    setPreAmp,
    setAutoPreAmpOn,
  } = useAquaContext();

  const setGain = useCallback(
    async (newValue: number) => {
      try {
        setAutoPreAmpOn(false);
        await disableAutoPreAmp();
        await setMainPreAmp(newValue);
        setPreAmp(newValue);
      } catch (e) {
        setGlobalError(e as ErrorDescription);
      }
    },
    [setAutoPreAmpOn, setGlobalError, setPreAmp]
  );

  const sliderHeight = useMemo(
    // Manually determine slider height
    () => (isGraphViewOn ? '102px' : 'calc(100vh - 524px)'),
    [isGraphViewOn]
  );

  return (
    <div className="col side-bar center">
      {isLoading ? (
        <div className="center full row">
          <Spinner />
        </div>
      ) : (
        <>
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
              sliderHeight={sliderHeight}
              setValue={setGain}
              label="-30 dB"
            />
          </div>
          <div className="col center">
            <h4>Auto Pre-amp</h4>
            <AutoPreAmpEnablerSwitch id="autoPreAmpEnabler" />
          </div>
          <div className="col center">
            <h4>Graph EQ</h4>
            <GraphViewSwitch id="graphViewEnabler" />
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
