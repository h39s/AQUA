import { ErrorDescription } from 'common/errors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { getProgramState } from './equalizerApi';
import { PeaceFoundContext } from './PeaceFoundContext';
import PrereqMissingModal from './PrereqMissingModal';
import Slider from './Slider';

const AppContent = () => {
  return (
    <div className="row">
      <Slider />
    </div>
  );
};

export default function App() {
  const [peaceError, setPeaceError] = useState<ErrorDescription | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isMounted = useRef<boolean>(false);

  const healthCheck = useCallback(async () => {
    setIsLoading(true);
    try {
      await getProgramState();
      setPeaceError(undefined);
      isMounted.current = true;
    } catch (e) {
      setPeaceError(e as ErrorDescription);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    healthCheck();
  }, [healthCheck]);

  return (
    <PeaceFoundContext.Provider value={{ peaceError, setPeaceError }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {isMounted.current && <AppContent />}
                {peaceError && (
                  <PrereqMissingModal
                    isLoading={isLoading}
                    onRetry={healthCheck}
                    errorMsg={peaceError.shortError}
                    actionMsg={peaceError.action}
                  />
                )}
              </>
            }
          />
        </Routes>
      </Router>
    </PeaceFoundContext.Provider>
  );
}
