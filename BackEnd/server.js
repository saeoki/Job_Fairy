

// require('dotenv').config();

// const express = require('express');
// const { WebSocketServer } = require('ws');
// const speech = require('@google-cloud/speech');

// const app = express();
// const port = 5001;


// const client = new speech.SpeechClient({
//   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
// });

// const server = app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

// const wss = new WebSocketServer({ server });

// wss.on('connection', (ws) => {
//   console.log('Client connected');
  
// // 서버 코드에서 인코딩 설정 수정
// const recognizeStream = client
//   .streamingRecognize({
//     config: {
//       encoding: 'LINEAR16', // 클라이언트에서 보내는 인코딩과 일치시킴
//       sampleRateHertz: 48000, // 일반적으로 OGG_OPUS는 48000Hz를 사용
//       languageCode: 'ko-KR',
//     },
//     interimResults: true,
//   })

//     .on('error', console.error)
//     .on('data', (data) => {
//       ws.send(JSON.stringify({ transcription: data.results[0].alternatives[0].transcript }));
//     });

//   ws.on('message', (message) => {
//     recognizeStream.write(message);
//   });

//   ws.on('close', () => {
//     recognizeStream.end();
//     console.log('Client disconnected');
//   });
// });

// server.js
require('dotenv').config();

const express = require('express');
const { WebSocketServer } = require('ws');
const speech = require('@google-cloud/speech');

const app = express();
const port = 5001;

const client = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  let recognizeStream = null;

  ws.on('message', (message) => {
    if (!recognizeStream) {
      // 스트림 초기화
      recognizeStream = client
        .streamingRecognize({
          config: {
            encoding: 'WEBM_OPUS', // 클라이언트에서 보내는 인코딩과 일치시킴
            sampleRateHertz: 48000,
            languageCode: 'ko-KR',
          },
          interimResults: true,
        })
        .on('error', (err) => {
          console.error('Error in recognizeStream:', err);
          ws.send(JSON.stringify({ error: err.message }));
        })
        .on('data', (data) => {
          if (data.results[0] && data.results[0].alternatives[0]) {
            ws.send(
              JSON.stringify({ transcription: data.results[0].alternatives[0].transcript })
            );
          }
        });
    }

    // 오디오 데이터 전달
    recognizeStream.write(Buffer.from(message));
  });

  ws.on('close', () => {
    if (recognizeStream) {
      recognizeStream.end();
    }
    console.log('Client disconnected');
  });
});

