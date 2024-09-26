// import React from "react";
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
//   const { accumulatedEmotions, transcription } = location.state || {};

//   const handleSave = () => {
//     // 저장 로직 추가 (예: 서버에 데이터 전송)
//     console.log("Data saved:", { accumulatedEmotions, transcription });
//     alert("결과가 저장되었습니다.");
//   };

//   const goToMainPage = () => {
//     navigate('/'); // 메인 페이지로 이동
//   };

//   return (
//     <div>
//       <Header />
//       <STTResult transcription={transcription} />
//       <Interview_chart accumulatedEmotions={accumulatedEmotions} />
      
//       <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
//         <Button 
//           variant="contained" 
//           color="primary" 
//           onClick={handleSave}
//           sx={{ padding: '10px 20px', fontSize: '16px' }}
//         >
//           저장하기
//         </Button>
//         <Button 
//           variant="outlined" 
//           color="secondary" 
//           onClick={goToMainPage}
//           sx={{ padding: '10px 20px', fontSize: '16px' }}
//         >
//           메인 페이지로 이동
//         </Button>
//       </Stack>

//       <Footer />
//     </div>
//   );
// }

// export default Interview_result;
import React from "react";
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
  const { accumulatedEmotions, transcription } = location.state || {};

  const handleSave = () => {
    // 저장 로직 추가 (예: 서버에 데이터 전송)
    console.log("Data saved:", { accumulatedEmotions, transcription });
    alert("결과가 저장되었습니다.");
  };

  const goToMainPage = () => {
    navigate('/'); // 메인 페이지로 이동
  };

  return (
    <div>
      <Header />
      <STTResult transcription={transcription} />
      <Interview_chart accumulatedEmotions={accumulatedEmotions} />
      
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}> {/* mt를 4에서 2로 줄임 */}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          sx={{ padding: '10px 20px', fontSize: '16px' }}
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

      <Footer />
    </div>
  );
}

export default Interview_result;
