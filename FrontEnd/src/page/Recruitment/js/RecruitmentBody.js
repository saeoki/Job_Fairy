import React from 'react';
import { useNavigate } from 'react-router-dom'
import '../css/RecruitmentBody.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const imageURL = "/assets/images/modern_office.webp";


export default function RecruitmentBody() {
    const navigate = useNavigate();

    const handleJobPostingClick = () => {
        navigate('/Recruitment/JobPostingList')
    };

    return (
    <div className="recruitment">
        <div className="recruitment__block_section">
            <div className="recruitment__block" onClick={handleJobPostingClick}>
                <img className="recruitment__image" style={{ backgroundImage: 'url("/assets/images/Image2.png")' }} alt=""/>
                <span className="recruitment__subheading">채용공고 찾기</span>
            </div>
            <div className="recruitment__block">
                <img className="recruitment__vector" src="/assets/vectors/Vector11_x2.svg" alt="dashboard vector" />
                <span className="recruitment__subheading">채용 대시보드</span>
            </div>
            <div className="recruitment__block">
                <img className="recruitment__vector" src="/assets/vectors/Vector_x2.svg" alt="thumb up vector" />
                <span className="recruitment__subheading">맞춤 공고</span>
            </div>
            <div className="recruitment__block">
                <img className="recruitment__vector" src="/assets/vectors/Vector10_x2.svg" alt="bookmarks vector" />
                <span className="recruitment__subheading">스크랩한 공고</span>
            </div>
        </div>


        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="/assets/images/slider_image1.png" className="d-block w-100" alt="..."/>
                    <div className="carousel-caption d-none d-md-block">
                        <h5>First slide label</h5>
                        <p>Some representative placeholder content for the first slide.</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="https://via.placeholder.com/800x400" className="d-block w-100" alt="..."/>
                    <div className="carousel-caption d-none d-md-block">
                        <h5>Second slide label</h5>
                        <p>Some representative placeholder content for the second slide.</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="https://via.placeholder.com/800x400" className="d-block w-100" alt="..."/>
                    <div className="carousel-caption d-none d-md-block">
                        <h5>Third slide label</h5>
                        <p>Some representative placeholder content for the third slide.</p>
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

        <br></br>
        <br></br>
        

        <div className="recruitment__rectangle_section">
            <h2 className="recruitment__heading1"># 최근 공채</h2>
            <div className="recruitment__moreheader">전체보기</div>
            <div className="recruitment__rectangle_items">

                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-24</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <a href="http://www.saramin.co.kr/zf_user/company-info/view?csn=1178121700&utm_source=job-search-api&utm_medium=api&utm_campaign=saramin-job-search-api" className="recruitment__title">
                            (주)한국프라켐 서천 물류창고(서천, 군산, 전주 등) 직원 모집
                        </a>

                        <div className="recruitment__company">(주)한국프라켐</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-34</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <a href="http://www.saramin.co.kr/zf_user/company-info/view?csn=6218300678&utm_source=job-search-api&utm_medium=api&utm_campaign=saramin-job-search-api" className="recruitment__title">
                            [반도체특성화대학사업단] 사업단 행정직원 공개 채용 공고
                        </a>

                        <div className="recruitment__company">부산대학교</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-15</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <a href="http://www.saramin.co.kr/zf_user/company-info/view?csn=1048639742&utm_source=job-search-api&utm_medium=api&utm_campaign=saramin-job-search-api">
                            [NH] NH농협은행 인사부 일반계약직 채용
                        </a>

                        <div className="recruitment__company">NH농협은행(주)</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-30</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <a href="http://www.saramin.co.kr/zf_user/company-info/view?csn=1048651732&utm_source=job-search-api&utm_medium=api&utm_campaign=saramin-job-search-api" className="recruitment__title">
                            부문별 경력사원 채용
                        </a>

                        <div className="recruitment__company">삼성웰스토리(주)</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-26</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <a href="http://www.saramin.co.kr/zf_user/company-info/view?csn=1388300313&utm_source=job-search-api&utm_medium=api&utm_campaign=saramin-job-search-api" className="recruitment__title">
                            미술정책연구과 기간제근로자(학예원) 채용 공고
                        </a>

                        <div className="recruitment__company">국립현대미술관</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-24</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <a href="http://www.saramin.co.kr/zf_user/company-info/view?csn=1178121700&utm_source=job-search-api&utm_medium=api&utm_campaign=saramin-job-search-api" className="recruitment__title">
                            올림픽파크텔 기물관리 채용공고
                        </a>

                        <div className="recruitment__company">한국체육산업개발(주)</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-24</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <a href="http://www.saramin.co.kr/zf_user/company-info/view?csn=1018300422&utm_source=job-search-api&utm_medium=api&utm_campaign=saramin-job-search-api" className="recruitment__title">
                        2024년도 하반기 공무직 등 근로자 채용 계획 공고
                        </a>

                        <div className="recruitment__company">국립기상과학원</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-24</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <a href="http://www.saramin.co.kr/zf_user/company-info/view?csn=1178121700&utm_source=job-search-api&utm_medium=api&utm_campaign=saramin-job-search-api" className="recruitment__title">
                            (주)한국프라켐 서천 물류창고(서천, 군산, 전주 등) 직원 모집
                        </a>

                        <div className="recruitment__company">(주)한국프라켐</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    );
}

