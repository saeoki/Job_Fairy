import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './js/Home2';
import Mypage from './js/Mypage';
import LoginPage from './js/LoginPage';
import CVletter from './js/CVletter';
import Report from './js/Report';
import AIinterview from './js/AIinterview';
import Epinformation from './js/Epinformation';

function App() {
  return (
   <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/Mypage' element={<Mypage />} />
          <Route path='/LoginPage' element={<LoginPage />} />
          {/* <Route path='/CVletter' element={<CVletter />} />
          <Route path='/Report' element={<Report />} />
          <Route path='/AIinterview' element={<AIinterview />} />
          <Route path='/Epinformation' element={<Epinformation />} /> */}
        </Routes>
    </div> 
  );
}

export default App;
 
 