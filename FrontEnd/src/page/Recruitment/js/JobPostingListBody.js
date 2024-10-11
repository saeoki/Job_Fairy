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
  FormControlLabel,
  Button,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, useLocation } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

export default function JobPostingListBody() {
  const [jobPostings, setJobPostings] = useState([]);  // 서버에서 가져올 데이터 상태
  const [totalPages, setTotalPages] = useState(1);      // 전체 페이지 수
  const [totalItems, setTotalItems] = useState(0);      // 전체 공고 개수
  const [selectedFilters, setSelectedFilters] = useState({
    jobs: [],
    locations: [],
    experiences: []
  });  // 체크박스 상태를 관리할 필터 상태

  const [noDataMessage, setNoDataMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [sortBy, setSortBy] = useState('');


  // 각 JobPosting의 스크랩 상태를 관리하는 배열
  const [scrappedJobs, setScrappedJobs] = useState(jobPostings.map(() => false));

  // 해당 JobPosting의 스크랩 상태를 토글
  const handleScrapClick = (index) => {
    const updatedScraps = [...scrappedJobs];
    updatedScraps[index] = !updatedScraps[index]; // 해당 잡포스팅의 스크랩 상태 토글
    setScrappedJobs(updatedScraps);
  };

  // 쿼리 파라미터에서 페이지 번호 추출
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1;  // 쿼리 파라미터가 없으면 1로 설정

  // URL에서 필터정보 받아오고 셋팅
  useEffect(() => {
    const jobs = query.get('jobs') ? query.get('jobs').split(',') : [];
    const locations = query.get('locations') ? query.get('locations').split(',') : [];
    const experiences = query.get('experiences') ? query.get('experiences').split(',') : [];

    setSelectedFilters({ jobs, locations, experiences });
  }, [location.search]);


  // 페이지 변경 시 API 호출
  const fetchJobPostings = async (page, filters = {}) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_EC2_IP}:5000/api/Recruitment/JobPostingList?page=${page}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });
      const data = await response.json();

      if (data.jobPostings.length === 0) {
        setNoDataMessage("일치하는 데이터가 없습니다");
      } else {
        setNoDataMessage('');
      }

      setJobPostings(data.jobPostings);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error("Error fetching job postings:", error);
    }
  };

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

  // 체크박스 상태 변경 핸들러
  const handleCheckboxChange = (category, value) => {
    setSelectedFilters((prevFilters) => {
      const updatedCategory = prevFilters[category].includes(value)
        ? prevFilters[category].filter((item) => item !== value)
        : [...prevFilters[category], value];
      return { ...prevFilters, [category]: updatedCategory };
    });
  };

  // 필터 적용 버튼 클릭 시 필터링 API 호출
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedFilters.jobs.length > 0) params.set('jobs', selectedFilters.jobs.join(','));
    if (selectedFilters.locations.length > 0) params.set('locations', selectedFilters.locations.join(','));
    if (selectedFilters.experiences.length > 0) params.set('experiences', selectedFilters.experiences.join(','));
    params.set('page', '1'); // Reset to first page when applying filters
    navigate(`?${params.toString()}`);
    fetchJobPostings(1, selectedFilters);
  };
  
  // 페이지가 바뀌면 fetch, 검색 조건은 그대로
  useEffect(() => {
    fetchJobPostings(currentPage, selectedFilters);
  }, [currentPage]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ my: 3 }}>
        상세 검색
      </Typography>

      {/* 선택한 필터 확인 UI */}
      <Box mb={3}>
        <Typography variant="body1">
          <strong>선택된 직무:</strong> {selectedFilters.jobs.length > 0 ? selectedFilters.jobs.join(', ') : '없음'}
        </Typography>
        <Typography variant="body1">
          <strong>선택된 지역:</strong> {selectedFilters.locations.length > 0 ? selectedFilters.locations.join(', ') : '없음'}
        </Typography>
        <Typography variant="body1">
          <strong>선택된 경력:</strong> {selectedFilters.experiences.length > 0 ? selectedFilters.experiences.join(', ') : '없음'}
        </Typography>
      </Box>


      <Grid container spacing={2} mb={4}>
        {/* 필터 UI */}
        <Grid item xs={12} md={4}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ color: '#6979F8', fontWeight: 'bold' }}>직무를 고르세요</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '유지보수')} />}
                label="유지보수"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '웹개발')} />}
                label="웹개발"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '백엔드/서버개발')} />}
                label="백엔드/서버개발"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '프론트엔드')} />}
                label="프론트엔드"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '기술지원')} />}
                label="기술지원"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', 'SE(시스템엔지니어)')} />}
                label="SE(시스템엔지니어)"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '정보보안')} />}
                label="정보보안"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '앱개발')} />}
                label="앱개발"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '데이터분석가')} />}
                label="데이터분석가"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '데이터엔지니어')} />}
                label="데이터엔지니어"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '데이터 사이언티스트')} />}
                label="데이터 사이언티스트"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', 'DBA')} />}
                label="DBA"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', 'SI개발')} />}
                label="SI개발"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', 'IT컨설팅')} />}
                label="IT컨설팅"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', 'QA/테스터')} />}
                label="QA/테스터"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '퍼블리셔')} />}
                label="퍼블리셔"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '게임개발')} />}
                label="게임개발"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '개발PM')} />}
                label="개발PM"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '보안관제')} />}
                label="보안관제"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('jobs', '보안컨설팅')} />}
                label="보안컨설팅"
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={4}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ color: '#6979F8', fontWeight: 'bold' }}>지역</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '서울')} />}
                label="서울"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '경기')} />}
                label="경기"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '인천')} />}
                label="인천"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '부산')} />}
                label="부산"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '대구')} />}
                label="대구"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '광주')} />}
                label="광주"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '대전')} />}
                label="대전"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '울산')} />}
                label="울산"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '세종')} />}
                label="세종"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '강원')} />}
                label="강원"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '경남')} />}
                label="경남"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '경북')} />}
                label="경북"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '전남')} />}
                label="전남"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '전북')} />}
                label="전북"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '충남')} />}
                label="충남"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '충북')} />}
                label="충북"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('locations', '제주')} />}
                label="제주"
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={4}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ color: '#6979F8', fontWeight: 'bold' }}>경력</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('experiences', '신입')} />}
                label="신입"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('experiences', '1~3년')} />}
                label="1~3년"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('experiences', '4~8년')} />}
                label="4~8년"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleCheckboxChange('experiences', '9년 이상')} />}
                label="9년 이상"
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* 필터 적용 버튼 추가 */}
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 3, py: 1 }} // 둥근 모서리와 여백 스타일 추가
          onClick={applyFilters}  // 버튼 클릭 시 필터 적용 함수 호출
        >
          필터 적용
        </Button>
      </Box>

      <Divider sx={{ my: 4, borderColor: 'rgba(0, 0, 0, 0.5)', borderWidth: '1px' }} />



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
            <MenuItem value="popular">마감일순</MenuItem>
            <MenuItem value="salary">연봉순</MenuItem>
          </Select>
        </FormControl>
      </Box>


      
      {noDataMessage ? (
        <Alert severity="info">{noDataMessage}</Alert>
      ) : (
        jobPostings.map((job, index) => (
          <Paper key={index} elevation={3} sx={{ mb: 2, p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body1">
                  <a href={job?.company?.detail?.href || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#1E90FF' }}>
                    {job?.company?.detail?.name || '회사 이름 없음'}
                  </a>
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  <a href={job?.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {job?.position?.title || '제목 없음'}
                  </a>
                </Typography>
              </Box>
              <Box textAlign="right">
                {/* 스크랩 아이콘 버튼 */}
                <IconButton onClick={() => handleScrapClick(index)} color={scrappedJobs[index] ? "primary" : "default"}>
                  {scrappedJobs[index] ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>              
                <Typography variant="body2">{formatLocation(job?.position?.location?.name)}</Typography>
                <Typography variant="body2">{job?.position?.experience_level?.name || '경력 정보 없음'}</Typography>
                <Typography variant="body2">{formatTimestamp(job?.expiration_timestamp)}</Typography>
              </Box>
            </Box>
          </Paper>
        ))
      )}

      {/* 페이지네이션 */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => {
            const params = new URLSearchParams(location.search);
            params.set('page', value);  // 페이지 번호를 쿼리 스트링에 설정
            navigate(`?${params.toString()}`);
          }}
          color="primary"
        />
      </Box>
    </Container>
  );
}

