import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import MicIcon from '@mui/icons-material/Mic';
import axios from 'axios';
import '../css/Body.css';

function Body() {
  const videoRef = useRef(null);
  const constraints = {
    video: true,
    audio: true
  };
  const [volume, setVolume] = useState(0); // 마이크 음량 상태
  const [intervalId, setIntervalId] = useState(null);
  const [accumulatedEmotions, setAccumulatedEmotions] = useState({}); // 누적된 감정값 상태
  const [timeLeft, setTimeLeft] = useState(20); // 타이머 상태 설정 (준비 시간)
  const [questionIndex, setQuestionIndex] = useState(0); // 현재 질문 인덱스
  const [isPreparationTime, setIsPreparationTime] = useState(false); // 준비 시간 상태
  const [isInterviewStarted, setIsInterviewStarted] = useState(false); // 면접 시작 상태
  const [isAnsweringTime, setIsAnsweringTime] = useState(false); // 답변 시간 상태
  const navigate = useNavigate();

  const questions = [
    "1분간 자기 소개를 하세요.",
    "당신의 강점을 말해보세요.",
    "최근에 해결한 문제를 설명해주세요.",
    "팀에서 갈등이 발생했을 때 어떻게 해결했나요?",
    "가장 자랑스러운 성과는 무엇인가요?"
  ];

  useEffect(() => {
    const requestUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
        setupAudioAnalyzer(stream); // 오디오 분석기 설정
      } catch (err) {
        console.error('Error accessing user media:', err);
      }
    };

    requestUserMedia();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  useEffect(() => {
    if (timeLeft > 0 && (isPreparationTime || isAnsweringTime)) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && isPreparationTime) {
      setIsPreparationTime(false);
    } else if (timeLeft === 0 && isAnsweringTime) {
      stopSendingImages();
    }
  }, [timeLeft, isPreparationTime, isAnsweringTime]);

  const handleSuccess = stream => {
    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
    }
  };

  const setupAudioAnalyzer = stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  };

  const sendImageToServer = async () => {
    const image = captureImage();
    const blob = await (await fetch(image)).blob();
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');
    
    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setAccumulatedEmotions(prevState => ({
        ...prevState,
        ...response.data.accumulated_emotions
      })); // 누적된 감정값 상태 설정
    } catch (error) {
      console.error('Error uploading image', error);
    }
  };

  const startPreparation = () => {
    setTimeLeft(20); // 준비 시간 설정
    setIsPreparationTime(true); // 준비 시간 시작
    setIsAnsweringTime(false);
    setQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length); // 다음 질문 설정
  };

  const startAnswering = () => {
    setTimeLeft(60); // 답변 시간 설정
    setIsAnsweringTime(true); // 답변 시간 시작
    const id = setInterval(sendImageToServer, 500); // 1초마다 이미지 캡처 및 전송
    setIntervalId(id);
  };

  const completeAnswering = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsAnsweringTime(false); // 답변 시간 종료
    startPreparation(); // 다음 질문으로 넘어가기 위해 준비 시간 시작
  };

  const startInterview = () => {
    setIsInterviewStarted(true);
    startPreparation(); // 면접 시작 시 준비 시간 시작
  };

  const stopInterview = () => {
    setIsInterviewStarted(false);
    stopSendingImages();
    navigate('/Interview_end', { state: { accumulatedEmotions } }); // 상태를 Interview_end로 전달
  };

  const stopSendingImages = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  return (
    <div className="CheckCamMic-box">
      <video ref={videoRef} autoPlay playsInline className="video-box" />
      <div className="gauge-box">
        <div className="icon-progress-container">
          <MicIcon />
          <LinearProgress variant="determinate" value={volume} className="gauge-progress" />
        </div>
      </div>
      <div className="timer-box">
        <h2>{questions[questionIndex]}</h2>
        <h3>{isPreparationTime ? "준비 시간: " : "답변 시간: "} {timeLeft}초 남음</h3>
      </div>
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
// import React, { useRef, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Button from '@mui/material/Button';
// import LinearProgress from '@mui/material/LinearProgress';
// import MicIcon from '@mui/icons-material/Mic';
// import axios from 'axios';
// import '../css/Body.css';

// function Body() {
//   const videoRef = useRef(null);
//   const constraints = {
//     video: true,
//     audio: true
//   };
//   const [volume, setVolume] = useState(0);
//   const [intervalId, setIntervalId] = useState(null);
//   const [accumulatedEmotions, setAccumulatedEmotions] = useState({});
//   const [timeLeft, setTimeLeft] = useState(20);
//   const [questionIndex, setQuestionIndex] = useState(0);
//   const [isPreparationTime, setIsPreparationTime] = useState(false);
//   const [isInterviewStarted, setIsInterviewStarted] = useState(false);
//   const [isAnsweringTime, setIsAnsweringTime] = useState(false);
//   const [sttResult, setSttResult] = useState('');
//   const navigate = useNavigate();
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   const questions = [
//     "1분간 자기 소개를 하세요.",
//     "당신의 강점을 말해보세요.",
//     "최근에 해결한 문제를 설명해주세요.",
//     "팀에서 갈등이 발생했을 때 어떻게 해결했나요?",
//     "가장 자랑스러운 성과는 무엇인가요?"
//   ];

//   useEffect(() => {
//     const requestUserMedia = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia(constraints);
//         handleSuccess(stream);
//         setupAudioAnalyzer(stream);
//       } catch (err) {
//         console.error('Error accessing user media:', err);
//       }
//     };

//     requestUserMedia();

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [intervalId]);

//   useEffect(() => {
//     if (timeLeft > 0 && (isPreparationTime || isAnsweringTime)) {
//       const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timerId);
//     } else if (timeLeft === 0 && isPreparationTime) {
//       setIsPreparationTime(false);
//     } else if (timeLeft === 0 && isAnsweringTime) {
//       completeAnswering();
//     }
//   }, [timeLeft, isPreparationTime, isAnsweringTime]);

//   const handleSuccess = stream => {
//     const video = videoRef.current;
//     if (video) {
//       video.srcObject = stream;
//     }
//     mediaRecorderRef.current = new MediaRecorder(stream);
//     mediaRecorderRef.current.ondataavailable = (event) => {
//       audioChunksRef.current.push(event.data);
//     };
//   };

//   const setupAudioAnalyzer = stream => {
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     const audioStream = audioContext.createMediaStreamSource(stream);
//     const analyzer = audioContext.createAnalyser();
//     analyzer.fftSize = 256;
//     audioStream.connect(analyzer);

//     const dataArray = new Uint8Array(analyzer.frequencyBinCount);

//     const updateVolume = () => {
//       analyzer.getByteFrequencyData(dataArray);
//       const total = dataArray.reduce((acc, val) => acc + val, 0);
//       const average = total / dataArray.length;
//       setVolume(average);
//       requestAnimationFrame(updateVolume);
//     };

//     updateVolume();
//   };

//   const captureImage = () => {
//     const video = videoRef.current;
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     return canvas.toDataURL('image/jpeg');
//   };

//   const sendImageToServer = async () => {
//     const image = captureImage();
//     const blob = await (await fetch(image)).blob();
//     const formData = new FormData();
//     formData.append('image', blob, 'image.jpg');

//     try {
//       const response = await axios.post('http://localhost:4000/predict', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log(response.data);
//       setAccumulatedEmotions(prevState => ({
//         ...prevState,
//         ...response.data.accumulated_emotions
//       }));
//     } catch (error) {
//       console.error('Error uploading image', error);
//     }
//   };

//   const startPreparation = () => {
//     setTimeLeft(20);
//     setIsPreparationTime(true);
//     setIsAnsweringTime(false);
//     setQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
//   };

//   const startAnswering = () => {
//     setTimeLeft(60);
//     setIsAnsweringTime(true);
//     const id = setInterval(sendImageToServer, 1000);
//     setIntervalId(id);
//     mediaRecorderRef.current.start();
//   };

//   const completeAnswering = async () => {
//     if (intervalId) {
//       clearInterval(intervalId);
//       setIntervalId(null);
//     }
//     setIsAnsweringTime(false);
//     mediaRecorderRef.current.stop();
//     mediaRecorderRef.current.onstop = async () => {
//       const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
//       audioChunksRef.current = [];
//       const formData = new FormData();
//       formData.append('audio', audioBlob, 'audio.wav');
//       try {
//         const response = await axios.post('http://localhost:4000/transcribe', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//         setSttResult(response.data.transcription);
//       } catch (error) {
//         console.error('Error transcribing audio', error);
//       }
//     };
//     startPreparation();
//   };

//   const startInterview = () => {
//     setIsInterviewStarted(true);
//     startPreparation();
//   };

//   const stopInterview = () => {
//     setIsInterviewStarted(false);
//     stopAnswering();
//     navigate('/Interview_end', { state: { accumulatedEmotions, sttResult } });
//   };

//   const stopAnswering = () => {
//     if (intervalId) {
//       clearInterval(intervalId);
//       setIntervalId(null);
//     }
//     mediaRecorderRef.current.stop();
//   };

//   return (
//     <div className="CheckCamMic-box">
//       <video ref={videoRef} autoPlay playsInline className="video-box" />
//       <div className="gauge-box">
//         <div className="icon-progress-container">
//           <MicIcon />
//           <LinearProgress variant="determinate" value={volume} className="gauge-progress" />
//         </div>
//       </div>
//       <div className="timer-box">
//         <h2>{questions[questionIndex]}</h2>
//         <h3>{isPreparationTime ? "준비 시간: " : "답변 시간: "} {timeLeft}초 남음</h3>
//       </div>
//       <div className="button-box">
//         {!isInterviewStarted ? (
//           <Button className="return-button" variant="contained" onClick={startInterview}>
//             면접 시작
//           </Button>
//         ) : (
//           <Button className="return-button" variant="contained" onClick={stopInterview}>
//             면접 종료
//           </Button>
//         )}
//         {isInterviewStarted && (
//           <Button className="return-button" variant="contained" onClick={isAnsweringTime ? completeAnswering : startAnswering}>
//             {isAnsweringTime ? "답변 완료" : "답변 시작"}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Body;
