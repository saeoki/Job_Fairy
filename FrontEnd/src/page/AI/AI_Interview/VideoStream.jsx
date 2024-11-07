// VideoStream.js
import React from 'react';
import './VideoStream.css'; // CSS 파일을 임포트합니다.

function VideoStream({ videoRef }) {
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="video-box flipped"
    />
  );
}

export default VideoStream;
