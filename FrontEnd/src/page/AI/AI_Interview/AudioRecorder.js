
import React, { useEffect, useRef } from 'react';

function AudioRecorder({ isRecording, socketRef, audioStream }) {
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (!audioStream) return;

    const startRecording = () => {
      try {
        // 지원되는 MIME 타입 확인 및 설정
        let options = { mimeType: 'audio/webm; codecs=opus' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'audio/ogg; codecs=opus' };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = { mimeType: 'audio/wav' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              options = {}; // 기본 설정 사용
            }
          }
        }

        mediaRecorderRef.current = new MediaRecorder(audioStream, options);

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (
            event.data.size > 0 &&
            socketRef.current &&
            socketRef.current.readyState === WebSocket.OPEN
          ) {
            // 데이터를 ArrayBuffer로 변환하여 전송
            event.data.arrayBuffer().then((arrayBuffer) => {
              socketRef.current.send(arrayBuffer);
            });
          }
        };

        mediaRecorderRef.current.start(250); // 0.25초마다 데이터 전송
      } catch (e) {
        console.error('Failed to start MediaRecorder:', e);
        alert('녹음을 시작할 수 없습니다. 브라우저가 MediaRecorder를 지원하는지 확인하세요.');
      }
    };

    const stopRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };

    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      stopRecording();
    };
  }, [isRecording, audioStream, socketRef]);

  return null;
}

export default AudioRecorder;
