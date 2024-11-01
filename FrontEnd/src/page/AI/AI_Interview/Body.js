
// // // import React, { useState, useRef, useEffect } from 'react';
// // // import VideoStream from './VideoStream';
// // // import AudioRecorder from './AudioRecorder';
// // // import EmotionAnalyzer from './EmotionAnalyzer';
// // // import VolumeMeter from './VolumeMeter';
// // // import Timer from './Timer';
// // // import QuestionDisplay from './QuestionDisplay';
// // // import ControlButtons from './ControlButtons';
// // // import { useNavigate, useLocation } from 'react-router-dom';

// // // function Body() {
// // //   const location = useLocation();
// // //   const { isPersonalityInterviewChecked, isTechnicalInterviewChecked, selectedJob } = location.state || {};

// // //   const videoRef = useRef(null);
// // //   const socketRef = useRef(null);
// // //   const [videoStream, setVideoStream] = useState(null);
// // //   const [audioStream, setAudioStream] = useState(null);
// // //   const [isRecording, setIsRecording] = useState(false);

// // //   const [isEmotionAnalyzing, setIsEmotionAnalyzing] = useState(false);
// // //   const [transcription, setTranscription] = useState('');
// // //   const [answers, setAnswers] = useState([]);
// // //   const [accumulatedEmotions, setAccumulatedEmotions] = useState({});

// // //   const [questions, setQuestions] = useState([]);
// // //   const [questionIndex, setQuestionIndex] = useState(-1);
// // //   const [isInterviewStarted, setIsInterviewStarted] = useState(false);
// // //   const [isAnsweringTime, setIsAnsweringTime] = useState(false);
// // //   const [isPreparationTime, setIsPreparationTime] = useState(false);
// // //   const [timeLeft, setTimeLeft] = useState(0);
// // //   const [isTimerRunning, setIsTimerRunning] = useState(false);
// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     const fetchQuestions = async () => {
// // //       let combinedQuestions = [];
  
// // //       if (isPersonalityInterviewChecked) {
// // //         try {
// // //           const response = await fetch('/questions/personality_questions.json');
// // //           const data = await response.json();
// // //           combinedQuestions = [...combinedQuestions, ...data];
// // //         } catch (error) {
// // //           console.error('Error fetching personality questions:', error);
// // //         }
// // //       }
  
// // //       if (isTechnicalInterviewChecked && selectedJob) {
// // //         try {
// // //           const response = await fetch(`/questions/technical_questions_${selectedJob}.json`);
// // //           const data = await response.json();
// // //           combinedQuestions = [...combinedQuestions, ...data];
// // //         } catch (error) {
// // //           console.error(`Error fetching technical questions for ${selectedJob}:`, error);
// // //         }
// // //       }
  
// // //       const questionCount = (isPersonalityInterviewChecked && isTechnicalInterviewChecked) ? 10 : 5;
// // //       const randomQuestions = getRandomQuestions(combinedQuestions, questionCount);
// // //       setQuestions(randomQuestions);
// // //     };
  
// // //     fetchQuestions();
// // //   }, [isPersonalityInterviewChecked, isTechnicalInterviewChecked, selectedJob]);

// // //   const getRandomQuestions = (questions, count) => {
// // //     const shuffled = [...questions].sort(() => 0.5 - Math.random());
// // //     return shuffled.slice(0, count);
// // //   };

// // //   const saveAnswer = () => {
// // //     setAnswers((prevAnswers) => [
// // //       ...prevAnswers,
// // //       { question: questions[questionIndex], answer: transcription }
// // //     ]);
// // //     setTranscription('');
// // //   };

// // //   useEffect(() => {
// // //     const requestUserMedia = async () => {
// // //       try {
// // //         const stream = await navigator.mediaDevices.getUserMedia({
// // //           video: true,
// // //           audio: {
// // //             echoCancellation: true,
// // //             noiseSuppression: true,
// // //             autoGainControl: true,
// // //           },
// // //         });
// // //         if (videoRef.current) {
// // //           videoRef.current.srcObject = stream;
// // //           videoRef.current.muted = true;
// // //         }
// // //         setVideoStream(stream);

