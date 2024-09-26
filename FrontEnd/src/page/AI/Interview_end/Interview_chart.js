
import React from 'react';
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
import '../css/interview_end.css'; // CSS 파일 import

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Interview_chart({ accumulatedEmotions }) {
  // 막대 그래프 데이터를 생성하는 함수
  const generateChartData = (data) => {
    const labels = Object.keys(data);
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
    <Box className="interview-results-container">
      <Card className="interview-results-card">
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            면접결과
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

export default Interview_chart;
