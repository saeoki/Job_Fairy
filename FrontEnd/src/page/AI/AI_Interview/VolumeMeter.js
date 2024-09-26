// // VolumeMeter.js
// import React, { useEffect, useState } from 'react';
// import LinearProgress from '@mui/material/LinearProgress';
// import MicIcon from '@mui/icons-material/Mic';

// function VolumeMeter({ audioStream }) {
//   const [volume, setVolume] = useState(0);

//   useEffect(() => {
//     if (!audioStream) return;

//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     const audioSource = audioContext.createMediaStreamSource(audioStream);
//     const analyser = audioContext.createAnalyser();
//     analyser.fftSize = 32;
//     analyser.smoothingTimeConstant = 0.1;

//     audioSource.connect(analyser);

//     const dataArray = new Uint8Array(analyser.frequencyBinCount);

//     const updateVolume = () => {
//       analyser.getByteFrequencyData(dataArray);
//       const total = dataArray.reduce((acc, val) => acc + val, 0);
//       const average = total / dataArray.length;

//       // 볼륨 임계값 설정 (예: 10 이상일 때만 업데이트)
//       const threshold = 50;
//       if (average > threshold) {
//         setVolume(average);
//       } else {
//         setVolume(0);
//       }

//       requestAnimationFrame(updateVolume);
//     };

//     updateVolume();

//     return () => {
//       analyser.disconnect();
//       audioSource.disconnect();
//     };
//   }, [audioStream]);

//   return (
//     <div className="gauge-box">
//       <div className="icon-progress-container">
//         <MicIcon />
//         <LinearProgress variant="determinate" value={volume} className="gauge-progress" />
//       </div>
//     </div>
//   );
// }

// export default VolumeMeter;
// VolumeMeter.js
import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import MicIcon from '@mui/icons-material/Mic';

function VolumeMeter({ audioStream }) {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!audioStream) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioSource = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 32;
    analyser.smoothingTimeConstant = 0.1;

    audioSource.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const total = dataArray.reduce((acc, val) => acc + val, 0);
      const average = total / dataArray.length;

      // 볼륨 임계값 설정
      const threshold = 50;
      if (average > threshold) {
        setVolume(average);
      } else {
        setVolume(0);
      }

      requestAnimationFrame(updateVolume);
    };

    updateVolume();

    return () => {
      analyser.disconnect();
      audioSource.disconnect();
    };
  }, [audioStream]);

  return (
    <div className="gauge-box">
      <div className="icon-progress-container">
        <MicIcon />
        <LinearProgress variant="determinate" value={volume} className="gauge-progress" />
      </div>
    </div>
  );
}

export default VolumeMeter;
