
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // named import 사용

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Header from "../../Home/js/Header";
import Footer from "../../Home/js/Footer";
import Interview_chart from "./Interview_chart";
import STTResult from "./STTResult";
import { ErrorToast, SaveSuccessToast } from "../../../components/ToastMessage"; 

const BackendIP = process.env.REACT_APP_EC2_IP;

function Interview_result() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 토큰에서 사용자 정보 추출
  const token = localStorage.getItem('token');
  const userData = jwtDecode(token); // named import로 가져온 jwtDecode 사용
  const { kakaoId, nickname } = userData;

  const { accumulatedEmotions, answers } = location.state || {};
  // console.log(answers)
  const [evaluations, setEvaluations] = useState([]);
  const [emotionFeedback, setEmotionFeedback] = useState('');

  console.log(evaluations)
  // 데이터 저장 함수
  const handleSave = async () => {
    // const prepareAnswers = answers.map((answer) => ({
    //   ...answer,
    //   answer: evaluations.answer || "No answer provided",
    //   evaluation: evaluations.evaluation || "Not evaluated",
    // }));
    // const prepareAnswers = evaluations.map((evaluation) => ({
    //   ...evaluation,
    //   answer: evaluation.answer || "No answer provided",
    //   evaluation: evaluation.evaluation || "Not evaluated",
    // }));
    // console.log(prepareAnswers)
  
    const interviewData = {
      kakaoId,
      nickname,
      // questionsAndAnswers: prepareAnswers,
      questionsAndAnswers: evaluations,
      accumulatedEmotions,
      emotionFeedback,
      createdAt: new Date().toISOString(),
    };

    console.log("Sending interviewData:", interviewData);  // 전송 전 데이터 확인
  
    try {
      const response = await axios.post(`${BackendIP}/api/interview/save`, interviewData, {
        withCredentials: true,
      });
      console.log("Data saved to DB:", response.data);
      SaveSuccessToast();
      setTimeout(() => {
        navigate('/Report');
      }, 1000);
    } catch (error) {
      console.error("Failed to save data to DB:", error.response?.data || error.message);
      ErrorToast();
    }
  };

  
  const goToMainPage = () => {
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: 1 }}>
        <STTResult answers={answers} onEvaluations={setEvaluations} />
        <Interview_chart accumulatedEmotions={accumulatedEmotions} onEmotionFeedback={setEmotionFeedback} />
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ padding: '20px 20px', fontSize: '16px' }}
          >
            저장하기
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={goToMainPage}
            sx={{ padding: '10px 20px', fontSize: '16px' }}
          >
            메인 페이지로 이동
          </Button>
        </Stack>
      </div>
      <Footer />
    </div>
  );
}

export default Interview_result;
