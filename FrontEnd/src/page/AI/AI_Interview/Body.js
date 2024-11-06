import React, { useState, useRef, useEffect } from 'react';
import VideoStream from './VideoStream';
import AudioRecorder from './AudioRecorder';
import EmotionAnalyzer from './EmotionAnalyzer';
import VolumeMeter from './VolumeMeter';
import QuestionDisplay from './QuestionDisplay';
import ControlButtons from './ControlButtons';
import { useNavigate, useLocation } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Body() {
  const location = useLocation();
  const { isPersonalityInterviewChecked, isTechnicalInterviewChecked, selectedJob } = location.state || {};

  const videoRef = useRef(null);
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
  const [timeKey, setTimeKey] = useState(0);
  const [isSTTProcessing, setIsSTTProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    setIsEmotionAnalyzing(isRecording);
  }, [isRecording]);

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

  const handleSaveRecording = async (audioBlob = null) => {
    if (isSTTProcessing) {
      console.warn("STT is already processing");
      return;
    }
    
    setIsSTTProcessing(true);
    
    const formData = new FormData();
    if (audioBlob instanceof Blob) {
      formData.append('audio', audioBlob, 'answer.webm');
    } else {
      formData.append('audio', new Blob(), 'answer.webm');
    }
    formData.append('question', questions[questionIndex]);
    
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
    
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
    
      const result = await response.json();
      console.log("STT response:", result);
    
      const newAnswer = { 
        question: questions[questionIndex], 
        answer: result.transcription || ''  
      };
    
      setAnswers((prev) => {
        const updatedAnswers = [...prev, newAnswer];
        if (updatedAnswers.length === questions.length) {
          setIsInterviewFinished(true);
        } else {
          setIsPreparationTime(true);
          setTimeKey((prev) => prev + 1);
        }
        return updatedAnswers;
      });
  
      setQuestionIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error('Error uploading audio file:', error);
    } finally {
      setIsSTTProcessing(false);
    }
  };
  const onCompleteAnswering = () => {
    setIsRecording(false);
    setIsEmotionAnalyzing(false);
  
    if (audioStream) {
      const audioBlob = new Blob(audioStream.getAudioTracks(), { type: 'audio/webm' });
      handleSaveRecording(audioBlob);
    } else {
      handleSaveRecording();
    }
  
    // 질문이 마지막이 아닐 때만 questionIndex를 증가시키도록 조건 추가
    setQuestionIndex((prevIndex) => {
      if (prevIndex < questions.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };
  const startInterview = () => {
    if (questions.length === 0) {
      alert('선택한 옵션에 해당하는 질문이 없습니다.');
      return;
    }
    setIsInterviewStarted(true);
    setQuestionIndex(0);
    setIsPreparationTime(true);
    setTimeKey((prev) => prev + 1);
  };

  const goToResult = () => {
    navigate('/Interview_result', { state: { accumulatedEmotions, answers } });
  };

  const stopInterview = async () => {
    setIsInterviewStarted(false);
    setIsRecording(false);
    setIsEmotionAnalyzing(false);

    try {
      await fetch('http://localhost:5003/reset_emotions', {
        method: 'POST',
      });
      console.log("Emotion totals reset on server");
    } catch (error) {
      console.error("Error resetting emotion totals on server:", error);
    }

    setIsSubmitting(false);
    setIsInterviewFinished(true); 
  };

  const handleEmotionData = (data) => {
    setAccumulatedEmotions((prevState) => ({
      ...prevState,
      ...data,
    }));
  };

  useEffect(() => {
    let preparationTimer;
    let answerTimer;
  
    if (isInterviewStarted && questionIndex < questions.length) {
      if (isPreparationTime) {
        preparationTimer = setTimeout(() => {
          setIsPreparationTime(false);
          setIsRecording(true);
        }, 20000); // 준비 시간 (20초)
      } else if (isRecording && !isSTTProcessing) {
        answerTimer = setTimeout(() => {
          onCompleteAnswering();
        }, 50000); // 답변 시간 (50초)
      }
    }
  
    return () => {
      clearTimeout(preparationTimer);
      clearTimeout(answerTimer);
    };
  }, [isInterviewStarted, isPreparationTime, isRecording, questionIndex, isSTTProcessing]);

  const isLastQuestion = questionIndex === questions.length - 1;

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
          audioStream={audioStream}
          onSaveRecording={handleSaveRecording}
        />
      )}
      {isInterviewStarted && (
        <QuestionDisplay
          key={timeKey}
          question={isLastQuestion ? "면접이 종료되었습니다." : questions[questionIndex]}
          isPreparationTime={!isLastQuestion && isPreparationTime}
          preparationTime={isLastQuestion ? 0 : 20}  // 마지막 질문에는 준비 시간 타이머 생략
          answerTime={isLastQuestion ? 0 : 50}       // 마지막 질문에는 답변 시간 타이머 생략
        />
      )}
      <ControlButtons
        isInterviewStarted={isInterviewStarted}
        isAnsweringTime={!isPreparationTime}
        isInterviewFinished={isInterviewFinished}
        onStartInterview={startInterview}
        onStopInterview={stopInterview}
        onStartAnswering={() => {
          setIsPreparationTime(false);
          setIsRecording(true);
        }}
        onCompleteAnswering={onCompleteAnswering}
        onGoToResult={goToResult}
      />

      <Backdrop open={isSTTProcessing || isSubmitting} style={{ zIndex: 1300 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="inherit" />
          <Typography variant="h6" mt={2}>
            답변 처리 중입니다...
          </Typography>
        </Box>
      </Backdrop>
    </div>
  );
}

export default Body;
