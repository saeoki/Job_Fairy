import React from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import "../css/Header.css"

function Header(){
    return(
        <div className="row">
            <div className="col-12 header">
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
        </div>
    )
}

export default Header