// // //         const audioTracks = stream.getAudioTracks();
// // //         const audioOnlyStream = new MediaStream(audioTracks);
// // //         setAudioStream(audioOnlyStream);
// // //       } catch (err) {
// // //         console.error('Error accessing user media:', err);
// // //       }
// // //     };

// // //     requestUserMedia();

// // //     return () => {
// // //       if (videoStream) {
// // //         videoStream.getTracks().forEach((track) => track.stop());
// // //       }
// // //       if (audioStream) {
// // //         audioStream.getTracks().forEach((track) => track.stop());
// // //       }
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     socketRef.current = new WebSocket('ws://localhost:5000');
// // //     socketRef.current.binaryType = 'arraybuffer';

// // //     socketRef.current.onopen = () => {
// // //       console.log('WebSocket connection established');
// // //     };

// // //     socketRef.current.onmessage = (message) => {
// // //       const data = JSON.parse(message.data);
// // //       if (data.transcription) {
// // //         setTranscription((prev) => prev + ' ' + data.transcription);
// // //       }
// // //     };

// // //     socketRef.current.onerror = (error) => {
// // //       console.error('WebSocket error:', error);
// // //     };

// // //     return () => {
// // //       if (socketRef.current) {
// // //         socketRef.current.close();
// // //       }
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     let timerId;
// // //     if (isTimerRunning && timeLeft > 0) {
// // //       timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
// // //     } else if (timeLeft === 0) {
// // //       if (isPreparationTime) {
// // //         startAnswering();
// // //       } else if (isAnsweringTime) {
// // //         completeAnswering();
// // //       }
// // //     }
// // //     return () => {
// // //       if (timerId) {
// // //         clearTimeout(timerId);
// // //       }
// // //     };
// // //   }, [timeLeft, isTimerRunning, isPreparationTime, isAnsweringTime]);

// // //   const startPreparation = () => {
// // //     setQuestionIndex((prevIndex) => prevIndex + 1);
// // //     setIsPreparationTime(true);
// // //     setIsAnsweringTime(false);
// // //     setTimeLeft(8);
// // //     setIsTimerRunning(true);
// // //   };

// // //   const startAnswering = () => {
// // //     setIsPreparationTime(false);
// // //     setIsAnsweringTime(true);
// // //     setTimeLeft(45);
// // //     setIsTimerRunning(true);
// // //     setIsRecording(true);
// // //     setIsEmotionAnalyzing(true);
// // //   };

// // //   const completeAnswering = () => {
// // //     saveAnswer();
// // //     setIsRecording(false);
// // //     setIsEmotionAnalyzing(false);
// // //     setIsTimerRunning(false);
// // //     setIsAnsweringTime(false);
// // //     if (questionIndex >= questions.length - 1) {
// // //       stopInterview();
// // //     } else {
// // //       startPreparation();
// // //     }
// // //   };

// // //   const startInterview = () => {
// // //     if (questions.length === 0) {
// // //       alert('선택한 옵션에 해당하는 질문이 없습니다.');
// // //       return;
// // //     }
// // //     setIsInterviewStarted(true);
// // //     startPreparation();
// // //   };

// // //   const stopInterview = async () => {
// // //     setIsInterviewStarted(false);
// // //     setIsRecording(false);
// // //     setIsEmotionAnalyzing(false);
    
// // //     navigate('/Interview_result', { state: { accumulatedEmotions, answers } });
    
// // //     try {
// // //       await fetch('http://localhost:5003/reset_emotions', {
// // //         method: 'POST',
// // //       });
// // //       console.log("Emotion totals reset on server");
// // //     } catch (error) {
// // //       console.error("Error resetting emotion totals on server:", error);
// // //     }

// // //     setAccumulatedEmotions({});
// // //     setAnswers([]);
// // //   };

// // //   const handleTimeUp = () => {
// // //     if (isPreparationTime) {
// // //       startAnswering();
// // //     } else if (isAnsweringTime) {
// // //       completeAnswering();
// // //     }
// // //   };

