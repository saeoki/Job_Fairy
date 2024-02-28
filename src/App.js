import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';


import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Mypage from './pages/Mypage';
import CVletter from './pages/CVletter';
import Report from './pages/Report';
import AIinterview from './pages/AIinterview';
import Epinformation from './pages/Epinformation';

function App() {
  return (
   <div className="App">
        <nav>
{/*           <Link to="/">Home</Link>
          <Link to="/Mypage">Mypage</Link>
          <Link to="/LoginPage">LoginPage</Link>  */}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/Mypage' element={<Mypage />} />
          <Route path='/LoginPage' element={<LoginPage />} />
          <Route path='/CVletter' element={<CVletter />} />
          <Route path='/Report' element={<Report />} />
          <Route path='/AIinterview' element={<AIinterview />} />
          <Route path='/Epinformation' element={<Epinformation />} />

        </Routes>
    </div> 
  );
}

export default App;
 
 