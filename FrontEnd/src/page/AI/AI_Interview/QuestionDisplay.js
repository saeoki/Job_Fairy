

import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import './QuestionDisplay.css';

function QuestionDisplay({ question, isPreparationTime, preparationTime, answerTime, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(isPreparationTime ? preparationTime : answerTime);

  useEffect(() => {
    setTimeLeft(isPreparationTime ? preparationTime : answerTime);
  }, [isPreparationTime, preparationTime, answerTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const progress = (timeLeft / (isPreparationTime ? preparationTime : answerTime)) * 100;

  return (
    <div className="question-timer-container">
      <Typography variant="h6" className="question-text">
        {isPreparationTime ? "준비 시간입니다." : question || '질문이 없습니다.'}
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
    </div>
  );
}

export default QuestionDisplay;
