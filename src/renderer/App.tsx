import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Slider from './Slider';

const Hello = () => {
  return (
    <div>
      <Slider />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
