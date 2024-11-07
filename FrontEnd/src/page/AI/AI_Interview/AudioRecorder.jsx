import React, { useRef, useEffect } from 'react';

function AudioRecorder({ isRecording, audioStream, onRecordingComplete, isSTTProcessing }) {
  const mediaRecorderRef = useRef(null);
  const hasStopped = useRef(false);

  useEffect(() => {
    
    if (isRecording && audioStream && !mediaRecorderRef.current) {
      console.log("Starting new recording session");
      mediaRecorderRef.current = new MediaRecorder(audioStream);
      hasStopped.current = false;
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          console.log("Data available in chunk");
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log("mediaRecorder onstop triggered", { hasStopped: hasStopped.current, isSTTProcessing });
        
        // 중복 호출 방지
        if (hasStopped.current || isSTTProcessing) return;
        hasStopped.current = true;

        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        console.log("Audio recording complete, calling onRecordingComplete");
        onRecordingComplete(audioBlob);
      };

      mediaRecorderRef.current.start();
      console.log("Recording started");
    } else if (!isRecording && mediaRecorderRef.current) {
      console.log("Stopping recording");
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      console.log("Recording stopped");
    }
  }, [isRecording, audioStream, onRecordingComplete, isSTTProcessing]);

  return null;
}

export default AudioRecorder;
