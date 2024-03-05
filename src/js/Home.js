import React from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import "../css/Home.css"; // 스타일 파일 import

function Home() {
  return (
    <div className="container-box">
      <div className="Header">
        {/* 좌측 열 */}
        <div className="left">
          <img src="/logo/fairy.png" alt="Fairy" />
        </div>
        {/* 가운데 열 */}
        <div className="center">
          <div className="text">
            <h1>취업의 요정</h1>
            <p>AI 면접 마스터</p>
          </div>
        </div>
        {/* 우측 열 */}
        <div className="right">
          <div className="btn_box">
            <Link to="/LoginPage">
              <Button variant="link">Login</Button>
            </Link>
            <Link to="/Mypage">
              <Button variant="primary">Mypage</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 나머지 버튼들
      <div>
        <Link to="/AIinterview">
          <button type="button">AI 면접</button>
        </Link>
      </div>
      <div>
        <Link to="/CVletter">
          <button>자기소개서 작성</button>
        </Link>
      </div>
      <div>
        <Link to="/Epinformation">
          <button>채용 정보</button>
        </Link>
      </div>
      <div>
        <Link to="/Report">
          <button>리포트</button>
        </Link>
      </div> */}
    </div>
  );
}

export default Home;
