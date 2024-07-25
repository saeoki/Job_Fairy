// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import { Card, CardContent, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

// function Body() {
//   const location = useLocation();
//   const { accumulatedEmotions } = location.state || {};

//   return (
//     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//       <Card sx={{ minWidth: 275 }}>
//         <CardContent>
//           <Typography variant="h5" component="div" gutterBottom>
//             Interview Results
//           </Typography>
//           {accumulatedEmotions && Object.keys(accumulatedEmotions).length > 0 ? (
//             <List>
//               {Object.entries(accumulatedEmotions).map(([emotion, value]) => (
//                 <ListItem key={emotion}>
//                   <ListItemText
//                     primary={emotion}
//                     secondary={`Score: ${value.toFixed(2)}`}
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               No data available.
//             </Typography>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// export default Body;
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

// Chart.js 모듈 등록
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