// // //   const handleEmotionData = (data) => {
// // //     setAccumulatedEmotions((prevState) => ({
// // //       ...prevState,
// // //       ...data,
// // //     }));
// // //   };

// // //   return (
// // //     <div className="CheckCamMic-box">
// // //       <VideoStream videoRef={videoRef} />
// // //       {audioStream && <VolumeMeter audioStream={audioStream} />}
// // //       {videoRef.current && (
// // //         <EmotionAnalyzer
// // //           videoRef={videoRef}
// // //           isActive={isEmotionAnalyzing}
// // //           onEmotionData={handleEmotionData}
// // //         />
// // //       )}
// // //       {audioStream && (
// // //         <AudioRecorder
// // //           isRecording={isRecording}
// // //           socketRef={socketRef}
// // //           audioStream={audioStream}
// // //         />
// // //       )}
// // //       <Timer initialTime={timeLeft} isRunning={isTimerRunning} onTimeUp={handleTimeUp} />
// // //       <QuestionDisplay
// // //         question={questions[questionIndex]}
// // //         isPreparationTime={isPreparationTime}
// // //         timeLeft={timeLeft}
// // //       />
// // //       <ControlButtons
// // //         isInterviewStarted={isInterviewStarted}
// // //         isAnsweringTime={isAnsweringTime}
// // //         onStartInterview={startInterview}
// // //         onStopInterview={stopInterview}
// // //         onStartAnswering={startAnswering}
// // //         onCompleteAnswering={completeAnswering}
// // //       />
// // //     </div>
// // //   );
// // // }

// // // export default Body;

// // import React, { useState, useRef, useEffect } from 'react';
// // import VideoStream from './VideoStream';
// // import AudioRecorder from './AudioRecorder';
// // import EmotionAnalyzer from './EmotionAnalyzer';
// // import VolumeMeter from './VolumeMeter';
// // import QuestionDisplay from './QuestionDisplay'; // 통합된 QuestionDisplay 컴포넌트
// // import ControlButtons from './ControlButtons';
// // import { useNavigate, useLocation } from 'react-router-dom';

// // function Body() {
// //   const location = useLocation();
// //   const { isPersonalityInterviewChecked, isTechnicalInterviewChecked, selectedJob } = location.state || {};

// //   const videoRef = useRef(null);
// //   const socketRef = useRef(null);
// //   const [videoStream, setVideoStream] = useState(null);
// //   const [audioStream, setAudioStream] = useState(null);
// //   const [isRecording, setIsRecording] = useState(false);

// //   const [isEmotionAnalyzing, setIsEmotionAnalyzing] = useState(false);
// //   const [transcription, setTranscription] = useState('');
// //   const [answers, setAnswers] = useState([]);
// //   const [accumulatedEmotions, setAccumulatedEmotions] = useState({});

// //   const [questions, setQuestions] = useState([]);
// //   const [questionIndex, setQuestionIndex] = useState(-1);
// //   const [isInterviewStarted, setIsInterviewStarted] = useState(false);
// //   const [isPreparationTime, setIsPreparationTime] = useState(false);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchQuestions = async () => {
// //       let combinedQuestions = [];
  
// //       if (isPersonalityInterviewChecked) {
// //         try {
// //           const response = await fetch('/questions/personality_questions.json');
// //           const data = await response.json();
// //           combinedQuestions = [...combinedQuestions, ...data];
// //         } catch (error) {
// //           console.error('Error fetching personality questions:', error);
// //         }
// //       }
  
// //       if (isTechnicalInterviewChecked && selectedJob) {
// //         try {
// //           const response = await fetch(`/questions/technical_questions_${selectedJob}.json`);
// //           const data = await response.json();
// //           combinedQuestions = [...combinedQuestions, ...data];
// //         } catch (error) {
// //           console.error(`Error fetching technical questions for ${selectedJob}:`, error);
// //         }
// //       }
  
// //       const questionCount = (isPersonalityInterviewChecked && isTechnicalInterviewChecked) ? 10 : 5;
// //       const randomQuestions = getRandomQuestions(combinedQuestions, questionCount);
// //       setQuestions(randomQuestions);
// //     };
  
