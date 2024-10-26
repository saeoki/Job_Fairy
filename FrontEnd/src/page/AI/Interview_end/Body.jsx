
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';
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



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function InterviewResults() {
  const location = useLocation();
  const { accumulatedEmotions } = location.state || {};

  // 막대 그래프 데이터를 생성하는 함수
  const generateChartData = (data) => {
    const labels = Object.keys(data).map(key => emotionLabelsInKorean[key] || key); // 영어 라벨을 한국어로 변환
    const values = Object.values(data);
    return {
      labels,
      datasets: [
        {
          label: 'Emotion Scores',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ minWidth: 700 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Interview Results
          </Typography>
          {accumulatedEmotions && Object.keys(accumulatedEmotions).length > 0 ? (
            <Bar data={generateChartData(accumulatedEmotions)} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No data available.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default InterviewResults;
