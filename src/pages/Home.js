// Home.js

import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // 스타일 파일 import

function Home() {
  return (
    <div className="container">
      {/* 좌측 열 */}
      <div className="left-column">
        <img src="/fairy.png" alt="Fairy" />
      </div>

      {/* 가운데 열 */}
      <div className="center-column">
        <h1>취업의 요정</h1>
        <p>AI 면접 마스터</p>
      </div>

      {/* 우측 열 */}
      <div className="right-column">
        <Link to="/LoginPage">
          <button>Login</button>
        </Link>

        <Link to="/Mypage">
          <button>Mypage</button>
        </Link>
      </div>

      {/* 나머지 버튼들 */}
      <div>
        <Link to="/AIinterview">
          <button>AI 면접</button>
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
      </div>
    </div>
  );
}

export default Home;
