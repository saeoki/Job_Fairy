import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Divider, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { generateEmotionFeedback } from './evaluateEmotions';
import '../css/interview_end.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Interview_chart({ accumulatedEmotions, onEmotionFeedback }) {
  const [emotionFeedback, setEmotionFeedback] = useState('');

  // 상위 3개의 감정과 점수를 추출하는 함수
  const getTopThreeEmotions = (data) => {
    return Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  };

  // 100점 만점으로 변환하는 함수
  const convertToHundredScale = (data) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const hundredScaleData = {};
    Object.keys(data).forEach((key) => {
      hundredScaleData[key] = ((data[key] / total) * 100).toFixed(2);
    });
    return hundredScaleData;
  };

  // 막대 그래프 데이터를 생성
  const generateChartData = (data) => {
    const topThreeData = getTopThreeEmotions(data);
    const hundredScaleData = convertToHundredScale(topThreeData);
    const labels = Object.keys(hundredScaleData);
    const values = Object.values(hundredScaleData);

    return {
      labels,
      datasets: [
        {
          label: 'Top 3 Emotion Scores (100-point scale)',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // 감정 피드백을 가져옴
  useEffect(() => {
    const fetchEmotionFeedback = async () => {
      if (accumulatedEmotions && Object.keys(accumulatedEmotions).length > 0) {
        const feedback = await generateEmotionFeedback(accumulatedEmotions);
        setEmotionFeedback(feedback);
        onEmotionFeedback(feedback);
      }
    };
    fetchEmotionFeedback();
  }, [accumulatedEmotions, onEmotionFeedback]);

  return (
    <Box className="interview-results-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
      <Card className="interview-results-card" sx={{ width: '100%', maxWidth: { xs: '100%', md: 800 }, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
            Interview Emotion Analysis
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* 막대 그래프로 상위 3개의 감정 점수 표시 */}
          <Box sx={{ width: '100%', height: { xs: 250, sm: 300, md: 400 }, mb: 2 }}>
            <Bar
              data={generateChartData(accumulatedEmotions)}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    min: 0,
                    max: 100,
                    ticks: {
                      stepSize: 20,
                    },
                  },
                },
              }}
            />
          </Box>

          {/* 모든 감정 점수 목록 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', mb: 2 }}>
            {Object.entries(convertToHundredScale(accumulatedEmotions)).map(([emotion, score]) => (
              <Box key={emotion} sx={{ textAlign: 'center', p: 1, minWidth: 80 }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {emotion}
                </Typography>
                <Typography variant="body2">{score}점</Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 감정 평가 메시지 - 토글 가능한 아코디언 */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                감정분석 평가
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ p: 2, bgcolor: '#f0f4f8', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {emotionFeedback || <CircularProgress size={20} />}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Interview_chart;
