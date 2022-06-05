// import { InternalEvent } from 'main/api';
import { useContext, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { getProgramState } from './equalizerApi';
import { PeaceFoundContext } from './PeaceFoundContext';
import PrereqMissingModal from './PrereqMissingModal';
import Slider from './Slider';

const AppContent = () => {
  const { wasPeaceFound, setWasPeaceFound } = useContext(PeaceFoundContext);

  const handleClose = async () => {
    window.electron.ipcRenderer.sendMessage('internal', [0]);
  };

  const handleRetry = async () => {
    try {
      const res = await getProgramState();
      setWasPeaceFound(res > 0);
    } catch (e) {
      setWasPeaceFound(false);
    }
  };

  return (
    <>
      <div className="row">
        <Slider />
      </div>
      <PrereqMissingModal
        show={!wasPeaceFound}
        onRetry={handleRetry}
        onClose={handleClose}
      />
    </>
  );
};

export default function App() {
  const [wasPeaceFound, setWasPeaceFound] = useState<boolean>(true);

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
