import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';

// import Layout from "./Layout";
import Upload from "./pages/Upload";
import Dashboard from './pages/Dashboard';


function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
