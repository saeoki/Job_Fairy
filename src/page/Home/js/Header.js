import React from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import "../css/Header.css"

function Header(){
    return(
        <div className="row">
            <div className="col-12 header" style={{padding:0}}>
                <div className="left">
                    <Link to="/">
                        <img src="/logo/fairy.png" alt="Fairy" />                    
                    </Link>
                </div>
                {/* 가운데 열 */}
                <div className="center">
                    <Link to="/">
                        <img src="/logo/title.png" alt="title" />
                    </Link>
                </div>
                {/* 우측 열 */}
                <div className="right">
                    <div className="btn_box">
                        <Link to="/LoginPage">
                            <Button variant="link">로그인</Button>
                        </Link>
                        <Link to="/Register">
                            <Button variant="primary">회원가입</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header