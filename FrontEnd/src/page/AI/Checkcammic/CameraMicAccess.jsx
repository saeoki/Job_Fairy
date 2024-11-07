
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import React, { useRef, useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress'; 
import MicIcon from '@mui/icons-material/Mic'; 

import '../css/checkcammic.css'; 

function CameraMicAccess() {
  const videoRef = useRef(null);
  const constraints = {
    video: true,
    audio: {
      echoCancellation: true, // 에코 캔슬레이션 활성화
      noiseSuppression: true, // 노이즈 억제 활성화
      autoGainControl: true,  // 자동 이득 제어 활성화
    }
  };
  const [volume, setVolume] = useState(0); // 마이크 음량 상태

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
  }, []);

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
    analyzer.fftSize = 32;
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

  return (
    <div className="CheckCamMic-box"> {/* CSS 클래스 적용 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted // 비디오 음소거 설정
        className="video-box"
        style={{ transform: 'scaleX(-1)' }} // 좌우 반전 인라인 스타일 추가
      /> {/* CSS 클래스 적용 */}
      <div className="gauge-box"> {/* CSS 클래스 적용 */}

        <div className="icon-progress-container">
          <MicIcon /> 
          <LinearProgress variant="determinate" value={volume} className="gauge-progress" />          
        </div>
      </div>
      <div className="button-box">
        <Link to="/AIinterview">
          <Button className="return-button" variant="contained">
            점검 완료
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default CameraMicAccess;
