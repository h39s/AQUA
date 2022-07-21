import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import { useCallback, useState } from 'react';
import MainContent from './MainContent';
import { AquaProvider, useAquaContext } from './utils/AquaContext';
import PrereqMissingModal from './PrereqMissingModal';
import SideBar from './SideBar';
import FrequencyResponseChart from './graph/FrequencyResponseChart';
import { decreaseWindowSize, increaseWindowSize } from './utils/equalizerApi';

const AppContent = () => {
  const { isLoading, globalError, performHealthCheck } = useAquaContext();
  const [showChartView, setShowChartView] = useState(false);

  const toggleShowChartView = useCallback(async () => {
    try {
      if (showChartView) {
        await decreaseWindowSize();
      } else {
        await increaseWindowSize();
      }
    } catch (e) {
      console.log('Error');
    }
    setShowChartView(!showChartView);
  }, [showChartView]);

  return (
    <>
      {isLoading ? (
        <div className="center full row">
          <h1>Loading...</h1>
        </div>
      ) : (
        <>
          <div className="parameteric-wrapper row">
            <SideBar
              showChartView={showChartView}
              toggleShowChartView={toggleShowChartView}
            />
            <MainContent />
          </div>
          {showChartView && (
            <div className="graph-wrapper">
              <FrequencyResponseChart />
            </div>
          )}
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
