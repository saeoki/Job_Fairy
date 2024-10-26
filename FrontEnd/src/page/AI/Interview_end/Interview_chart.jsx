// import React, { useEffect, useState } from 'react';
// import { Card, CardContent, Typography, Box } from '@mui/material';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { generateEmotionFeedback } from './evaluateEmotions'; // 감정 평가 로직 import
// import '../css/interview_end.css'; // CSS 파일 import

// // Chart.js 모듈 등록
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// function Interview_chart({ accumulatedEmotions }) {
//   const [emotionFeedback, setEmotionFeedback] = useState(''); // 감정 피드백 상태

//   // 막대 그래프 데이터를 생성하는 함수
//   const generateChartData = (data) => {
//     const labels = Object.keys(data);
//     const values = Object.values(data);

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Emotion Scores',
//           data: values,
//           backgroundColor: 'rgba(75, 192, 192, 0.6)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1,
//         },
//       ],
//     };
//   };

//   // 컴포넌트가 렌더링될 때 감정 피드백을 가져옴
//   useEffect(() => {
//     const fetchEmotionFeedback = async () => {
//       if (accumulatedEmotions && Object.keys(accumulatedEmotions).length > 0) {
//         const feedback = await generateEmotionFeedback(accumulatedEmotions);
//         setEmotionFeedback(feedback);
//       }
//     };
//     fetchEmotionFeedback();
//   }, [accumulatedEmotions]);

//   return (
//     <Box className="interview-results-container">
//       <Card className="interview-results-card">
//         <CardContent>
//           {accumulatedEmotions && Object.keys(accumulatedEmotions).length > 0 ? (
//             <>
//               <Bar data={generateChartData(accumulatedEmotions)} />



//               {/* 감정 평가 메시지 */}
//               <Box mt={2}>
//                 <Typography variant="body2" color="text.secondary">
//                   {emotionFeedback || 'Loading emotion feedback...'}
//                 </Typography>
//               </Box>
//             </>
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               No data available.
//             </Typography>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// export default Interview_chart;
// import React, { useEffect, useState } from 'react';
// import { Card, CardContent, Typography, Box, Divider, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { generateEmotionFeedback } from './evaluateEmotions'; // 감정 평가 로직 import
// import '../css/interview_end.css'; // CSS 파일 import

// // Chart.js 모듈 등록
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// function Interview_chart({ accumulatedEmotions }) {
//   const [emotionFeedback, setEmotionFeedback] = useState(''); // 감정 피드백 상태

//   // 막대 그래프 데이터를 생성하는 함수
//   const generateChartData = (data) => {
//     const labels = Object.keys(data);
//     const values = Object.values(data);

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Emotion Scores',
//           data: values,
//           backgroundColor: 'rgba(75, 192, 192, 0.6)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1,
//         },
//       ],
//     };
//   };

//   // 컴포넌트가 렌더링될 때 감정 피드백을 가져옴
//   useEffect(() => {
//     const fetchEmotionFeedback = async () => {
//       if (accumulatedEmotions && Object.keys(accumulatedEmotions).length > 0) {
//         const feedback = await generateEmotionFeedback(accumulatedEmotions);
//         setEmotionFeedback(feedback);
//       }
//     };
//     fetchEmotionFeedback();
//   }, [accumulatedEmotions]);

//   return (
//     <Box className="interview-results-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
//       <Card className="interview-results-card" sx={{ width: '100%', maxWidth: { xs: '100%', md: 800 }, boxShadow: 3, borderRadius: 2 }}>
//         <CardContent>
//           <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
//             Interview Emotion Analysis
//           </Typography>
//           <Divider sx={{ mb: 2 }} />

//           {/* 감정 점수 막대 그래프 */}
//           <Box sx={{ width: '100%', height: { xs: 250, sm: 300, md: 400 }, mb: 2 }}>
//             <Bar data={generateChartData(accumulatedEmotions)} options={{ responsive: true, maintainAspectRatio: false }} />
//           </Box>

//           {/* 감정 점수 목록 */}
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', mb: 2 }}>
//             {Object.entries(accumulatedEmotions).map(([emotion, score]) => (
//               <Box key={emotion} sx={{ textAlign: 'center', p: 1, minWidth: 80 }}>
//                 <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
//                   {emotion}
//                 </Typography>
//                 <Typography variant="body2">{score.toFixed(2)}</Typography>
//               </Box>
//             ))}
//           </Box>

//           <Divider sx={{ my: 2 }} />

//           {/* 감정 평가 메시지 - 토글 가능한 아코디언 */}
//           <Accordion>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold' }}>
//                 감정분석 평가
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Box sx={{ p: 2, bgcolor: '#f0f4f8', borderRadius: 1 }}>
//                 <Typography variant="body2" color="text.secondary">
//                   {emotionFeedback || <CircularProgress size={20} />}
//                 </Typography>
//               </Box>
//             </AccordionDetails>
//           </Accordion>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// export default Interview_chart;
// Interview_chart.js

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Divider, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { generateEmotionFeedback } from './evaluateEmotions'; // 감정 평가 로직 import
import '../css/interview_end.css'; // CSS 파일 import

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Interview_chart({ accumulatedEmotions, onEmotionFeedback }) {
  const [emotionFeedback, setEmotionFeedback] = useState('');

  // 막대 그래프 데이터를 생성하는 함수
  const generateChartData = (data) => {
    const labels = Object.keys(data);
    const values = Object.values(data);

    return {
      labels,
      datasets: [
        {
          label: 'Emotion Scores',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // 컴포넌트가 렌더링될 때 감정 피드백을 가져옴
  useEffect(() => {
    const fetchEmotionFeedback = async () => {
      if (accumulatedEmotions && Object.keys(accumulatedEmotions).length > 0) {
        const feedback = await generateEmotionFeedback(accumulatedEmotions);
        setEmotionFeedback(feedback);
        onEmotionFeedback(feedback);  // 부모 컴포넌트에 전달
      }
    };
    fetchEmotionFeedback();
  }, [accumulatedEmotions, onEmotionFeedback]);

  return (
    <Box className="interview-results-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
      <Card className="interview-results-card" sx={{ width: '100%', maxWidth: { xs: '100%', md: 800 }, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
            Interview Emotion Analysis
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* 감정 점수 막대 그래프 */}
          <Box sx={{ width: '100%', height: { xs: 250, sm: 300, md: 400 }, mb: 2 }}>
            <Bar data={generateChartData(accumulatedEmotions)} options={{ responsive: true, maintainAspectRatio: false }} />
          </Box>

          {/* 감정 점수 목록 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', mb: 2 }}>
            {Object.entries(accumulatedEmotions).map(([emotion, score]) => (
              <Box key={emotion} sx={{ textAlign: 'center', p: 1, minWidth: 80 }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {emotion}
                </Typography>
                <Typography variant="body2">{score.toFixed(2)}</Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 감정 평가 메시지 - 토글 가능한 아코디언 */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                감정분석 평가
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ p: 2, bgcolor: '#f0f4f8', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {emotionFeedback || <CircularProgress size={20} />}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Interview_chart;
