
// import React, { useState, useRef, useEffect } from 'react';
// import VideoStream from './VideoStream';
// import AudioRecorder from './AudioRecorder';
// import EmotionAnalyzer from './EmotionAnalyzer';
// import VolumeMeter from './VolumeMeter';
// import Timer from './Timer';
// import QuestionDisplay from './QuestionDisplay';
// import ControlButtons from './ControlButtons';
// import { useNavigate, useLocation } from 'react-router-dom';

// function Body() {
//   const location = useLocation();
//   const { isPersonalityInterviewChecked, isTechnicalInterviewChecked, selectedJob } = location.state || {};

//   const videoRef = useRef(null);
//   const socketRef = useRef(null);
//   const [videoStream, setVideoStream] = useState(null);
//   const [audioStream, setAudioStream] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);

//   const [isEmotionAnalyzing, setIsEmotionAnalyzing] = useState(false);
//   const [transcription, setTranscription] = useState('');
//   const [answers, setAnswers] = useState([]);
//   const [accumulatedEmotions, setAccumulatedEmotions] = useState({});

//   const [questions, setQuestions] = useState([]);
//   const [questionIndex, setQuestionIndex] = useState(-1);
//   const [isInterviewStarted, setIsInterviewStarted] = useState(false);
//   const [isAnsweringTime, setIsAnsweringTime] = useState(false);
//   const [isPreparationTime, setIsPreparationTime] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [isTimerRunning, setIsTimerRunning] = useState(false);
//   const navigate = useNavigate();

//   // 질문 로드
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       let combinedQuestions = [];
  
//       if (isPersonalityInterviewChecked) {
//         try {
//           const response = await fetch('/questions/personality_questions.json');
//           const data = await response.json();
//           combinedQuestions = [...combinedQuestions, ...data];
//         } catch (error) {
//           console.error('Error fetching personality questions:', error);
//         }
//       }
  
//       if (isTechnicalInterviewChecked && selectedJob) {
//         try {
//           const response = await fetch(`/questions/technical_questions_${selectedJob}.json`);
//           const data = await response.json();
//           combinedQuestions = [...combinedQuestions, ...data];
//         } catch (error) {
//           console.error(`Error fetching technical questions for ${selectedJob}:`, error);
//         }
//       }
  
//       const questionCount = (isPersonalityInterviewChecked && isTechnicalInterviewChecked) ? 10 : 5;
//       const randomQuestions = getRandomQuestions(combinedQuestions, questionCount);
//       setQuestions(randomQuestions);
//     };
  
//     fetchQuestions();
//   }, [isPersonalityInterviewChecked, isTechnicalInterviewChecked, selectedJob]);
  
//   // 랜덤 질문 선택 함수
//   const getRandomQuestions = (questions, count) => {
//     const shuffled = [...questions].sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, count);
//   };

//   // 답변 저장 함수
//   const saveAnswer = () => {
//     setAnswers((prevAnswers) => [
//       ...prevAnswers,
//       { question: questions[questionIndex], answer: transcription }
//     ]);
//     setTranscription('');
//   };

//   // 미디어 스트림 설정
//   useEffect(() => {
//     const requestUserMedia = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: {
//             echoCancellation: true,
//             noiseSuppression: true,
//             autoGainControl: true,
//           },
//         });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.muted = true;
//         }
//         setVideoStream(stream);

//         const audioTracks = stream.getAudioTracks();
//         const audioOnlyStream = new MediaStream(audioTracks);
//         setAudioStream(audioOnlyStream);
//       } catch (err) {
//         console.error('Error accessing user media:', err);
//       }
//     };

//     requestUserMedia();

//     // 클린업
//     return () => {
//       if (videoStream) {
//         videoStream.getTracks().forEach((track) => track.stop());
//       }
//       if (audioStream) {
//         audioStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   // WebSocket 설정
//   useEffect(() => {
//     socketRef.current = new WebSocket('ws://localhost:5000');
//     socketRef.current.binaryType = 'arraybuffer';

//     socketRef.current.onopen = () => {
//       console.log('WebSocket connection established');
//     };

//     socketRef.current.onmessage = (message) => {
//       const data = JSON.parse(message.data);
//       if (data.transcription) {
//         setTranscription((prev) => prev + ' ' + data.transcription);
//       }
//     };

//     socketRef.current.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//     };
//   }, []);

//   // 타이머 로직
//   useEffect(() => {
//     let timerId;
//     if (isTimerRunning && timeLeft > 0) {
//       timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//     } else if (timeLeft === 0) {
//       if (isPreparationTime) {
//         startAnswering();
//       } else if (isAnsweringTime) {
//         completeAnswering();
//       }
//     }
//     return () => {
//       if (timerId) {
//         clearTimeout(timerId);
//       }
//     };
//   }, [timeLeft, isTimerRunning, isPreparationTime, isAnsweringTime]);

