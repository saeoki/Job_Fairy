import React from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import "../css/Home2.css"; // 스타일 파일 import

function Home() {
  return (
    <div className="container_box">
      <div className="header">
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
      <div className="body">
        <div className="btn_interview">
          <Link to="/AIinterview">
            <Button variant="primary" 
              style={{width:"30vw", height:"17vh", fontSize:"1.7rem", float:"right", marginTop:"10vh", marginRight:"5vw"}}>
                AI 면접
              </Button>
          </Link>
        </div>
        <div className="btn_report">
          <Link to="/CVletter">
            <Button variant="primary" 
              style={{width:"30vw", height:"17vh", fontSize:"1.7rem", float:"left", marginTop:"10vh", marginLeft:"5vw"}}>
              리포트
            </Button>
          </Link>
        </div>
        <div className="btn_resume">
          <Link to="/Epinformation">
            <Button variant="primary" 
              style={{width:"30vw", height:"17vh", fontSize:"1.7rem", float:"right", marginRight:"5vw"}}>
              자기소개서 작성
            </Button>
          </Link>
        </div>
        <div className="btn_recruitment">
          <Link to="/Report">
            <Button variant="primary"
              style={{width:"30vw", height:"17vh", fontSize:"1.7rem", float:"left", marginLeft:"5vw"}}>
              채용 정보
            </Button>
          </Link>
        </div>
      </div>
      <div className="footer">

      </div>
    </div>
  );
}

export default Home;