// //     fetchQuestions();
// //   }, [isPersonalityInterviewChecked, isTechnicalInterviewChecked, selectedJob]);

// //   const getRandomQuestions = (questions, count) => {
// //     const shuffled = [...questions].sort(() => 0.5 - Math.random());
// //     return shuffled.slice(0, count);
// //   };

// //   const saveAnswer = () => {
// //     setAnswers((prevAnswers) => [
// //       ...prevAnswers,
// //       { question: questions[questionIndex], answer: transcription }
// //     ]);
// //     setTranscription('');
// //   };

// //   useEffect(() => {
// //     const requestUserMedia = async () => {
// //       try {
// //         const stream = await navigator.mediaDevices.getUserMedia({
// //           video: true,
// //           audio: {
// //             echoCancellation: true,
// //             noiseSuppression: true,
// //             autoGainControl: true,
// //           },
// //         });
// //         if (videoRef.current) {
// //           videoRef.current.srcObject = stream;
// //           videoRef.current.muted = true;
// //         }
// //         setVideoStream(stream);

// //         const audioTracks = stream.getAudioTracks();
// //         const audioOnlyStream = new MediaStream(audioTracks);
// //         setAudioStream(audioOnlyStream);
// //       } catch (err) {
// //         console.error('Error accessing user media:', err);
// //       }
// //     };

// //     requestUserMedia();

// //     return () => {
// //       if (videoStream) {
// //         videoStream.getTracks().forEach((track) => track.stop());
// //       }
// //       if (audioStream) {
// //         audioStream.getTracks().forEach((track) => track.stop());
// //       }
// //     };
// //   }, []);

// //   useEffect(() => {
// //     socketRef.current = new WebSocket('ws://localhost:5000');
// //     socketRef.current.binaryType = 'arraybuffer';

// //     socketRef.current.onopen = () => {
// //       console.log('WebSocket connection established');
// //     };

// //     socketRef.current.onmessage = (message) => {
// //       const data = JSON.parse(message.data);
// //       if (data.transcription) {
// //         setTranscription((prev) => prev + ' ' + data.transcription);
// //       }
// //     };

// //     socketRef.current.onerror = (error) => {
// //       console.error('WebSocket error:', error);
// //     };

// //     return () => {
// //       if (socketRef.current) {
// //         socketRef.current.close();
// //       }
// //     };
// //   }, []);

// //   const startPreparation = () => {
// //     setQuestionIndex((prevIndex) => prevIndex + 1);
// //     setIsPreparationTime(true);
// //   };

// //   const startAnswering = () => {
// //     setIsPreparationTime(false);
// //     setIsRecording(true);
// //     setIsEmotionAnalyzing(true);
// //   };

// //   const completeAnswering = () => {
// //     saveAnswer();
// //     setIsRecording(false);
// //     setIsEmotionAnalyzing(false);
// //     if (questionIndex >= questions.length - 1) {
// //       stopInterview();
// //     } else {
// //       startPreparation();
// //     }
// //   };

// //   const startInterview = () => {
// //     if (questions.length === 0) {
// //       alert('선택한 옵션에 해당하는 질문이 없습니다.');
// //       return;
// //     }
// //     setIsInterviewStarted(true);
// //     startPreparation();
// //   };

// //   const stopInterview = async () => {
// //     setIsInterviewStarted(false);
// //     setIsRecording(false);
// //     setIsEmotionAnalyzing(false);
    
// //     navigate('/Interview_result', { state: { accumulatedEmotions, answers } });
    
// //     try {
// //       await fetch('http://localhost:5003/reset_emotions', {
// //         method: 'POST',
// //       });
// //       console.log("Emotion totals reset on server");
// //     } catch (error) {
// //       console.error("Error resetting emotion totals on server:", error);
// //     }

// //     setAccumulatedEmotions({});
// //     setAnswers([]);
// //   };

// //   const handleTimeUp = () => {
// //     if (isPreparationTime) {
// //       startAnswering();
// //     } else {
// //       completeAnswering();
// //     }
// //   };

