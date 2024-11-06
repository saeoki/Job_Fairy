// import React, { useEffect, useRef } from 'react';

// function AudioRecorder({ isRecording, audioStream, onSaveRecording }) {
//   const mediaRecorderRef = useRef(null);

//   useEffect(() => {
//     if (!audioStream) return;

//     if (!mediaRecorderRef.current) {
//       mediaRecorderRef.current = new MediaRecorder(audioStream);
//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (onSaveRecording && event.data.size > 0) {
//           onSaveRecording(event.data);
//         }
//       };
//     }

//     // 녹음 시작 로직
//     if (isRecording && mediaRecorderRef.current.state !== 'recording') {
//       mediaRecorderRef.current.start();
//       console.log("Recording started");
//     }

//     // 녹음 중지 로직

//     if (!isRecording && mediaRecorderRef.current.state === 'recording') {
//       mediaRecorderRef.current.stop();
//       console.log("Recording stopped");
//     }

//     return () => {
//       // 컴포넌트 언마운트 시 MediaRecorder 정리
//       if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
//         mediaRecorderRef.current.stop();
//       }
//     };
//   }, [isRecording, audioStream, onSaveRecording]);

//   return null;
// }

// export default AudioRecorder;
// AudioRecorder.js
import React, { useRef, useEffect } from 'react';

function AudioRecorder({ isRecording, audioStream, onSaveRecording }) {
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (isRecording && audioStream && !mediaRecorderRef.current) {
      mediaRecorderRef.current = new MediaRecorder(audioStream);
      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0 && onSaveRecording) {
          await onSaveRecording(event.data);
        }
      };
      mediaRecorderRef.current.start();
      console.log("Recording started");
    } else if (!isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      console.log("Recording stopped");
    }
  }, [isRecording, audioStream, onSaveRecording]);

  return null;
}

export default AudioRecorder;
