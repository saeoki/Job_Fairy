import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import openAIRequest from './openaiAPI'; // GPT API 호출 함수
import '../css/STTResult.css'; // CSS 파일을 import

function STTResult({ transcription }) {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const evaluateTranscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const evaluationResult = await openAIRequest(transcription);
      setEvaluation(evaluationResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (transcription) {
      evaluateTranscription();
    }
  }, [transcription]);

  return (
    <Box className="stt-result-container">
      <Card className="stt-result-card">
        <CardContent>
          {/* <Typography variant="h5" component="div" gutterBottom>
            STT 변환 결과
          </Typography>
          {transcription ? (
            <Typography variant="body1" component="p">
              {transcription}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No transcription available.
            </Typography>
          )} */}

          <Box mt={3}>
            <Typography variant="h6" component="div" gutterBottom>
              평가 결과
            </Typography>
            {loading ? (
              <Typography variant="body2" color="text.secondary">
                평가 중입니다...
              </Typography>
            ) : error ? (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            ) : evaluation ? (
              <Typography variant="body1" component="p">
                {evaluation}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                평가 결과를 불러올 수 없습니다.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default STTResult;
