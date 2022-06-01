import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { PeaceFoundContext } from './PeaceFoundContext';
import PrereqMissingModal from './PrereqMissingModal';
import Slider from './Slider';

const AppContent = () => {
  return (
    <PeaceFoundContext.Consumer>
      {({ wasPeaceFound }) => (
        <>
          <div className="row">
            <Slider />
          </div>
          <PrereqMissingModal
            show={!wasPeaceFound}
            onClose={() => console.log(false)}
          />
        </>
      )}
    </PeaceFoundContext.Consumer>
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
