import React from 'react';
import Button from '@mui/material/Button';
import './ControlButtons.css';

function ControlButtons({ isInterviewStarted, isAnsweringTime, onStartInterview, onStopInterview, onStartAnswering, onCompleteAnswering }) {
  return (
    <div className="control-buttons">
      {isInterviewStarted && (
        <Button variant="outlined" color="error" onClick={onStopInterview} className="control-button">
          면접 종료
        </Button>
      )}
      {!isInterviewStarted ? (
        <Button variant="contained" color="primary" onClick={onStartInterview} className="control-button">
          면접 시작
        </Button>
      ) : isAnsweringTime ? (
        <Button variant="contained" color="primary" onClick={onCompleteAnswering} className="control-button">
          답변 완료
        </Button>
        
      ) : (
        <Button variant="contained" color="primary" onClick={onStartAnswering} className="control-button">
          답변 시작
        </Button>
      )}
    </div>
  );
}

export default ControlButtons;
