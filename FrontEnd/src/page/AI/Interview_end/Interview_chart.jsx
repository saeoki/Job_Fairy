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

  // 모든 감정 점수를 100점 만점으로 변환하고 크기순으로 정렬하는 함수
  const convertAndSortEmotions = (data) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const hundredScaleData = Object.entries(data)
      .map(([key, value]) => [key, ((value / total) * 100).toFixed(1)])  // 100점 만점으로 변환 후 소수점 한 자릿수까지 표시
      .sort(([, a], [, b]) => b - a); // 점수 기준으로 내림차순 정렬

    return hundredScaleData;
  };

  // 막대 그래프 데이터 생성
  const generateChartData = (data) => {
    const sortedData = convertAndSortEmotions(data);
    const labels = sortedData.map(([emotion]) => emotion);
    const values = sortedData.map(([, score]) => score);

    return {
      labels,
      datasets: [
        {
          label: 'Emotion Scores (100-point scale)',
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

          {/* 모든 감정 점수를 크기순으로 막대 그래프로 표시 */}
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
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.raw}점`,
                    },
                  },
                },
              }}
            />
          </Box>

          {/* 감정 점수 목록 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', mb: 2 }}>
            {convertAndSortEmotions(accumulatedEmotions).map(([emotion, score]) => (
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
