import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import "../css/Header.css"

import { AuthContext } from "../../../context/AuthContext"
import { LogoutToast, ErrorToast } from "../../../components/ToastMessage";
import KakaoLogin from "../../Login/js/Kakao_login";

function Header(){

    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    // 카카오 로그아웃 기능
    const handleKakaoLogout = () => {
        if (!window.Kakao.Auth.getAccessToken()) {
            ErrorToast(1)
            return;
        }
        window.Kakao.Auth.logout(function() {
            LogoutToast()
            setIsLoggedIn(false)
        });
    }

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
                {/* 로그인 여부에 따라 변동적 헤더 */}    
                {isLoggedIn ? 
                    <div className="btn_box">
                        <Link to="/Mypage">
                            <Button className="btn btn-xs">마이페이지</Button>
                        </Link>
                        <Button className="btn btn-xs" onClick={handleKakaoLogout}>로그아웃</Button>
                    </div>
                    :
                    <div className="login_box">
                        <KakaoLogin />
                        {/* 240717 기존 회원가입 버전 삭제 */}
                        {/* <Link to="/Login">
                            <Button variant="link">로그인</Button>
                        </Link>
                        <Link to="/Register">
                            <Button variant="primary">회원가입</Button>
                        </Link> */}
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header