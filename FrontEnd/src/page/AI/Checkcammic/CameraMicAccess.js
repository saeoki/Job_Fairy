import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from "react-router-dom";
import React, { useRef, useEffect, useState } from 'react';
import '../css/checkcammic.css'; // CSS 파일 import
import LinearProgress from '@mui/material/LinearProgress'; // Progress Bar 컴포넌트 import
import MicIcon from '@mui/icons-material/Mic'; // 마이크 아이콘 import

function CameraMicAccess() {
  const videoRef = useRef(null);
  const constraints = {
    video: true,
    audio: true
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
    const audioContext = new AudioContext();
    const audioStream = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
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
      <video ref={videoRef} autoPlay playsInline className="video-box" /> {/* CSS 클래스 적용 */}
      <div className="gauge-box"> {/* CSS 클래스 적용 */}
        <div className="icon-progress-container">
        <MicIcon /> 
          <LinearProgress variant="determinate" value={volume} className="gauge-progress" />          
        </div>
      </div>
      <div className="button-box"> {/* CSS 클래스 적용 */}
        <Link to="/AIinterview">
          <Button className="return-button" variant="contained" href="#contained-buttons">
            점검 완료
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default CameraMicAccess;
