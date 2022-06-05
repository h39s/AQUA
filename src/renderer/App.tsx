import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { getProgramState } from './equalizerApi';
import { PeaceFoundContext } from './PeaceFoundContext';
import PrereqMissingModal from './PrereqMissingModal';
import Slider from './Slider';

const AppContent = () => {
  return (
    <>
      <div className="row">
        <Slider />
      </div>
      <PrereqMissingModal />
    </>
  );
};

export default function App() {
  const [wasPeaceFound, setWasPeaceFound] = useState<boolean>(true);

  useEffect(() => {
    const healthCheck = async () => {
      try {
        await getProgramState();
        setWasPeaceFound(true);
      } catch (e) {
        setWasPeaceFound(false);
      }
    };

    healthCheck();
  }, []);

  return (
    <PeaceFoundContext.Provider value={{ wasPeaceFound, setWasPeaceFound }}>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
        </Routes>
      </Router>
    </PeaceFoundContext.Provider>
  );
}
