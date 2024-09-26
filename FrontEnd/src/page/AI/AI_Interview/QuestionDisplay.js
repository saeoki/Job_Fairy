import React, { useState, useEffect } from 'react';
import './QuestionDisplay.css'; // 별도의 CSS 파일에서 스타일을 관리

function QuestionDisplay({ question, isPreparationTime, initialTime, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(initialTime); // 남은 시간 상태

  // 타이머 로직
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp(); // 시간이 다 되면 부모 컴포넌트로 시간 종료 이벤트 전송
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId); // 컴포넌트가 사라질 때 타이머 정리
  }, [timeLeft, onTimeUp]);

  useEffect(() => {
    setTimeLeft(initialTime); // 새로운 질문일 때 타이머 초기화
  }, [initialTime]);

  return (
    <div className="timer-box">
      {question ? (
        <>
          <h2 className="question-text">{question}</h2>
        </>
      ) : (
        <h2 className="question-text">면접을 시작 버튼을 눌러주세요.</h2>
      )}
    </div>
  );
}

export default QuestionDisplay;
