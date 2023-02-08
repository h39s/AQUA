import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import MainContent from './MainContent';
import { AquaProvider, useAquaContext } from './utils/AquaContext';
import PrereqMissingModal from './PrereqMissingModal';
import SideBar from './SideBar';
import FrequencyResponseChart from './graph/FrequencyResponseChart';
import PresetsBar from './PresetsBar';
import { useThrottle } from './utils/utils';

const AppContent = () => {
  const { isGraphViewOn, isLoading, globalError, performHealthCheck } =
    useAquaContext();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState<number>(566);

  const updateDimensions = () => {
    const newHeight = wrapperRef.current?.clientHeight;
    if (newHeight && newHeight > 0) {
      setHeight(newHeight);
    }
  };

  const throttledDimensions = useThrottle(() => {
    const newHeight = wrapperRef.current?.clientHeight;
    if (newHeight && newHeight > 0) {
      setHeight(newHeight);
    }
  }, 100);

  useLayoutEffect(() => {
    // Compute dimensions on initial render
    updateDimensions();
    window.addEventListener('resize', throttledDimensions);
    return () => window.removeEventListener('resize', throttledDimensions);
  }, [throttledDimensions]);

  useLayoutEffect(() => {
    // Update layout measurements when graph view is toggled
    updateDimensions();
  }, [isGraphViewOn]);

  return (
    <>
      <SideBar height={height} />
      <MainContent ref={wrapperRef} height={height} />
      <PresetsBar />
      <FrequencyResponseChart />
      {globalError && (
        <PrereqMissingModal
          isLoading={isLoading}
          onRetry={performHealthCheck}
          errorMsg={globalError.shortError}
          actionMsg={globalError.action}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <AquaProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
        </Routes>
      </Router>
    </AquaProvider>
  );
}
