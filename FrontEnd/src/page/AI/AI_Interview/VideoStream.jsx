// VideoStream.js
import React from 'react';

function VideoStream({ videoRef }) {
  return <video ref={videoRef} autoPlay playsInline className="video-box" />;
}

export default VideoStream;
