import { ErrorDescription } from 'common/errors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.scss';
import { healthCheck } from './utils/equalizerApi';
import MainContent from './MainContent';
import { AquaContext } from './utils/AquaContext';
import PrereqMissingModal from './PrereqMissingModal';
import SideBar from './SideBar';

const AppContent = () => {
  return (
    <div className="full row">
      <SideBar />
      <MainContent />
    </div>
  );
};

export default function App() {
  const [globalError, setGlobalError] = useState<
    ErrorDescription | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isMounted = useRef<boolean>(false);

  const performHealthCheck = useCallback(async () => {
    setIsLoading(true);
    try {
      await healthCheck();
      setGlobalError(undefined);
      isMounted.current = true;
    } catch (e) {
      setGlobalError(e as ErrorDescription);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    performHealthCheck();
  }, [performHealthCheck]);

  return (
    <AquaContext.Provider value={{ globalError, setGlobalError }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {isMounted.current && <AppContent />}
                {globalError && (
                  <PrereqMissingModal
                    isLoading={isLoading}
                    onRetry={performHealthCheck}
                    errorMsg={globalError.shortError}
                    actionMsg={globalError.action}
                  />
                )}
              </>
            }
          />
        </Routes>
      </Router>
    </AquaContext.Provider>
  );
}
