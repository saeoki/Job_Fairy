import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import '../css/RecruitmentBody.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ScrapButton from '../../../components/ScrapButton';
import { jwtDecode } from 'jwt-decode';

const BackendIP = process.env.REACT_APP_EC2_IP;
const imageURL = "/assets/images/modern_office.webp";


export default function RecruitmentBody() {
    const navigate = useNavigate();

    const handleJobPostingClick = () => {
        navigate('/Recruitment/JobPostingList')
    };
    const handleCustomJobClick = () => {
        navigate('/Recruitment/CustomJobList')
    };
    const handleScrappedPostingClick = () => {
        navigate('/Recruitment/ScrappedPostingList')
    };
    const handleOpenRecruitmentClick = () => {
        navigate('/Recruitment/OpenRecruitment')
    };
    const handleDashBoardClick = () => {
        navigate('/Recruitment/DashBoard')
    };

    const [openRecruitments, setOpenRecruitments] = useState([]);
    const [kakaoId, setKakaoId] = useState("");

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

    useEffect(() => {
        const fetchLatestOpenRecruitments = async () => {
            try {
                const response = await axios.get(`${BackendIP}/api/Recruitment/latest`);
                // const response = await axios.get('http://localhost:5000/api/recruitment/latest');
                setOpenRecruitments(response.data.openRecruitments);
            } catch (error) {
                console.error("Fail to fetch latest Open Recruitment: ", error);
            }
        };
        fetchLatestOpenRecruitments();
    }, []);

    const calculateDday = (expirationTimestamp) => {
        const expirationDate = new Date(expirationTimestamp * 1000);
        const now = new Date();
        const diff = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));
        return diff > 0 ? `D-${diff}` : '마감';
    };

    return (
    <div className="recruitment">
        <div className="recruitment__block_section">
            <div className="recruitment__block" onClick={handleJobPostingClick}>
                <img className="recruitment__image" src="/assets/images/Image.png" alt=""/>
                <span className="recruitment__subheading">채용공고 찾기</span>
            </div>
            <div className="recruitment__block" onClick={handleDashBoardClick}>
                <img className="recruitment__vector" src="/assets/vectors/Vector11_x2.svg" alt="dashboard vector" />
                <span className="recruitment__subheading">채용 대시보드</span>
            </div>
            <div className="recruitment__block" onClick={handleCustomJobClick}>
                <img className="recruitment__vector" src="/assets/vectors/Vector_x2.svg" alt="thumb up vector" />
                <span className="recruitment__subheading">맞춤 공고</span>
            </div>
            <div className="recruitment__block" onClick={handleScrappedPostingClick}>
                <img className="recruitment__vector" src="/assets/vectors/Vector10_x2.svg" alt="bookmarks vector" />
                <span className="recruitment__subheading">스크랩한 공고</span>
            </div>
        </div>

        <div className='carousel_section mb-5'>
            <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="/assets/images/main_carousel.png" className="d-block w-100" alt="..."/>
                        <div className="carousel-caption d-none d-md-block">
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="/assets/images/dashboard_carousel.png" className="d-block w-100" alt="..."/>
                        <div className="carousel-caption d-none d-md-block">
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="/assets/images/custom_carousel.png" className="d-block w-100" alt="..."/>
                        <div className="carousel-caption d-none d-md-block">
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>

        <div className="recruitment__rectangle_section">
            <h2 className="recruitment__heading1"># 최근 공채</h2>
            <div className="recruitment__moreheader" onClick={handleOpenRecruitmentClick}>전체보기</div>
            <div className="recruitment__rectangle_items">
                {openRecruitments.map((job, index) => (
                    <div key={index} className="recruitment__rectangle-block">
                        <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                            <div className="recruitment__d-day">{calculateDday(job.expiration_timestamp)}</div>
                            <div className="recruitment__scrap-button">
                                <ScrapButton kakaoId={kakaoId} jobId={job.id} jobPosting={job} />
                            </div>
                        </div>
                        <div className="recruitment__info">
                            <a href={job.url || "#"} className="recruitment__title" target="_blank" rel="noopener noreferrer">
                                {job.position?.title || "제목 없음"}
                            </a>
                            <a href={job.company?.detail?.href || "#"} className="recruitment__company" target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                {job.company?.detail?.name || "회사 이름 없음"}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
}

