// ControlButtons.js
import React from 'react';
import Button from '@mui/material/Button';

function ControlButtons({ isInterviewStarted, isAnsweringTime, onStartInterview, onStopInterview, onStartAnswering, onCompleteAnswering }) {
  return (
    <div className="button-box">
      {!isInterviewStarted ? (
        <Button className="return-button" variant="contained" onClick={onStartInterview}>
          면접 시작
        </Button>
      ) : (
        <Button className="return-button" variant="contained" onClick={onStopInterview}>
          면접 종료
        </Button>
      )}

      {isInterviewStarted && (
        <Button
          className="return-button"
          variant="contained"
          onClick={isAnsweringTime ? onCompleteAnswering : onStartAnswering}
        >
          {isAnsweringTime ? '답변 완료' : '답변 시작'}
        </Button>
      )}
    </div>
  );
}

export default ControlButtons;
