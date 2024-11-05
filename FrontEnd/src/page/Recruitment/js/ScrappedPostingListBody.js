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
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import ScrapButton from '../../../components/ScrapButton';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { LoginExpErrorToast } from "../../../components/ToastMessage";

const BackendIP = process.env.REACT_APP_EC2_IP;


export default function ScrappedPostingList() {
  const [jobPostings, setJobPostings] = useState([]); 
  const [kakaoId, setKakaoId] = useState("");
  const [totalPages, setTotalPages] = useState(1); 
  const [totalItems, setTotalItems] = useState(0); 
  const [noDataMessage, setNoDataMessage] = useState('');
  const [scrappedJobs, setScrappedJobs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page')) || 1; 

  useEffect(() => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Token not found");
        } else {
            const userData = jwtDecode(token);
            setKakaoId(userData.kakaoId);
        }
    } catch (error) {
        LoginExpErrorToast();
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    }
  }, []); // 빈 배열로 한 번만 실행

  useEffect(() => {
    const fetchScrappedJobs = async (page) => {
        if (kakaoId) {
            try {
                const response = await axios.get(`${BackendIP}/api/Recruitment/ScrappedPostingList/${kakaoId}?page=${page}`);
                // const response = await axios.get(`http://localhost:5000/api/Recruitment/ScrappedPostingList/${kakaoId}?page=${page}`);
                const data = await response.data; 
                setScrappedJobs(data.scrappedJobs);
                setTotalPages(data.totalPages);
                setTotalItems(data.totalItems);
            } catch (err) {
                alert("오류 발생: " + err.message);
            }
        }
    };

    fetchScrappedJobs(currentPage);
}, [kakaoId, currentPage]);

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
          스크랩 공고 모아보기
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        {scrappedJobs.length > 0 && (
          <Typography variant="h6" sx={{ color: '#1976d2' }}>
            총 {totalItems} 건
          </Typography>)}
      </Box>

      {/* Job Listings */}
      {noDataMessage ? (
        <Alert severity="info" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{noDataMessage}</Alert>
      ) : (
        scrappedJobs.map((job, index) => (
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
                <ScrapButton kakaoId={kakaoId} jobId={job.jobId} jobPosting={job} />

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
