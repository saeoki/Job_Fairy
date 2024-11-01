import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import { LoginExpErrorToast } from "../../../components/ToastMessage";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Pagination,
  useMediaQuery,
  Alert
} from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

import "../css/Custom.css";

const BackendIP = process.env.REACT_APP_EC2_IP;

const Body = () => {
    const [kakaoId, setKakaoId] = useState("");
    const [userdata, setUserData] = useState({
        kakaoId: kakaoId,
        nickname: "",
        military: "",
        position: [],
        location: [],
        salary: [2000, 12000],
    });
    const [jobPostings, setJobPostings] = useState([]); 
    const [totalPages, setTotalPages] = useState(1);    
    const [totalItems, setTotalItems] = useState(0);
    const [scrappedJobs, setScrappedJobs] = useState(jobPostings.map(() => false));

    const navigate = useNavigate();
    const location = useLocation();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // 쿼리 파라미터에서 페이지 번호 추출
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get('page')) || 1;  // 쿼리 파라미터가 없으면 1로 설정

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
        const fetchUserData = async () => {
            if (kakaoId) {
                try {
                    const response = await axios.post(`${BackendIP}/api/auth/info`, 
                        { kakaoId }, 
                        { withCredentials: true }
                    );
                    setUserData(response.data);
                } catch (err) {
                    alert("오류 발생: " + err.message);
                }
            }
        };

        fetchUserData();
    }, [kakaoId]);

    useEffect(() => {
        const fetchCustomData = async (page) => {
            if (kakaoId && userdata) {
                try {
                    const response = await axios.post(`${BackendIP}/api/Recruitment/Custom?page=${page}`, { 
                    //const response = await axios.post(`http://localhost:5000/api/Recruitment/Custom?page=${page}`, { 
                        jobs: userdata.position,
                        locations: userdata.location,
                        salary: userdata.salary[0]
                    });
                    const data = await response.data;
                    setJobPostings(data.jobPostings);
                    setTotalPages(data.totalPages);
                    setTotalItems(data.totalItems);
                } catch (err) {
                    alert("오류 발생: " + err.message);
                }
            }
        };

        fetchCustomData(currentPage);
    }, [kakaoId, currentPage, userdata]);


    // 해당 JobPosting의 스크랩 상태를 토글
    const handleScrapClick = (index) => {
        const updatedScraps = [...scrappedJobs];
        updatedScraps[index] = !updatedScraps[index]; // 해당 잡포스팅의 스크랩 상태 토글
        setScrappedJobs(updatedScraps);
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return ''; // timestamp가 없으면 빈 문자열 반환
        const date = new Date(timestamp * 1000); // timestamp는 초 단위이므로 1000을 곱해 밀리초로 변환
        return date.toLocaleDateString(); // YYYY-MM-DD 형식으로 변환
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
        <div className="Custom_container">
            <div className="Custom_box px-5 py-3">
                <div className="Custom_data">
                    <div className="data_name">
                        <strong>{userdata.nickname}</strong> 님의
                        <span> 맞춤 공고는</span>
                        <br/>총 <strong>{totalItems}</strong> 건입니다.
                    </div>
                    <div className="data_detail">
                        <div className="detail_position">
                            <span>직무:</span> {userdata.position && userdata.position.length > 0 ? userdata.position.join(', ') : '없음'}
                        </div>
                        <div className="detail_location">
                            <span>위치:</span> {userdata.location && userdata.location.length > 0 ? userdata.location.join(', ') : '없음'}
                        </div>
                        <div className="detail_salary">
                            <span>연봉:</span> {userdata.salary[0]} 만원 ~ {userdata.salary[1]} 만원
                        </div>
                    </div>
                </div>


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
                {jobPostings.length === 0 ? (
                    <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
                        일치하는 데이터가 없습니다.
                    </Typography>
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
                            <IconButton onClick={() => handleScrapClick(index)} color={scrappedJobs[index] ? "primary" : "default"}>
                            {scrappedJobs[index] ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            </IconButton>
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


            </div>
        </div>
    );
};

export default Body;
