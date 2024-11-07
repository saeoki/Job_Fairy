

// import React, { useState, useEffect } from 'react';
// import { CircularProgress, Box, Typography } from '@mui/material';
// import './QuestionDisplay.css';

// function QuestionDisplay({
//   question,
//   isPreparationTime,
//   preparationTime,
//   answerTime,
//   onTimeUp,
//   onStartAnswering,
//   isInterviewFinished,
// }) {
//   const [timeLeft, setTimeLeft] = useState(isPreparationTime ? preparationTime : answerTime);
//   const [hasTimeUpTriggered, setHasTimeUpTriggered] = useState(false);

//   useEffect(() => {
//     console.log('QuestionDisplay preparation time changed', {
//       isPreparationTime,
//       preparationTime,
//       answerTime,
//     });
//     setTimeLeft(isPreparationTime ? preparationTime : answerTime);
//     setHasTimeUpTriggered(false);
//   }, [isPreparationTime, preparationTime, answerTime]);

//   useEffect(() => {
//     if (isInterviewFinished || timeLeft <= 0) {
//       if (
//         timeLeft <= 0 &&
//         !hasTimeUpTriggered &&
//         !isPreparationTime &&
//         typeof onTimeUp === 'function'
//       ) {
//         onTimeUp(); // 답변 시간이 종료되었을 때만 호출
//         setHasTimeUpTriggered(true);
//       }
//       return;
//     }
  
//     const timerId = setInterval(() => {
//       setTimeLeft((prevTime) => {
//         if (prevTime <= 1) {
//           clearInterval(timerId);
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);
  
//     return () => clearInterval(timerId);
//     }, [isInterviewFinished, isPreparationTime, hasTimeUpTriggered]);
  

//     if (timeLeft <= 0 && isPreparationTime && typeof onStartAnswering === 'function') {
//       console.log('Preparation time ended, calling onStartAnswering');
//       onStartAnswering();
//     }
//   }, [timeLeft, isPreparationTime, onStartAnswering]);

//   const progress =
//     (timeLeft / (isPreparationTime ? preparationTime : answerTime)) * 100;

//   return (
//     <div className="question-timer-container">
//       {isInterviewFinished ? null : (
//         <>
//           <Typography variant="h6" className="question-text">
//             {isPreparationTime ? (
//               <>
//                 준비 시간입니다.
//                 <br />
//                 {question}
//               </>
//             ) : (
//               question || '질문이 없습니다.'
//             )}
//           </Typography>
//           <div className="timer-box">
//             <Box position="relative" display="inline-flex">
//               <CircularProgress
//                 variant="determinate"
//                 value={progress}
//                 size={120}
//                 thickness={5}
//                 sx={{
//                   color: progress > 30 ? 'primary.main' : 'error.main',
//                   transform: 'rotate(-90deg)',
//                 }}
//               />
//               <Box
//                 top={0}
//                 left={0}
//                 bottom={0}
//                 right={0}
//                 position="absolute"
//                 display="flex"
//                 alignItems="center"
//                 justifyContent="center"
//               >
//                 <Typography variant="h6" component="div" color="textSecondary">
//                   {timeLeft}s
//                 </Typography>
//               </Box>
//             </Box>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default QuestionDisplay;

import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import './QuestionDisplay.css';

function QuestionDisplay({
  question,
  isPreparationTime,
  preparationTime,
  answerTime,
  onTimeUp,
  onStartAnswering,
  isInterviewFinished,
}) {
  const [timeLeft, setTimeLeft] = useState(isPreparationTime ? preparationTime : answerTime);
  const [hasTimeUpTriggered, setHasTimeUpTriggered] = useState(false);

  useEffect(() => {
    console.log('QuestionDisplay preparation time changed', {
      isPreparationTime,
      preparationTime,
      answerTime,
    });
    setTimeLeft(isPreparationTime ? preparationTime : answerTime);
    setHasTimeUpTriggered(false);
  }, [isPreparationTime, preparationTime, answerTime]);

  useEffect(() => {
    if (isInterviewFinished || timeLeft <= 0) {
      if (
        timeLeft <= 0 &&
        !hasTimeUpTriggered &&
        !isPreparationTime &&
        typeof onTimeUp === 'function'
      ) {
        onTimeUp(); // 답변 시간이 종료되었을 때만 호출
        setHasTimeUpTriggered(true);
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isInterviewFinished, isPreparationTime, hasTimeUpTriggered]);

  // 여기서 useEffect를 추가해야 합니다.
  useEffect(() => {
    if (timeLeft <= 0 && isPreparationTime && typeof onStartAnswering === 'function') {
      console.log('Preparation time ended, calling onStartAnswering');
      onStartAnswering();
    }
  }, [timeLeft, isPreparationTime, onStartAnswering]);

  const progress =
    (timeLeft / (isPreparationTime ? preparationTime : answerTime)) * 100;

  return (
    <div className="question-timer-container">
      {isInterviewFinished ? null : (
        <>
          <Typography variant="h6" className="question-text">
            {isPreparationTime ? (
              <>
                준비 시간입니다.
                <br />
                {question}
              </>
            ) : (
              question || '질문이 없습니다.'
            )}
          </Typography>
          <div className="timer-box">
            <Box position="relative" display="inline-flex">
              <CircularProgress
                variant="determinate"
                value={progress}
                size={120}
                thickness={5}
                sx={{
                  color: progress > 30 ? 'primary.main' : 'error.main',
                  transform: 'rotate(-90deg)',
                }}
              />
              <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="h6" component="div" color="textSecondary">
                  {timeLeft}s
                </Typography>
              </Box>
            </Box>
          </div>
        </>
      )}
    </div>
  );
}

export default QuestionDisplay;
