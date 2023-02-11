import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import MainContent from './MainContent';
import { AquaProvider, useAquaContext } from './utils/AquaContext';
import PrereqMissingModal from './PrereqMissingModal';
import SideBar from './SideBar';
import FrequencyResponseChart from './graph/FrequencyResponseChart';
import PresetsBar from './PresetsBar';

const AppContent = () => {
  const { isGraphViewOn, isLoading, globalError, performHealthCheck } =
    useAquaContext();

  return (
    <>
      <SideBar />
      <MainContent />
      <PresetsBar />
      {isGraphViewOn && <FrequencyResponseChart />}
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
