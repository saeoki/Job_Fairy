import '../css/Body.css';

const imageURL = "/assets/images/modern_office.webp";


export default function Body() {
  return (
    <div className="recruitment">
      <div className="recruitment__block_section">
        <div className="recruitment__block">
          <img className="recruitment__image" style={{ backgroundImage: 'url("/assets/images/Image2.png")' }} alt=""/>
          <span className="recruitment__subheading">채용공고</span>
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

      <br></br>
      <br></br>

      <div className="recruitment__grand_banner_wrap"></div>
        <h2 className="recruitment__heading1"># 최근 공채</h2>
        <div className="recruitment__moreheader">전체보기</div>
        <div className="recruitment__rectangle_section">
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
  );
}

