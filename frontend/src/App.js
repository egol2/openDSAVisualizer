import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import './App.css';
import { useLocation, Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';

function App() {

  return (

    <div>
      <Header/>  
      <Upload/>
    </div>
    
    
  );
}

export default App;
