
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
  // 면접 설정 정보를 가져오는 데 사용되는 상태
  const location = useLocation();
  const { isPersonalityInterviewChecked, isTechnicalInterviewChecked, selectedJob } = location.state || {};

  // 비디오와 오디오 스트림 및 상태 관련 상태값 초기화
  const videoRef = useRef(null); // 비디오 요소 참조
  const [videoStream, setVideoStream] = useState(null); // 비디오 스트림
  const [audioStream, setAudioStream] = useState(null); // 오디오 스트림

  // 녹음 상태, 감정 분석 상태, 음성 텍스트 변환 상태 등 면접 상태 관리
  const [isRecording, setIsRecording] = useState(false); // 녹음 여부
  const [isEmotionAnalyzing, setIsEmotionAnalyzing] = useState(false); // 감정 분석 활성화 여부
  const [answers, setAnswers] = useState([]); // 사용자 답변 리스트
  const [accumulatedEmotions, setAccumulatedEmotions] = useState({}); // 감정 데이터 누적

  // 면접 질문 및 면접 진행 상황 관리
  const [questions, setQuestions] = useState([]); // 질문 리스트
  const [questionIndex, setQuestionIndex] = useState(-1); // 현재 질문 인덱스
  const [isInterviewStarted, setIsInterviewStarted] = useState(false); // 면접 시작 여부
  const [isPreparationTime, setIsPreparationTime] = useState(false); // 준비 시간 여부
  const [timeKey, setTimeKey] = useState(0); // 타이머 초기화를 위한 키값
  const [isSTTProcessing, setIsSTTProcessing] = useState(false); // STT 처리 중 여부
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 여부
  const [isInterviewFinished, setIsInterviewFinished] = useState(false); // 면접 종료 여부
  const [isAnsweringComplete, setIsAnsweringComplete] = useState(false); // 답변 완료 여부

  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 함수

  const preparationTimerRef = useRef(null);
  const answerTimerRef = useRef(null);

  // 녹음 시작 여부에 따라 감정 분석 활성화 상태 업데이트
  useEffect(() => {
    console.log("useEffect: isRecording changed", isRecording);
    setIsEmotionAnalyzing(isRecording);
  }, [isRecording]);

  // 설정된 면접 질문 불러오기
  useEffect(() => {
    console.log("Fetching questions");
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

      // 면접 질문 수에 따라 무작위로 질문 리스트 생성
      const questionCount = (isPersonalityInterviewChecked && isTechnicalInterviewChecked) ? 10 : 5;
      const randomQuestions = getRandomQuestions(combinedQuestions, questionCount);
      setQuestions(randomQuestions);
    };

    fetchQuestions();
  }, [isPersonalityInterviewChecked, isTechnicalInterviewChecked, selectedJob]);

  // 질문을 무작위로 가져오는 함수
  const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // 사용자 미디어 요청하여 비디오 및 오디오 스트림을 설정
  useEffect(() => {
    console.log("Requesting user media");
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

  // 녹음된 오디오를 서버에 업로드하고 STT 결과를 처리하는 함수
  const handleSaveRecording = async (audioBlob = null) => {
    if (isSTTProcessing || questionIndex >= questions.length) {
      console.warn("Already processing STT or all questions answered");
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
      console.log("STT response received", result);

      const newAnswer = { question: questions[questionIndex], answer: result.transcription || '' };

      setAnswers((prev) => {
        const updatedAnswers = [...prev, newAnswer];
        console.log("Updated answers", updatedAnswers);

        if (updatedAnswers.length === questions.length) {
          setIsInterviewFinished(true);
        } else {
          setIsPreparationTime(true);
          setTimeKey((prev) => prev + 1);
          setIsAnsweringComplete(false); // 여기에서 재설정
        }
        return updatedAnswers;
      });

      setQuestionIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        console.log("Updated questionIndex", newIndex);
        return newIndex;
      });

    } catch (error) {
      console.error('Error uploading audio file:', error);
    } finally {
      setIsSTTProcessing(false);
    }
  };

  const onCompleteAnswering = () => {
    console.log("onCompleteAnswering called", { isSTTProcessing, questionIndex, isAnsweringComplete });

    if (isSTTProcessing || isAnsweringComplete || questionIndex >= questions.length) return;

    // 타이머 클리어
    clearTimeout(preparationTimerRef.current);
    clearTimeout(answerTimerRef.current);

    setIsAnsweringComplete(true);
    setIsRecording(false); // 녹음을 중지하면 AudioRecorder에서 handleSaveRecording이 호출됨
    setIsEmotionAnalyzing(false);
  };

  // 면접 시작 시 호출되는 함수
  const startInterview = () => {
    console.log("startInterview called");
    if (questions.length === 0) {
      alert('No questions available.');
      return;
    }
    setIsInterviewStarted(true);
    setQuestionIndex(0);
    setIsPreparationTime(true);
    setTimeKey((prev) => prev + 1);
  };

  // 면접 종료 시 호출되는 함수
  const stopInterview = async () => {
    console.log("stopInterview called");
    setIsInterviewStarted(false);
    setIsRecording(false);
    setIsEmotionAnalyzing(false);

  //   try {
  //     await fetch('http://localhost:5003/reset_emotions', { method: 'POST' });
  //     console.log("Emotion totals reset on server");
  //   } catch (error) {
  //     console.error("Error resetting emotion totals on server:", error);
  //   }

  //   setIsSubmitting(false);
  //   setIsInterviewFinished(true);
  // };
      try {
        await fetch('https://port-0-job-fairy-m37kcdp5e06b15b4.sel4.cloudtype.app/reset_emotions', { method: 'POST' });
        console.log("Emotion totals reset on server");
      } catch (error) {
        console.error("Error resetting emotion totals on server:", error);
      }

      setIsSubmitting(false);
      setIsInterviewFinished(true);
    };

  // 면접의 준비 시간과 답변 시간 관리
  useEffect(() => {
    console.log("useEffect: questionIndex", questionIndex);

    if (isInterviewStarted && questionIndex < questions.length) {
      if (isPreparationTime) {
        preparationTimerRef.current = setTimeout(() => {
          console.log("Preparation time ended, starting recording");
          setIsPreparationTime(false);
          setIsRecording(true);
          setIsAnsweringComplete(false);
        }, 20000);
      } else if (isRecording && !isSTTProcessing && !isAnsweringComplete) {
        answerTimerRef.current = setTimeout(() => {
          console.log("Answer time ended, calling onCompleteAnswering");
          onCompleteAnswering();
        }, 50000);
      }
    }

    return () => {
      clearTimeout(preparationTimerRef.current);
      clearTimeout(answerTimerRef.current);
    };
  }, [isInterviewStarted, isPreparationTime, isRecording, questionIndex, isSTTProcessing, isAnsweringComplete]);

  // 면접 결과 페이지로 이동
  const goToResult = () => {
    navigate('/Interview_result', { state: { accumulatedEmotions, answers } });
  };

  return (
    <div className="CheckCamMic-box">
      <VideoStream videoRef={videoRef} />
      {audioStream && <VolumeMeter audioStream={audioStream} />}
      {videoRef.current && (
        <EmotionAnalyzer
          videoRef={videoRef}
          isActive={isEmotionAnalyzing}
          onEmotionData={(data) => {
            setAccumulatedEmotions((prevState) => ({
              ...prevState,
              ...data,
            }));
          }}
        />
      )}
      {audioStream && (
        <AudioRecorder
          isRecording={isRecording}
          audioStream={audioStream}
          onRecordingComplete={(audioBlob) => {
            console.log("Audio recording complete, handleSaveRecording called");
            handleSaveRecording(audioBlob);
          }}
          isSTTProcessing={isSTTProcessing} // STT 상태 전달
        />
      )}
      {isInterviewStarted && (
        <QuestionDisplay
          key={timeKey}
          question={questions[questionIndex]}
          isPreparationTime={isPreparationTime}
          preparationTime={20}
          answerTime={50}
          onTimeUp={onCompleteAnswering}
          onStartAnswering={() => {
            setIsPreparationTime(false);
            setIsRecording(true);
          }}
          isInterviewFinished={isInterviewFinished} // 추가된 prop 전달
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
        isAnsweringComplete={isAnsweringComplete}
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