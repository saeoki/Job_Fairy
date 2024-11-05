import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Pagination,
  Alert,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import ScrapButton from '../../../components/ScrapButton';
import { jwtDecode } from 'jwt-decode';

const BackendIP = process.env.REACT_APP_EC2_IP;


export default function OpenRecruitmentBody() {
  const [jobPostings, setJobPostings] = useState([]); 
  const [kakaoId, setKakaoId] = useState("");
  const [totalPages, setTotalPages] = useState(1); 
  const [totalItems, setTotalItems] = useState(0); 
  const [noDataMessage, setNoDataMessage] = useState('');
  const [scrappedJobs, setScrappedJobs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('');


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1; 

  // 로그인 상태 확인
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = jwtDecode(token);
        setKakaoId(userData.kakaoId);
      }
    } catch (error) {
      console.warn("로그인 상태를 확인하는 중 오류 발생:", error);
    }
  }, []);

  const fetchJobPostings = async (page) => {
    try {
        const response = await fetch(`${BackendIP}/api/Recruitment/OpenRecruitment?page=${page}`, {
        // const response = await fetch(`http://localhost:5000/api/Recruitment/OpenRecruitment?page=${page}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bbs_gb: 1 }),
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
      setScrappedJobs(data.jobPostings.map(() => false));
    } catch (error) {
      console.error("Error fetching job postings:", error);
    }
  };


  useEffect(() => {
    fetchJobPostings(currentPage);
  }, [currentPage]);

  const handleSortChange = (event) => {
    // 정렬 기준 변경 시 처리 (필요에 따라 구현)
  };


  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const formatLocation = (location) => {
    if (!location) return '위치 정보 없음'; 
    const decodedLocation = location.replace(/&gt;/g, '>');
    const firstPart = decodedLocation.split('>').slice(0, 2).join(' ');
    return firstPart.replace(/>/g, ' ');
  };

    // 도큐먼트 생성 타임스탬프 처리
  const formatCreationDate = (creationDate) => {
    if (!creationDate) return ''; // creationDate가 없으면 빈 문자열 반환
    return new Date(creationDate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ my: { xs: 2, sm: 4 } }}>
      {/* Page Header */}
      <Box textAlign="center" mb={3}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.4rem', sm: '2.2rem', md: '2.5rem' },
            fontFamily: 'Inter, sans-serif', 
            color: '#3C4858', 
            backgroundColor: '#E3EAF5', 
            padding: { xs: '6px 12px', sm: '10px 20px' },
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 
            display: 'inline-block',
          }}
        >
          공개채용 정보 모아보기
        </Typography>
        <Typography 
          variant="body1" 
          color="textSecondary"
          sx={{
            marginTop: '8px', 
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
            color: '#6C757D', 
            fontFamily: 'Inter, sans-serif',
          }}
        >
          IT개발·데이터 분야의 공개채용 정보를 모두 모아놓았습니다.
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
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
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
          {/* i 기호와 툴팁 추가 */}
          <Tooltip title="채용공고 데이터는 매일 00시 00분에 자동으로 업데이트 됩니다." arrow>
            <IconButton sx={{ padding: 0, marginRight: '5px' }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Typography variant="body2" sx={{ color: '#888', marginRight: 1 }}>
            최근 업데이트:
          </Typography>

          <Typography variant="body2" sx={{ color: '#888', marginRight: 2 }}>
            {formatCreationDate(jobPostings[0]?.creationDate)}
          </Typography>
      </Box>


      {/* Job Listings */}
      {noDataMessage ? (
        <Alert severity="info" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{noDataMessage}</Alert>
      ) : (
        jobPostings.map((job, index) => (
          <Paper key={index} elevation={3} sx={{
            mb: 1.5, 
            p: { xs: 1.5, sm: 2, md: 3 },
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
          }}>
            <Box 
              display="flex" 
              flexDirection={{ xs: 'column', sm: 'row' }} 
              justifyContent="space-between" 
              alignItems={isSmallScreen ? 'center' : 'flex-start'}
              textAlign={isSmallScreen ? 'center' : 'left'}
            >
              <Box mb={{ xs: 1, sm: 0 }}>
                <Typography variant="body1" sx={{ fontSize: { xs: '0.8rem', sm: '0.95rem' } }}>
                  <a href={job?.company?.detail?.href || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#1E90FF' }}>
                    {job?.company?.detail?.name || '회사 이름 없음'}
                  </a>
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.2rem' } }}>
                  <a href={job?.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {job?.position?.title || '제목 없음'}
                  </a>
                </Typography>
              </Box>
              <Box textAlign={isSmallScreen ? 'center' : 'right'} sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                {/* ScrapButton에 kakaoId 전달 */}
                <ScrapButton kakaoId={kakaoId} jobId={job.id} jobPosting={job} />

                <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                  {formatLocation(job?.position?.location?.name) || '위치 정보 없음'}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                  {job?.position?.experience_level?.name || '경력 정보 없음'}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                  {formatTimestamp(job?.expiration_timestamp)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))
      )}

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => {
            const params = new URLSearchParams(location.search);
            params.set('page', value);
            navigate(`?${params.toString()}`);
          }}
          color="primary"
          siblingCount={isSmallScreen ? 0 : 1} // 화면 크기에 따라 페이지네이션의 인접 페이지 수를 조정
          boundaryCount={isSmallScreen ? 1 : 2} // 화면 크기에 따라 페이지네이션의 시작과 끝 페이지 수를 조정
          sx={{
            '.MuiPaginationItem-root': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            },
          }}
        />
      </Box>
    </Container>
  );
}