//   // 면접 준비 시작
//   const startPreparation = () => {
//     setQuestionIndex((prevIndex) => prevIndex + 1);
//     setIsPreparationTime(true);
//     setIsAnsweringTime(false);
//     setTimeLeft(8);
//     setIsTimerRunning(true);
//   };

//   // 답변 시작
//   const startAnswering = () => {
//     setIsPreparationTime(false);
//     setIsAnsweringTime(true);
//     setTimeLeft(45);
//     setIsTimerRunning(true);
//     setIsRecording(true);
//     setIsEmotionAnalyzing(true);
//   };

//   // 답변 완료
//   const completeAnswering = () => {
//     saveAnswer();
//     setIsRecording(false);
//     setIsEmotionAnalyzing(false);
//     setIsTimerRunning(false);
//     setIsAnsweringTime(false);
//     if (questionIndex >= questions.length - 1) {
//       stopInterview();
//     } else {
//       startPreparation();
//     }
//   };

//   // 면접 시작
//   const startInterview = () => {
//     if (questions.length === 0) {
//       alert('선택한 옵션에 해당하는 질문이 없습니다.');
//       return;
//     }
//     setIsInterviewStarted(true);
//     startPreparation();
//   };

//   // 면접 종료
//   const stopInterview = () => {
//     setIsInterviewStarted(false);
//     setIsRecording(false);
//     setIsEmotionAnalyzing(false);
    
//     navigate('/Interview_result', { state: { accumulatedEmotions, answers } });
//     setAccumulatedEmotions({});
//     setAnswers([]);
//   };

//   // 시간 초과 시 처리
//   const handleTimeUp = () => {
//     if (isPreparationTime) {
//       startAnswering();
//     } else if (isAnsweringTime) {
//       completeAnswering();
//     }
//   };

//   // 감정 데이터 업데이트
//   const handleEmotionData = (data) => {
//     setAccumulatedEmotions((prevState) => ({
//       ...prevState,
//       ...data,
//     }));
//   };

//   return (
//     <div className="CheckCamMic-box">
//       <VideoStream videoRef={videoRef} />
//       {audioStream && <VolumeMeter audioStream={audioStream} />}
//       {videoRef.current && (
//         <EmotionAnalyzer
//           videoRef={videoRef}
//           isActive={isEmotionAnalyzing}
//           onEmotionData={handleEmotionData}
//         />
//       )}
//       {audioStream && (
//         <AudioRecorder
//           isRecording={isRecording}
//           socketRef={socketRef}
//           audioStream={audioStream}
//         />
//       )}
//       <Timer initialTime={timeLeft} isRunning={isTimerRunning} onTimeUp={handleTimeUp} />
//       <QuestionDisplay
//         question={questions[questionIndex]}
//         isPreparationTime={isPreparationTime}
//         timeLeft={timeLeft}
//       />
//       <ControlButtons
//         isInterviewStarted={isInterviewStarted}
//         isAnsweringTime={isAnsweringTime}
//         onStartInterview={startInterview}
//         onStopInterview={stopInterview}
//         onStartAnswering={startAnswering}
//         onCompleteAnswering={completeAnswering}
//       />
//     </div>
//   );
// }

// export default Body;
import React, { useState, useRef, useEffect } from 'react';
import VideoStream from './VideoStream';
import AudioRecorder from './AudioRecorder';
import EmotionAnalyzer from './EmotionAnalyzer';
import VolumeMeter from './VolumeMeter';
import Timer from './Timer';
import QuestionDisplay from './QuestionDisplay';
import ControlButtons from './ControlButtons';
import { useNavigate, useLocation } from 'react-router-dom';

