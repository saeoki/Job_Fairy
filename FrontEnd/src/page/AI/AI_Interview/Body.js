import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import MicIcon from '@mui/icons-material/Mic';
import '../css/Body.css';

function Body() {
  // 비디오 요소에 대한 참조
  const videoRef = useRef(null);
  
  // MediaRecorder 객체에 대한 참조 (오디오 녹음에 사용)
  const mediaRecorderRef = useRef(null);
  
  // 마이크 볼륨 상태 저장
  const [volume, setVolume] = useState(0); 
  
  // 이미지 전송을 위한 인터벌 ID 저장
  const [intervalId, setIntervalId] = useState(null);
  
  // 감정 상태 저장 (서버에서 받은 감정값 누적)
  const [accumulatedEmotions, setAccumulatedEmotions] = useState({});
  
  // 음성 인식 결과 (STT) 저장
  const [transcription, setTranscription] = useState("");
  
  // 타이머 상태 (준비 시간)
  const [timeLeft, setTimeLeft] = useState(20);
  
  // 현재 질문 인덱스 상태
  const [questionIndex, setQuestionIndex] = useState(0);
  
  // 준비 시간 상태 저장
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  
  // 면접 시작 상태 저장
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  
  // 답변 시간 상태 저장
  const [isAnsweringTime, setIsAnsweringTime] = useState(false);
  
  // 녹음 상태 저장
  const [isRecording, setIsRecording] = useState(false);
  
  // WebSocket 객체에 대한 참조
  const socketRef = useRef(null);
  
  // React Router의 navigate 함수
  const navigate = useNavigate();
  
  // 질문 목록 (면접 질문 리스트)
  const questions = [
    "1분간 자기 소개를 하세요.",
    "당신의 강점을 말해보세요.",
    "최근에 해결한 문제를 설명해주세요.",
    "팀에서 갈등이 발생했을 때 어떻게 해결했나요?",
    "가장 자랑스러운 성과는 무엇인가요?"
  ];

  // 컴포넌트가 처음 렌더링될 때 실행 (마이크/카메라 스트림 설정)
  useEffect(() => {
    const requestUserMedia = async () => {
      try {
        // 마이크 및 카메라 스트림 요청
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: {
            sampleRate: 16000, // 샘플레이트 설정
            echoCancellation: true, // 에코 제거
            noiseSuppression: true, // 노이즈 억제
            autoGainControl: true, // 자동 게인 조정
          },
        });
        // 비디오 스트림 성공적으로 받아오면 처리
        handleSuccess(stream);
        // 오디오 분석기 설정 (마이크 볼륨 분석)
        setupAudioAnalyzer(stream); 
      } catch (err) {
        // 스트림 요청 실패 시 에러 처리
        console.error('Error accessing user media:', err);
      }
    };

    // 사용자 미디어 요청
    requestUserMedia();

    // 컴포넌트가 언마운트될 때 인터벌 클리어
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  // WebSocket 연결 설정
  useEffect(() => {
    // WebSocket 서버에 연결
    socketRef.current = new WebSocket('ws://localhost:5001');
    
    // 서버로부터 메시지를 받을 때 처리
    socketRef.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      // STT 결과가 있을 경우 화면에 표시
      if (data.transcription) {
        setTranscription(prev => prev + " " + data.transcription);
      }
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 닫기
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  // 타이머 관리 (준비/답변 시간)
  useEffect(() => {
    if (timeLeft > 0 && (isPreparationTime || isAnsweringTime)) {
      // 1초마다 타이머 감소
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && isPreparationTime) {
      // 준비 시간이 끝나면 답변 시작
      startAnswering();
    } else if (timeLeft === 0 && isAnsweringTime) {
      // 답변 시간이 끝나면 답변 완료 처리
      completeAnswering();
    }
  }, [timeLeft, isPreparationTime, isAnsweringTime]);

  // 스트림을 비디오 요소에 연결
  const handleSuccess = stream => {
    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
      video.muted = true;  // 비디오 오디오 출력을 비활성화
    }
  };

  // 오디오 분석기 설정 (마이크 볼륨 분석)
  const setupAudioAnalyzer = stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioStream = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256; // 분석 FFT 크기
    audioStream.connect(analyzer);

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    
    // 볼륨 업데이트 함수 (주기적으로 실행)
    const updateVolume = () => {
      analyzer.getByteFrequencyData(dataArray);
      const total = dataArray.reduce((acc, val) => acc + val, 0);
      const average = total / dataArray.length; // 평균 볼륨 계산
      setVolume(average); // 볼륨 상태 업데이트
      requestAnimationFrame(updateVolume); // 주기적 호출
    };

    updateVolume();
  };

  // 비디오에서 이미지 캡처
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; // 비디오 너비
    canvas.height = video.videoHeight; // 비디오 높이
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg'); // 이미지 데이터를 JPEG로 반환
  };

  // 서버로 이미지 전송
  const sendImageToServer = async () => {
    const image = captureImage();
    const blob = await (await fetch(image)).blob(); // 캡처된 이미지 블랍으로 변환
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');
    
    try {
      // 이미지 서버로 전송
      const response = await axios.post('http://localhost:5003/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // 서버로부터 받은 감정값을 누적
      setAccumulatedEmotions(prevState => ({
        ...prevState,
        ...response.data.accumulated_emotions
      }));
    } catch (error) {
      console.error('Error uploading image', error);
    }
  };

  // 녹음 시작 (오디오 스트림을 WebSocket을 통해 서버로 전송)
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 16000, // 샘플레이트 설정
        echoCancellation: true, // 에코 제거
        noiseSuppression: true, // 노이즈 억제
        autoGainControl: true, // 자동 게인 조정
      },

    });
    // MediaRecorder 객체로 오디오 스트림 녹음
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' });

    // 오디오 데이터를 주기적으로 WebSocket을 통해 서버로 전송
    mediaRecorderRef.current.ondataavailable = event => {
      if (event.data.size > 0 && socketRef.current) {
        socketRef.current.send(event.data); 
      }
    };

    // 1초마다 데이터를 전송
    mediaRecorderRef.current.start(1000); 
    setIsRecording(true);
  };

  // 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // 녹음 중지
      setIsRecording(false); // 녹음 상태 변경
    }
  };

  // 준비 시간 시작 (다음 질문으로 이동)
  const startPreparation = () => {
    setTimeLeft(8); // 8초 준비 시간 설정
    setIsPreparationTime(true); 
    setIsAnsweringTime(false);
    setQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length); // 다음 질문
  };

  // 답변 시간 시작 (녹음 및 이미지 캡처 시작)
  const startAnswering = () => {
    setTimeLeft(45); // 45초 답변 시간 설정
    setIsAnsweringTime(true); 
    setIsPreparationTime(false); 
    startRecording(); // 녹음 시작
    const id = setInterval(sendImageToServer, 500); // 0.5초마다 이미지 전송
    setIntervalId(id);
  };

  // 답변 완료 처리 (녹음 및 이미지 전송 중지)
  const completeAnswering = () => {
    stopSendingImages(); // 이미지 전송 중지
    stopRecording(); // 녹음 중지
    if (questionIndex === questions.length - 1) {
      stopInterview(); // 모든 질문이 끝나면 면접 종료
    } else {
      startPreparation(); // 다음 질문 준비
    }
  };

  // 면접 시작 (준비 시간부터 시작)
  const startInterview = () => {
    setIsInterviewStarted(true);
    startPreparation(); 
  };

  // 면접 종료 (녹음 및 이미지 전송 중지, 결과 페이지로 이동)
  const stopInterview = () => {
    setIsInterviewStarted(false);
    stopSendingImages();
    stopRecording();
    // 누적된 감정 상태와 STT 결과를 전달하며 결과 페이지로 이동
    navigate('/Interview_result', { state: { accumulatedEmotions, transcription } }); 
  };

  // 이미지 전송 중지
  const stopSendingImages = () => {
    if (intervalId) {
      clearInterval(intervalId); // 주기적인 이미지 전송 중지
      setIntervalId(null);
    }
  };

  // UI 렌더링
  return (
    <div className="CheckCamMic-box">
      {/* 비디오 스트림을 보여주는 비디오 요소 */}
      <video ref={videoRef} autoPlay playsInline className="video-box" />
      
      {/* 타이머 UI */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant="determinate" value={(timeLeft / 45) * 100} size={80} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" component="div" color="textSecondary">
              {timeLeft}s
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 마이크 볼륨 게이지 */}
      <div className="gauge-box">
        <div className="icon-progress-container">
          <MicIcon />
          <LinearProgress variant="determinate" value={volume} className="gauge-progress" />
        </div>
      </div>
      
      {/* 질문 및 타이머 상태 표시 */}
      <div className="timer-box">
        <h2>{questions[questionIndex]}</h2>
        <h3>{isPreparationTime ? "준비 시간: " : "답변 시간: "} {timeLeft}초 남음</h3>
      </div>

      {/* 면접 시작/종료 버튼 */}
      <div className="button-box">
        {!isInterviewStarted ? (
          <Button className="return-button" variant="contained" onClick={startInterview}>
            면접 시작
          </Button>
        ) : (
          <Button className="return-button" variant="contained" onClick={stopInterview}>
            면접 종료
          </Button>
        )}

        {/* 답변 시작/완료 버튼 */}
        {isInterviewStarted && (
          <Button className="return-button" variant="contained" onClick={isAnsweringTime ? completeAnswering : startAnswering}>
            {isAnsweringTime ? "답변 완료" : "답변 시작"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default Body;