// //   const handleEmotionData = (data) => {
// //     setAccumulatedEmotions((prevState) => ({
// //       ...prevState,
// //       ...data,
// //     }));
// //   };

// //   return (
// //     <div className="CheckCamMic-box">
// //       <VideoStream videoRef={videoRef} />
// //       {audioStream && <VolumeMeter audioStream={audioStream} />}
// //       {videoRef.current && (
// //         <EmotionAnalyzer
// //           videoRef={videoRef}
// //           isActive={isEmotionAnalyzing}
// //           onEmotionData={handleEmotionData}
// //         />
// //       )}
// //       {audioStream && (
// //         <AudioRecorder
// //           isRecording={isRecording}
// //           socketRef={socketRef}
// //           audioStream={audioStream}
// //         />
// //       )}
// //       <QuestionDisplay
// //         question={questions[questionIndex]}
// //         preparationTime={8} // 준비 시간 설정
// //         answerTime={45} // 답변 시간 설정
// //         onTimeUp={handleTimeUp}
// //       />
// //       <ControlButtons
// //         isInterviewStarted={isInterviewStarted}
// //         isAnsweringTime={!isPreparationTime}
// //         onStartInterview={startInterview}
// //         onStopInterview={stopInterview}
// //         onStartAnswering={startAnswering}
// //         onCompleteAnswering={completeAnswering}
// //       />
// //     </div>
// //   );
// // }

// // export default Body;

import React, { useState, useRef, useEffect } from 'react';
import VideoStream from './VideoStream';
import AudioRecorder from './AudioRecorder';
import EmotionAnalyzer from './EmotionAnalyzer';
import VolumeMeter from './VolumeMeter';
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
  const [isPreparationTime, setIsPreparationTime] = useState(false);
  const [timeKey, setTimeKey] = useState(0); // 타이머 리셋을 위한 키
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

  const startInterview = () => {
    if (questions.length === 0) {
      alert('선택한 옵션에 해당하는 질문이 없습니다.');
      return;
    }
    setIsInterviewStarted(true);
    setQuestionIndex(0); // 첫 질문으로 시작
    setIsPreparationTime(false); // 첫 질문부터 답변 시간으로 시작
    setIsRecording(true); // 녹음 시작
    setIsEmotionAnalyzing(true); // 감정 분석 시작
    setTimeKey((prev) => prev + 1); // 타이머 리셋을 위해 키 변경
  };

  const handleTimeUp = () => {
    if (isPreparationTime) {
      // 준비 시간이 끝나면 답변 시간으로 전환
      setIsPreparationTime(false);
      setIsRecording(true);
      setIsEmotionAnalyzing(true);
      setTimeKey((prev) => prev + 1); // 타이머 리셋
    } else {
      // 답변 시간이 끝나면 준비 시간으로 전환
      saveAnswer();
      setIsRecording(false);
      setIsEmotionAnalyzing(false);

      if (questionIndex < questions.length - 1) {
        setQuestionIndex((prevIndex) => prevIndex + 1);
        setIsPreparationTime(true); // 준비 시간 시작
        setTimeKey((prev) => prev + 1); // 타이머 리셋
      } else {
        stopInterview();
      }
    }
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
      {/* 면접이 시작되었을 때만 QuestionDisplay 컴포넌트를 렌더링 */}
      {isInterviewStarted && (
        <QuestionDisplay
          key={timeKey} // 타이머 리셋을 위한 키
          question={questions[questionIndex]}
          isPreparationTime={isPreparationTime}
          preparationTime={10} // 준비 시간
          answerTime={45} // 답변 시간
          onTimeUp={handleTimeUp}
        />
      )}
      <ControlButtons
        isInterviewStarted={isInterviewStarted}
        isAnsweringTime={!isPreparationTime}
        onStartInterview={startInterview}
        onStopInterview={stopInterview}
        onStartAnswering={() => setIsPreparationTime(false)} // 답변 시작
        onCompleteAnswering={handleTimeUp} // 답변 완료 시 시간 종료 처리
      />
    </div>
  );
}

export default Body;
