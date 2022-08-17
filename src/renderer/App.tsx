import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import MainContent from './MainContent';
import { AquaProvider, useAquaContext } from './utils/AquaContext';
import PrereqMissingModal from './PrereqMissingModal';
import SideBar from './SideBar';
import FrequencyResponseChart from './graph/FrequencyResponseChart';

const AppContent = () => {
  const { isLoading, globalError, performHealthCheck } = useAquaContext();

  return (
    <>
      {isLoading ? (
        <div className="center full row">
          <h1>Loading...</h1>
        </div>
      ) : (
        <>
          <div className="parameteric-wrapper row">
            <SideBar />
            <MainContent />
          </div>
          <FrequencyResponseChart />
        </>
      )}
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
