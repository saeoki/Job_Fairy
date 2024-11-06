
// import React, { useEffect, useRef } from 'react';

// function AudioRecorder({ isRecording, audioStream, onSaveRecording }) {
//   const mediaRecorderRef = useRef(null);

//   useEffect(() => {
//     if (isRecording) {
//       if (!audioStream) return;

//       // MediaRecorder 초기화
//       mediaRecorderRef.current = new MediaRecorder(audioStream);
//       const chunks = [];

//       // 녹음 시작
//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunks.push(event.data);
//         }
//       };

//       mediaRecorderRef.current.onstop = async () => {
//         const audioBlob = new Blob(chunks, { type: 'audio/webm' });
//         onSaveRecording(audioBlob);
//       };

//       mediaRecorderRef.current.start();
//       console.log("Recording started");

//       // 녹음 중지 시 정리
//       return () => {
//         if (mediaRecorderRef.current.state !== 'inactive') {
//           mediaRecorderRef.current.stop();
//           console.log("Recording stopped");
//         }
//       };
//     }
//   }, [isRecording, audioStream, onSaveRecording]);

//   return null;
// }

// export default AudioRecorder;
import React, { useEffect, useRef } from 'react';

function AudioRecorder({ isRecording, audioStream, onSaveRecording }) {
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (isRecording && audioStream) {
      mediaRecorderRef.current = new MediaRecorder(audioStream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        onSaveRecording(audioBlob);
      };

      mediaRecorderRef.current.start();
      console.log("Recording started");

      return () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
          console.log("Recording stopped");
        }
      };
    }
  }, [isRecording, audioStream, onSaveRecording]);

  return null;
}

export default AudioRecorder;
