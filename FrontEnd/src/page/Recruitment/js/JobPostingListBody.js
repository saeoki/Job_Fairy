import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Pagination,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function JobPostingListBody() {
  const [sortBy, setSortBy] = useState('');

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const jobPostings = [
    { company: '기업 1', position: '[플랫폼엔지니어링팀] 플랫폼 컨설턴트 경력사원 채용', location: '서울전체', department: '7~8년 - 경력직', code: 'D - 21' },
    { company: '기업 2', position: 'AI Researcher 신입 채용', location: '서울전체', department: '신입·경력', code: 'D - 30' },
    { company: '기업 3', position: 'AI Researcher 신입 채용', location: '서울전체', department: '신입·경력', code: 'D - 30' },
    { company: '기업 4', position: 'AI Researcher 신입 채용', location: '서울전체', department: '신입·경력', code: 'D - 30' },
    { company: '기업 5', position: 'AI Researcher 신입 채용', location: '서울전체', department: '신입·경력', code: 'D - 30' },
    { company: '기업 6', position: 'AI Researcher 신입 채용', location: '서울전체', department: '신입·경력', code: 'D - 30' },
    { company: '기업 7', position: 'AI Researcher 신입 채용', location: '서울전체', department: '신입·경력', code: 'D - 30' },
    { company: '기업 8', position: 'AI Researcher 신입 채용', location: '서울전체', department: '신입·경력', code: 'D - 30' },
    { company: '기업 9', position: 'AI Researcher 신입 채용', location: '서울전체', department: '신입·경력', code: 'D - 30' },
    { company: '기업 10', position: 'AI Researcher 신입 채용', location: '서울전체', department: '신입·경력', code: 'D - 30' },

  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ my: 3 }}>
        상세 검색
      </Typography>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={4}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ color: '#6979F8', fontWeight: 'bold' }}>직무를 고르세요</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel control={<Checkbox />} label="IT/개발 데이터" />
              <FormControlLabel control={<Checkbox />} label="기획 전략" />
              <FormControlLabel control={<Checkbox />} label="마케팅 홍보 조사" />
              <FormControlLabel control={<Checkbox />} label="의료" />
              <FormControlLabel control={<Checkbox />} label="연구 R&D" />
              <FormControlLabel control={<Checkbox />} label="교육" />
              <FormControlLabel control={<Checkbox />} label="금융 보험" />
              <FormControlLabel control={<Checkbox />} label="미디어 문화 스포츠" />
              <FormControlLabel control={<Checkbox />} label="건설 건축" />
              <FormControlLabel control={<Checkbox />} label="운전 운송 배송" />
              <FormControlLabel control={<Checkbox />} label="고객상담 TM" />
              <FormControlLabel control={<Checkbox />} label="영업 판매 무역" />
              <FormControlLabel control={<Checkbox />} label="상품기획 MD" />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={4}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ color: '#6979F8', fontWeight: 'bold' }}>지역</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel control={<Checkbox />} label="서울" />
              <FormControlLabel control={<Checkbox />} label="경기" />
              <FormControlLabel control={<Checkbox />} label="인천" />
              <FormControlLabel control={<Checkbox />} label="부산" />
              <FormControlLabel control={<Checkbox />} label="대구" />
              <FormControlLabel control={<Checkbox />} label="광주" />
              <FormControlLabel control={<Checkbox />} label="대전" />
              <FormControlLabel control={<Checkbox />} label="울산" />
              <FormControlLabel control={<Checkbox />} label="세종" />
              <FormControlLabel control={<Checkbox />} label="강원" />
              <FormControlLabel control={<Checkbox />} label="경남" />
              <FormControlLabel control={<Checkbox />} label="경북" />
              <FormControlLabel control={<Checkbox />} label="전남" />
              <FormControlLabel control={<Checkbox />} label="전북" />
              <FormControlLabel control={<Checkbox />} label="충남" />
              <FormControlLabel control={<Checkbox />} label="충북" />
              <FormControlLabel control={<Checkbox />} label="제주" />
              <FormControlLabel control={<Checkbox />} label="전국" />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={4}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ color: '#6979F8', fontWeight: 'bold' }}>경력</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel control={<Checkbox />} label="신입" />
              <FormControlLabel control={<Checkbox />} label="1~3년" />
              <FormControlLabel control={<Checkbox />} label="4~8년" />
              <FormControlLabel control={<Checkbox />} label="9년 이상" />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ color: '#1976d2' }}>총 0000 건</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="sort-select-label">정렬 기준</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sortBy}
            label="정렬 기준"
            onChange={handleSortChange}
          >
            <MenuItem value="recent">최신순</MenuItem>
            <MenuItem value="popular">인기순</MenuItem>
            <MenuItem value="salary">연봉순</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {jobPostings.map((job, index) => (
        <Paper key={index} elevation={3} sx={{ mb: 2, p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{job.company}</Typography>
              <Typography variant="body1">{job.position}</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="body2">{job.location}</Typography>
              <Typography variant="body2">{job.department}</Typography>
              <Typography variant="body2">{job.code}</Typography>
            </Box>
            <FormControlLabel control={<Checkbox />} label="스크랩" />
          </Box>
        </Paper>
      ))}

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination count={10} color="primary" />
      </Box>
    </Container>
  );
}