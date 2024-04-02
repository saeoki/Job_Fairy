// import React, { useRef } from 'react';

// function CameraMicAccess() {
//   const videoRef = useRef(null);
//   const constraints = {
//     video: true,
//     audio: true
//   };

//   const requestUserMedia = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       handleSuccess(stream);
//     } catch (err) {
//       console.error('Error accessing user media:', err);
//     }
//   };

//   const handleSuccess = stream => {
//     const video = videoRef.current;
//     if (video) {
//       video.srcObject = stream;
//     }
//   };

//   return (
//     <div>
//       <button onClick={requestUserMedia}>카메라 및 마이크 액세스 요청</button>
//       <video ref={videoRef} autoPlay playsInline />
//     </div>
//   );
// }

// export default CameraMicAccess;


import React, { useRef, useEffect } from 'react';

function CameraMicAccess() {
  const videoRef = useRef(null);
  const constraints = {
    video: true,
    audio: true
  };

  useEffect(() => {
    const requestUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
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

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
}

export default CameraMicAccess;
