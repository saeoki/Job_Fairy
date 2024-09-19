import React, { useState, useEffect } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';

export default function JobPostingListBody() {
  const [jobPostings, setJobPostings] = useState([]);  // 서버에서 가져올 데이터 상태
  const [totalPages, setTotalPages] = useState(1);      // 전체 페이지 수
  const [totalItems, setTotalItems] = useState(0);      // 전체 공고 개수
  const navigate = useNavigate();
  const location = useLocation();
  const [sortBy, setSortBy] = useState('');


  // 쿼리 파라미터에서 페이지 번호 추출
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1;  // 쿼리 파라미터가 없으면 1로 설정

  // 페이지 변경 시 API 호출
  const fetchJobPostings = async (page) => {
    try {
      const response = await fetch(`http://localhost:5000/api/Recruitment/JobPostingList?page=${page}`);
      const data = await response.json();
      setJobPostings(data.jobPostings);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error("Error fetching job postings:", error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때와 페이지 변경 시 데이터를 가져옴
  useEffect(() => {
    fetchJobPostings(currentPage);  // currentPage는 URL에서 가져옴
  }, [currentPage]);

  const handleSortChange = (event) => {
    // 정렬 기준 변경 시 처리 (필요에 따라 구현)
  };

  const handlePageChange = (event, value) => {
    // 페이지 변경 시 URL 업데이트
    navigate(`?page=${value}`);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''; // timestamp가 없으면 빈 문자열 반환
    const date = new Date(timestamp * 1000); // timestamp는 초 단위이므로 1000을 곱해 밀리초로 변환
    return date.toLocaleDateString(); // YYYY-MM-DD 형식으로 변환
  };

  const formatLocation = (location) => {
    if (!location) return '위치 정보 없음'; 
    // '&gt;'를 '>'로 변환
    const decodedLocation = location.replace(/&gt;/g, '>');
  
    // 두 번째 '>'를 찾아 그 앞까지만 사용
    const firstPart = decodedLocation.split('>').slice(0, 2).join(' ');
  
    // '>'을 공백으로 변환하여 반환
    return firstPart.replace(/>/g, ' ');
  };
  
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
        {jobPostings.length > 0 && (
          <Typography variant="h6" sx={{ color: '#1976d2' }}>
            총 {totalItems} 건
          </Typography>)}
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


      {/* 여기서 위에 정의한 것을 각 박스에 할당 */}
      {/* 프론트 코드 분석좀 하자 */}

      {jobPostings.map((job, index) => (
        <Paper key={index} elevation={3} sx={{ mb: 2, p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body1">
                <a href={job.company.detail.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#1E90FF' }}>
                  {job.company.detail.name}
                </a>
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {job.position.title}
                </a>
        </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="body2">{formatLocation(job.position.location.name)}</Typography>
              {/* JS에서 하이픈은 변수명으로 사용할 수 없기 때문에 대괄호표기 */}
              <Typography variant="body2">{job.position['experience-level'].name}</Typography>
              <Typography variant="body2">{formatTimestamp(job['expiration-timestamp'])}</Typography>
            </Box>
            <FormControlLabel control={<Checkbox />} label="스크랩" />
          </Box>
        </Paper>
      ))}

      {/* 페이지네이션 */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}  // 전체 페이지 수 반영
          page={currentPage}   // 현재 페이지 상태 반영
          onChange={handlePageChange}  // 페이지 변경 시 이벤트 핸들러
          color="primary"
        />
      </Box>
    </Container>
  );
}