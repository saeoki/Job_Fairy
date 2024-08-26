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
                        <div className="recruitment__d-day">D-11</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <div className="recruitment__title">2024 기아 6월 경력 채용</div>
                        <div className="recruitment__company">기아(주)</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-12</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <div className="recruitment__title">우미 7월 경력사원 수시채용</div>
                        <div className="recruitment__company">우미건설(주)</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-13</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <div className="recruitment__title">2024년 신한DS 신입사원 모집</div>
                        <div className="recruitment__company">(주)신한디에스</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-5</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <div className="recruitment__title">KB캐피탈 각 부문 채용(계약직)</div>
                        <div className="recruitment__company">KB캐피탈(주)</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-13</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <div className="recruitment__title">(주)인트론바이오 전부문 신입/경력 채용</div>
                        <div className="recruitment__company">(주)인트론바이오테크놀로지</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-11</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <div className="recruitment__title">2024 기아 6월 경력 채용 품질 부문</div>
                        <div className="recruitment__company">기아(주)</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-11</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <div className="recruitment__title">2024 기아 6월 경력 채용 IT 부문</div>
                        <div className="recruitment__company">기아(주)</div>
                    </div>
                </div>
                <div className="recruitment__rectangle-block">
                    <div className="recruitment__rectangle" style={{ backgroundImage: `url(${imageURL})` }}>
                        <div className="recruitment__d-day">D-11</div>
                        <div className="recruitment__scrap-button">스크랩</div>
                    </div>
                    <div className="recruitment__info">
                        <div className="recruitment__title">2024년 (주)삼천리 초대졸 신입사원 공개채용</div>
                        <div className="recruitment__company">(주)삼천리</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

