import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './page/Home/js/Home';
import Mypage from './page/Mypage/js/Mypage';
import LoginPage from './page/Login/js/LoginPage';
import Register from './page/Register/js/Register';
import Self_introduction from './page/Self_introduction/js/Self_introduction';
import Output_Self_introduction from './page/Self_introduction/js2/Output_Self_introduction';
import AIinterview from './page/AI/js/AIinterview';
import JobInput from './page/Self_introduction/js/JobInput';
import Outputpage from './page/Self_introduction/js2/Outputpage';

function App() {
  // const [selectedJob, setSelectedJob] = useState('');

  // const handleJobSelect = (selectedJob) => {
  //   setSelectedJob(selectedJob);
  // };

  return (
   <div className="App">
      {/* <JobInput onJobSelect={handleJobSelect} />
      <Outputpage selectedJob={selectedJob} /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Mypage' element={<Mypage />} />
          <Route path='/LoginPage' element={<LoginPage />} />
          <Route path='/AIinterview' element={<AIinterview />} />

          <Route path='/Self_introduction' element={<Self_introduction />} />
          <Route path='/Output_Self_introduction' element={<Output_Self_introduction />} />
          {/* 
          <Route path='/Report' element={<Report />} />

          <Route path='/Epinformation' element={<Epinformation />} /> */}
        </Routes>
    </div> 
  );
}

export default App;
 
 