function Body() {
  const location = useLocation();
  const { isPersonalityInterviewChecked, isTechnicalInterviewChecked, selectedJob } = location.state || {};

  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [videoStream, setVideoStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const [isEmotionAnalyzing, setIsEmotionAnalyzing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [answers, setAnswers] = useState([]);
  const [accumulatedEmotions, setAccumulatedEmotions] = useState({});

  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isAnsweringTime, setIsAnsweringTime] = useState(false);
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      let combinedQuestions = [];
  
      if (isPersonalityInterviewChecked) {
        try {
          const response = await fetch('/questions/personality_questions.json');
          const data = await response.json();
          combinedQuestions = [...combinedQuestions, ...data];
        } catch (error) {
          console.error('Error fetching personality questions:', error);
        }
      }
  
      if (isTechnicalInterviewChecked && selectedJob) {
        try {
          const response = await fetch(`/questions/technical_questions_${selectedJob}.json`);
          const data = await response.json();
          combinedQuestions = [...combinedQuestions, ...data];
        } catch (error) {
          console.error(`Error fetching technical questions for ${selectedJob}:`, error);
        }
      }
  
      const questionCount = (isPersonalityInterviewChecked && isTechnicalInterviewChecked) ? 10 : 5;
      const randomQuestions = getRandomQuestions(combinedQuestions, questionCount);
      setQuestions(randomQuestions);
    };
  
    fetchQuestions();
  }, [isPersonalityInterviewChecked, isTechnicalInterviewChecked, selectedJob]);

  const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const saveAnswer = () => {
    setAnswers((prevAnswers) => [
      ...prevAnswers,
      { question: questions[questionIndex], answer: transcription }
    ]);
    setTranscription('');
  };

  useEffect(() => {
    const requestUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
        }
        setVideoStream(stream);

        const audioTracks = stream.getAudioTracks();
        const audioOnlyStream = new MediaStream(audioTracks);
        setAudioStream(audioOnlyStream);
      } catch (err) {
        console.error('Error accessing user media:', err);
      }
    };

    requestUserMedia();

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:5000');
    socketRef.current.binaryType = 'arraybuffer';

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    socketRef.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.transcription) {
        setTranscription((prev) => prev + ' ' + data.transcription);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    let timerId;
    if (isTimerRunning && timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      if (isPreparationTime) {
        startAnswering();
      } else if (isAnsweringTime) {
        completeAnswering();
      }
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timeLeft, isTimerRunning, isPreparationTime, isAnsweringTime]);

  const startPreparation = () => {
    setQuestionIndex((prevIndex) => prevIndex + 1);
    setIsPreparationTime(true);
    setIsAnsweringTime(false);
    setTimeLeft(8);
    setIsTimerRunning(true);
  };

  const startAnswering = () => {
    setIsPreparationTime(false);
    setIsAnsweringTime(true);
    setTimeLeft(45);
    setIsTimerRunning(true);
    setIsRecording(true);
    setIsEmotionAnalyzing(true);
  };

  const completeAnswering = () => {
    saveAnswer();
    setIsRecording(false);
    setIsEmotionAnalyzing(false);
    setIsTimerRunning(false);
    setIsAnsweringTime(false);
    if (questionIndex >= questions.length - 1) {
      stopInterview();
    } else {
      startPreparation();
    }
  };

  const startInterview = () => {
    if (questions.length === 0) {
      alert('선택한 옵션에 해당하는 질문이 없습니다.');
      return;
    }
    setIsInterviewStarted(true);
    startPreparation();
  };

  const stopInterview = async () => {
    setIsInterviewStarted(false);
    setIsRecording(false);
    setIsEmotionAnalyzing(false);
    
    navigate('/Interview_result', { state: { accumulatedEmotions, answers } });
    
    try {
      await fetch('http://localhost:5003/reset_emotions', {
        method: 'POST',
      });
      console.log("Emotion totals reset on server");
    } catch (error) {
      console.error("Error resetting emotion totals on server:", error);
    }

    setAccumulatedEmotions({});
    setAnswers([]);
  };

  const handleTimeUp = () => {
    if (isPreparationTime) {
      startAnswering();
    } else if (isAnsweringTime) {
      completeAnswering();
    }
  };

  const handleEmotionData = (data) => {
    setAccumulatedEmotions((prevState) => ({
      ...prevState,
      ...data,
    }));
  };

  return (
    <div className="CheckCamMic-box">
      <VideoStream videoRef={videoRef} />
      {audioStream && <VolumeMeter audioStream={audioStream} />}
      {videoRef.current && (
        <EmotionAnalyzer
          videoRef={videoRef}
          isActive={isEmotionAnalyzing}
          onEmotionData={handleEmotionData}
        />
      )}
      {audioStream && (
        <AudioRecorder
          isRecording={isRecording}
          socketRef={socketRef}
          audioStream={audioStream}
        />
      )}
      <Timer initialTime={timeLeft} isRunning={isTimerRunning} onTimeUp={handleTimeUp} />
      <QuestionDisplay
        question={questions[questionIndex]}
        isPreparationTime={isPreparationTime}
        timeLeft={timeLeft}
      />
      <ControlButtons
        isInterviewStarted={isInterviewStarted}
        isAnsweringTime={isAnsweringTime}
        onStartInterview={startInterview}
        onStopInterview={stopInterview}
        onStartAnswering={startAnswering}
        onCompleteAnswering={completeAnswering}
      />
    </div>
  );
}

export default Body;
