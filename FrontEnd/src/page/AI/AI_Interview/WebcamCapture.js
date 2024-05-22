import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import '../css/checkcammic.css'; // CSS 파일 import
import LinearProgress from '@mui/material/LinearProgress'; // Progress Bar 컴포넌트 import

const videoConstraints = {
    video: true,
    audio: true
};

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [volume, setVolume] = useState(0); // 마이크 음량 상태
  const [interviewStarted, setInterviewStarted] = useState(false); // 면접 시작 여부 상태
  const [emotion, setEmotion] = useState(null); // 감정 상태
  const [captureInterval, setCaptureInterval] = useState(null); // 이미지 캡처 간격 타이머 상태

  useEffect(() => {
    const requestUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setupAudioAnalyzer(stream); // 오디오 분석기 설정
      } catch (err) {
        console.error('Error accessing user media:', err);
      }
    };

    requestUserMedia();
  }, []);

  const setupAudioAnalyzer = stream => {
    const audioContext = new AudioContext();
    const audioStream = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    audioStream.connect(analyzer);

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    
    const updateVolume = () => {
      analyzer.getByteFrequencyData(dataArray);
      const total = dataArray.reduce((acc, val) => acc + val, 0);
      const average = total / dataArray.length;
      setVolume(average);
      requestAnimationFrame(updateVolume);
    };

    updateVolume();
  };

  const captureAndSend = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    try {
      const formData = new FormData();
      const blob = await fetch(imageSrc).then(res => res.blob());
      formData.append('image', blob, 'webcam.jpg');

      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data); // 서버에서 반환된 결과를 콘솔에 출력
      setEmotion(response.data.prediction); // 감정 값을 설정

    } catch (error) {
      console.error('Error during prediction:', error);
    }
  };

  const startInterview = () => {
    setInterviewStarted(true);
    const intervalId = setInterval(captureAndSend, 1000); // 5초마다 이미지 캡처 및 감정 분석
    setCaptureInterval(intervalId);
  };

  const endInterview = () => {
    setInterviewStarted(false);
    clearInterval(captureInterval); // 면접 종료 시 타이머 정지
  };

  return (
    <div className="CheckCamMic-box">
      <Webcam
        audio={true}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={videoConstraints.width}
        height={videoConstraints.height}
        videoConstraints={videoConstraints}
      />
      <div className="gauge-box">
        <div className="icon-progress-container">
          {/* 마이크 음량 표시 */}
          <LinearProgress variant="determinate" value={volume} className="gauge-progress" />          
        </div>
      </div>
      <div className="button-box">
        {/* 캡처 버튼 */}
        {interviewStarted ? (
          <button className="capture-button" onClick={endInterview}>면접 종료</button>
        ) : (
          <button className="capture-button" onClick={startInterview}>면접 시작</button>
        )}
      </div>
      {emotion && (
        <div>
          <h2>감정 분석 결과:</h2>
          <p>감정: {emotion}</p>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
