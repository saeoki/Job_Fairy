import React, { useEffect, useState } from 'react';

function Timer({ initialTime, isRunning, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // 타이머 로직
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return; // 타이머가 실행 중이 아니거나 시간이 끝났으면 종료
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0)); // 1초씩 줄이기
    }, 1000);

    return () => clearInterval(timerId); // 클린업
  }, [isRunning, timeLeft]);

  useEffect(() => {
    setTimeLeft(initialTime); // 초기 타임 설정
  }, [initialTime]);

  // 원형 타이머 설정
  const radius = 50; // 원의 반지름
  const circumference = 2 * Math.PI * radius; // 원의 둘레 계산
  const progress = timeLeft / initialTime; // 남은 시간 비율 계산
  const strokeDashoffset = circumference * (1 - progress); // 원이 줄어드는 비율 계산

  // 투명도와 색상 변화를 위한 변수 설정
  const strokeOpacity = progress; // 시간이 지남에 따라 원이 점점 사라지게
  const color = `blue`; // 원의 기본 색상은 파란색

  return (
    <div className="timer-container" style={{ textAlign: 'center', marginTop: '20px' }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* 배경 원 */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="lightgray"
          strokeWidth="10"
          fill="none"
        />
        {/* 진행 원 */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeOpacity={strokeOpacity} // 투명도 적용
          style={{
            transition: 'stroke-dashoffset 1s linear, stroke-opacity 1s linear',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
        {/* 남은 시간 표시 */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="24"
          fill="black"
        >
          {timeLeft}
        </text>
      </svg>
    </div>
  );
}

export default Timer;
