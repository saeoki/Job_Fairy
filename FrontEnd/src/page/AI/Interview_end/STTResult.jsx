// import React, { useEffect, useState } from 'react';
// import { Card, CardContent, Typography, Box } from '@mui/material';
// import { evaluateInterviewIndividually } from './openaiAPI'; 

// function STTResult({ answers }) {
//   const [evaluations, setEvaluations] = useState([]); 
//   const [loading, setLoading] = useState(false);      
//   const [error, setError] = useState(null);           

//   useEffect(() => {
//     const evaluateAnswers = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const evaluationResult = await evaluateInterviewIndividually(answers); 
//         setEvaluations(evaluationResult); 
//       } catch (err) {
//         setError('Evaluation failed.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (answers && answers.length > 0) {
//       evaluateAnswers(); 
//     }
//   }, [answers]);

//   return (
//     <Box className="stt-result-container" display="flex" justifyContent="center" mt={3} px={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
//       <Card 
//         className="stt-result-card" 
//         sx={{ 
//           width: '80%', 
//           maxWidth: { xs: '100%', sm: '80%', md: '70%', lg: '60%' }, // 반응형 너비 설정
//           boxShadow: 3 
//         }}
//       >
//         <CardContent 
//           sx={{ 
//             maxHeight: '500px',
//             overflowY: 'auto'  
//           }}
//         >
//           {loading ? (
//             <Typography variant="body1" color="text.secondary">
//               평가 중입니다...
//             </Typography>
//           ) : error ? (
//             <Typography variant="body1" color="error">
//               {error}
//             </Typography>
//           ) : evaluations && evaluations.length > 0 ? (
//             evaluations.map((evaluation, index) => (
//               <Box key={index} mb={3}>
//                 <Typography variant="body1" component="div" gutterBottom>
//                   {`질문 ${index + 1}: ${evaluation.question}`}
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary" gutterBottom>
//                   답변: {evaluation.answer ? evaluation.answer : "No transcription available."}
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary" gutterBottom>
//                   평가: {evaluation.evaluation ? evaluation.evaluation : "평가 중..."}
//                 </Typography>
//               </Box>
//             ))
//           ) : (
//             <Typography variant="body1" color="text.secondary">
//               No questions and answers available.
//             </Typography>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// export default STTResult;
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { evaluateInterviewIndividually } from './openaiAPI'; 

function STTResult({ answers, onEvaluations }) { // onEvaluations prop 추가
  const [evaluations, setEvaluations] = useState([]); 
  const [loading, setLoading] = useState(false);      
  const [error, setError] = useState(null);           

  useEffect(() => {
    const evaluateAnswers = async () => {
      setLoading(true);
      setError(null);
      try {
        const evaluationResult = await evaluateInterviewIndividually(answers); 
        setEvaluations(evaluationResult); 
        onEvaluations(evaluationResult); // 평가 완료 시 상위 컴포넌트로 전달
      } catch (err) {
        setError('Evaluation failed.');
      } finally {
        setLoading(false);
      }
    };

    if (answers && answers.length > 0) {
      evaluateAnswers(); 
    }
  }, [answers, onEvaluations]);

  return (
    <Box className="stt-result-container" display="flex" justifyContent="center" mt={3} px={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
      <Card 
        className="stt-result-card" 
        sx={{ 
          width: '80%', 
          maxWidth: { xs: '100%', sm: '80%', md: '70%', lg: '60%' },
          boxShadow: 3 
        }}
      >
        <CardContent 
          sx={{ 
            maxHeight: '500px',
            overflowY: 'auto'  
          }}
        >
          {loading ? (
            <Typography variant="body1" color="text.secondary">
              평가 중입니다...
            </Typography>
          ) : error ? (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          ) : evaluations && evaluations.length > 0 ? (
            evaluations.map((evaluation, index) => (
              <Box key={index} mb={3}>
                <Typography variant="body1" component="div" gutterBottom>
                  {`질문 ${index + 1}: ${evaluation.question}`}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  답변: {evaluation.answer || "No transcription available."}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  평가: {evaluation.evaluation || "평가 중..."}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              No questions and answers available.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default STTResult;
