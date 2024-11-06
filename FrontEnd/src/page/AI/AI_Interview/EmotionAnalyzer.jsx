
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmotionAnalyzer({ videoRef, isActive, onEmotionData }) {
  const [intervalId, setIntervalId] = useState(null);

  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  };

  const sendImageToServer = async () => {
    const image = captureImage();
    if (!image) return;

    const blob = await (await fetch(image)).blob();
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');

    try {
      const response = await axios.post('http://localhost:5003/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (onEmotionData) {
        onEmotionData(response.data.accumulated_emotions);
      }
    } catch (error) {
      console.error('Error uploading image', error);
    }
  };

  useEffect(() => {
    if (isActive && !intervalId) {
      const id = setInterval(sendImageToServer, 500);
      setIntervalId(id);
    } else if (!isActive && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [isActive]);

  return null;
}

export default EmotionAnalyzer;
