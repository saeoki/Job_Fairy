// // Outputpage.js

// import React from 'react';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

// const bull = (
//   <Box
//     component="span"
//     sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
//   >
//     •
//   </Box>
// );

// function Outputpage({ selectedJob }) {
//   return (
//     <Card sx={{ minWidth: 275 }}>
//       <CardContent>
//         <Typography className='output-job-box' sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//           선택 직무
//         </Typography>
//         <Typography variant="h5" component="div">
//             {selectedJob}
//         </Typography>
//         <Typography sx={{ mb: 1.5 }} color="text.secondary">
//           adjective
//         </Typography>
//         <Typography variant="body2">
//           well meaning and kindly.
//           <br />
//           {'"a benevolent smile"'}
//         </Typography>
//       </CardContent>
//       <CardActions>
//         <Button size="small">Learn More</Button>
//       </CardActions>
//     </Card>
//   );
// }
// export default Outputpage;
import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Outputpage({ selectedJob }) {
  return (
    <div >
        <Card variant="outlined">
            <CardContent>
                <Typography className='output-title-box'>
                선택 직무
                </Typography>
                <Typography className='output-result-box' >
                {selectedJob}
                </Typography>

                <Typography className='output-title-box'>
                입력 키워드
                </Typography>
                <Typography className='output-result-box' >
                    {/* 키워드 1 */}
                </Typography>

                <Typography className='output-title-box'>
                    개인 설정 적용 여부
                </Typography>

                <Typography className='output-title-box'>
                    추가 내용
                </Typography>
                <Typography className='output-result-box' >
                    {/* 추가 내용 1 */}
                </Typography>
            </CardContent>
            {/* <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions> */}
            </Card>
        <div>
            <p>자기 소개서 출력 결과</p>
            <button>
                저장하기
            </button>
            <p>결과</p>
        </div>
    </div>
    
  );
}
export default Outputpage;
