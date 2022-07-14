import { ErrorDescription } from 'common/errors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.scss';
// import { DEFAULT_STATE, FilterTypeEnum, IFilter } from 'common/constants';
import { healthCheck } from './utils/equalizerApi';
import MainContent from './MainContent';
import { AquaProvider, useAquaContext } from './utils/AquaContext';
import PrereqMissingModal from './PrereqMissingModal';
import SideBar from './SideBar';

const AppContent = () => {
  return (
    <>
      <div className="parameteric-wrapper row">
        <SideBar />
        <MainContent />
      </div>
      {/* <div className="graph-wrapper" /> */}
    </>
  );
};

const AppWrapper = () => {
  const { globalError, setGlobalError } = useAquaContext();
  // const [isEnabled, setIsEnabled] = useState<boolean>(DEFAULT_STATE.isEnabled);
  // const [preAmp, setPreAmp] = useState<number>(DEFAULT_STATE.preAmp);
  // const [filters, setFilters] = useState<IFilter[]>(DEFAULT_STATE.filters);
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
  }, [setGlobalError]);

  // const setFilterFrequency = (index: number, newFrequency: number) => {
  //   const newFilters = [...filters];
  //   newFilters[index].frequency = newFrequency;
  //   setFilters(newFilters);
  // };

  // const setFilterQuality = (index: number, newQuality: number) => {
  //   const newFilters = [...filters];
  //   newFilters[index].quality = newQuality;
  //   setFilters(newFilters);
  // };

  // const setFilterType = (index: number, newType: FilterTypeEnum) => {
  //   const newFilters = [...filters];
  //   newFilters[index].type = newType;
  //   setFilters(newFilters);
  // };

  // const setFilterGain = (index: number, newGain: number) => {
  //   const newFilters = [...filters];
  //   newFilters[index].gain = newGain;
  //   setFilters(newFilters);
  // };

  useEffect(() => {
    performHealthCheck();
  }, [performHealthCheck]);

  return (
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
  );
};

export default function App() {
  return (
    <AquaProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppWrapper />} />
        </Routes>
      </Router>
    </AquaProvider>
  );
}
