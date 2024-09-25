

require('dotenv').config();

const express = require('express');
const { WebSocketServer } = require('ws');
const speech = require('@google-cloud/speech');

const app = express();
const port = 5001;


const client = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  const recognizeStream = client
    .streamingRecognize({
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'ko-KR', // 사용하고자 하는 언어 코드
      },
      interimResults: true, // 부분 결과 전송
    })
    .on('error', console.error)
    .on('data', (data) => {
      ws.send(JSON.stringify({ transcription: data.results[0].alternatives[0].transcript }));
    });

  ws.on('message', (message) => {
    recognizeStream.write(message);
  });

  ws.on('close', () => {
    recognizeStream.end();
    console.log('Client disconnected');
  });
});
