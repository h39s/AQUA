import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Slider from './Slider';
import Slider2 from './Slider2';

const Hello = () => {
  return (
    <div className="row">
      <Slider />
      <Slider2 />
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
