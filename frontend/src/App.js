import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import './App.css';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/upload" element={<Upload />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        <Upload/>

      </div>
    </Router>
      

    
  );
}

export default App;
