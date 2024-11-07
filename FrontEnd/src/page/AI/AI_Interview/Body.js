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
  const navigate = useNavigate();

  const [isSTTProcessing, setIsSTTProcessing] = useState(false); // STT 처리 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 마지막 답변 전송 중 상태

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

  // 면접 시작 함수
  const startInterview = () => {
    if (questions.length === 0) {
      alert('선택한 옵션에 해당하는 질문이 없습니다.');
      return;
    }
    setIsInterviewStarted(true);
    setQuestionIndex(0);
    setIsPreparationTime(true); // 준비 시간으로 설정
    setTimeKey((prev) => prev + 1);
    console.log("Interview started, isPreparationTime set to true");
  };

  const handleSaveRecording = async (audioBlob) => {
    if (!(audioBlob instanceof Blob)) {
      console.error("audioBlob is not a Blob instance");
      return;
    }

    if (isSTTProcessing) return;
    setIsSTTProcessing(true);

    const formData = new FormData();
    formData.append('audio', audioBlob, 'answer.webm');
    formData.append('question', questions[questionIndex]);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      console.log("STT response:", result);

      if (result.transcription) {
        const newAnswer = { question: questions[questionIndex], answer: result.transcription };
        setAnswers((prev) => [...prev, newAnswer]);
        setTranscription(result.transcription);

        if (questionIndex < questions.length - 1) {
          setQuestionIndex((prevIndex) => prevIndex + 1);
          setIsPreparationTime(true);
          setTimeKey((prev) => prev + 1);
        } else {
          setIsSubmitting(true); // 마지막 답변 처리 중
          await stopInterview();
        }
      } else {
        console.warn("No transcription received");
      }
    } catch (error) {
      console.error('Error uploading audio file:', error);
    } finally {
      setIsSTTProcessing(false);
    }
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

    setAccumulatedEmotions({});
    setAnswers([]);
    setIsSubmitting(false); // 제출 완료 후 로딩 종료
    navigate('/Interview_result', { state: { accumulatedEmotions, answers } });
  };

  const handleEmotionData = (data) => {
    setAccumulatedEmotions((prevState) => ({
      ...prevState,
      ...data,
    }));
  };

  return (
    <div className="CheckCamMic-box pt-3 pb-4">
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
          question={questions[questionIndex]}
          isPreparationTime={isPreparationTime}
          preparationTime={20}
          answerTime={50}
        />
      )}
      <ControlButtons
        isInterviewStarted={isInterviewStarted}
        isAnsweringTime={!isPreparationTime}
        onStartInterview={startInterview}
        onStopInterview={stopInterview}
        onStartAnswering={() => {
          setIsPreparationTime(false);
          setIsRecording(true);
          setIsEmotionAnalyzing(true);
        }}
        onCompleteAnswering={() => {
          setIsRecording(false);
          setIsEmotionAnalyzing(false);
        }}
      />

      {/* 답변 처리 중 로딩 화면 */}
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
