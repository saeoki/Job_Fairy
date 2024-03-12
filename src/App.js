import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './page/Home/js/Home';
import Mypage from './page/Mypage/js/Mypage';
import LoginPage from './page/Login/js/LoginPage';
import CVletter from './CVletter';
import Report from './page/Report/js/Report';
import AIinterview from './page/AI/js/AIinterview';
import Epinformation from './Epinformation';
import Register from './page/Register/js/Register';

function App() {
  return (
   <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/Register' element={<Register />} />
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
 
 