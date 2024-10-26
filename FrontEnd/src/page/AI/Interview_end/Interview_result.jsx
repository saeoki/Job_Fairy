
// import React, { useState } from "react";
// import { useNavigate, useLocation } from 'react-router-dom';
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
// import Header from "../../Home/js/Header";
// import Footer from "../../Home/js/Footer";
// import Interview_chart from "./Interview_chart";
// import STTResult from "./STTResult";

// function Interview_result() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { accumulatedEmotions, answers, kakaoId, nickname } = location.state || {};
//   const [evaluations, setEvaluations] = useState([]); // 평가 데이터 상태 추가
//   const [emotionFeedback, setEmotionFeedback] = useState('');

//   const handleSave = () => {
//     const interviewData = {
//       kakaoId,
//       nickname,
//       questionsAndAnswers: evaluations, // 평가 데이터 포함
//       accumulatedEmotions,
//       emotionFeedback,  
//       createdAt: new Date().toISOString()
//     };

//     const jsonString = JSON.stringify(interviewData, null, 2);
//     const blob = new Blob([jsonString], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'interview_result.json';
//     link.click();

//     URL.revokeObjectURL(url);
//     alert("JSON 파일이 저장되었습니다.");
//   };

//   const goToMainPage = () => {
//     navigate('/');
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <Header />
//       <div style={{ flex: 1 }}>
//         <STTResult answers={answers} onEvaluations={setEvaluations} />
        
//         <Interview_chart accumulatedEmotions={accumulatedEmotions} onEmotionFeedback={setEmotionFeedback} />

//         <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSave}
//             sx={{ padding: '20px 20px', fontSize: '16px' }}
//           >
//             JSON 파일로 저장하기
//           </Button>
//           <Button
//             variant="outlined"
//             color="secondary"
//             onClick={goToMainPage}
//             sx={{ padding: '10px 20px', fontSize: '16px' }}
//           >
//             메인 페이지로 이동
//           </Button>
//         </Stack>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default Interview_result;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Header from "../../Home/js/Header";
import Footer from "../../Home/js/Footer";
import Interview_chart from "./Interview_chart";
import STTResult from "./STTResult";

function Interview_result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accumulatedEmotions, answers, kakaoId, nickname } = location.state || {};
  const [evaluations, setEvaluations] = useState([]);
  const [emotionFeedback, setEmotionFeedback] = useState('');

  const handleSave = async () => {
    // answer 필드가 비어있는 경우 기본 메시지 설정
    const prepareAnswers = answers.map((answer) => ({
      ...answer,
      answer: answer.answer || "No answer provided",
    }));
  
    const interviewData = {
      kakaoId,
      nickname,
      questionsAndAnswers: prepareAnswers,  // 업데이트된 answers 배열
      accumulatedEmotions,
      emotionFeedback,
      createdAt: new Date().toISOString(),
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/interview/save', interviewData);
      console.log("Data saved to DB:", response.data);
      alert("결과가 데이터베이스에 저장되었습니다.");
    } catch (error) {
      console.error("Failed to save data to DB:", error);
      alert("데이터베이스 저장에 실패했습니다.");
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
            데이터베이스에 저장하기
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
