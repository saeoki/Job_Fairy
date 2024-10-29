// import React, { useEffect, useState } from 'react';
// import { CircularProgress, Box, Typography } from '@mui/material';

// function Timer({ initialTime, isRunning, onTimeUp }) {
//   const [timeLeft, setTimeLeft] = useState(initialTime);

//   // 타이머 로직
//   useEffect(() => {
//     if (!isRunning || timeLeft <= 0) return;
//     const timerId = setInterval(() => {
//       setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0)); // 1초마다 시간 감소
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [isRunning, timeLeft]);

//   useEffect(() => {
//     if (timeLeft === 0) {
//       onTimeUp(); // 시간이 다 되면 부모 컴포넌트로 알림
//     }
//   }, [timeLeft, onTimeUp]);

//   useEffect(() => {
//     setTimeLeft(initialTime); // 새로운 타이머 시작 시 초기화
//   }, [initialTime]);

//   const progress = (timeLeft / initialTime) * 100; // 남은 시간에 비례하는 진행률
//   const opacity = progress / 100; // 남은 시간에 비례해 투명도 조정

//   return (
//     <Box position="relative" display="inline-flex">
//       <CircularProgress
//         variant="determinate"
//         value={progress} // 0-100% 사이로 진행률 설정
//         size={120} // 원의 크기
//         thickness={5} // 원의 두께
//         sx={{
//           color: progress > 30 ? 'primary.main' : 'error.main', // 남은 시간에 따라 색상 변화
//           transform: 'rotate(-90deg)', // 시계방향에서 반시계방향으로 회전
//           transition: 'all 1s linear', // 애니메이션 부드럽게 적용
//           opacity: opacity, // 시간이 지나면서 투명해지도록 설정
//         }}
//       />
//       <Box
//         top={0}
//         left={0}
//         bottom={0}
//         right={0}
//         position="absolute"
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//       >
//         <Typography variant="h6" component="div" color="textSecondary">
//           {timeLeft}s
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

// export default Timer;

import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

function Timer({ preparationTime, answerTime, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(preparationTime);
  const [isPreparationTime, setIsPreparationTime] = useState(true); // 준비 시간 상태

  useEffect(() => {
    // 준비 시간이거나 답변 시간이 모두 끝났으면 타이머 종료
    if (timeLeft <= 0) {
      if (isPreparationTime) {
        // 준비 시간이 끝나면 답변 시간으로 전환
        setIsPreparationTime(false);
        setTimeLeft(answerTime); // 답변 시간으로 초기화
      } else {
        // 답변 시간이 끝나면 타이머 종료
        onTimeUp();
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isPreparationTime, answerTime, onTimeUp]);

  const progress = (timeLeft / (isPreparationTime ? preparationTime : answerTime)) * 100;

  return (
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
          {isPreparationTime ? '준비 시간' : '답변 시간'}: {timeLeft}s
        </Typography>
      </Box>
    </Box>
  );
}

export default Timer;
