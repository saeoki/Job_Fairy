import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './page/Home/js/Home';
import Mypage from './page/Mypage/js/Mypage';
import Register from './page/Register/js/Register';
import Self_introduction from './page/Self_introduction/js/Self_introduction';
import AIinterview from './page/AI/js/AIinterview';
import CheckCamMic from './page/AI/Checkcammic/CheckCamMic';
import Recruitment from './page/Recruitment/js/Recruitment';

import AI_interview_start from './page/AI/AI_Interview/AI_interview_start';
import Interview_end from './page/AI/Interview_end/Interview_end';

import JobPostingList from './page/Recruitment/js/JobPostingList';

import Report from './page/Report/js/Report';

import { AuthProvider } from './context/AuthContext';
import Itap from './page/ITAP/js/Itap';
import CondingTest from './page/codingtest/js/CodingTest';

function App() {

  return (
   <div className="App">
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Mypage' element={<Mypage />} />

          <Route path='/AIinterview' element={<AIinterview />} />
          <Route path='/CheckCamMic' element={<CheckCamMic />} />
          <Route path='/AI_interview_start' element={<AI_interview_start />} />
          <Route path='/Interview_end' element={<Interview_end />} />

          <Route path='/Self_introduction' element={<Self_introduction />} />

          
          <Route path='/Report' element={<Report />} />
          
          <Route path='/CodingTest' element={<CondingTest />} />
          <Route path='/ITAP' element={<Itap />} />

          <Route path='/Recruitment' element={<Recruitment />} />
          <Route path='/Recruitment/JobPostingList' element={<JobPostingList />} />
        </Routes>
      </AuthProvider>
    </div> 
  );
}

export default App;
 
 