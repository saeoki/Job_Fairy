import React from "react";
import { Link } from "react-router-dom";

import "../css/Body.css"

function Body(){
    return(
        <div className="body">
            <div id="loginBox">
                {/* 아이디, 비번, 버튼 박스 */}
                <div id="inputBox">
                    <div className="input-form-box">
                        <span>아이디 </span>
                        <input type="text" name="uid" className="form-control" />
                    </div>
                    <div className="input-form-box">
                        <span>비밀번호 </span>
                        <input type="password" name="upw" className="form-control" />
                    </div>
                    <div className="button-login-box" >
                        <button type="button" className="btn btn-primary btn-xs" style={{width:"100%"}}>
                            로그인
                        </button>
                    </div>
                    <div className="button-register-box" >
                        <Link to="/Register">
                            <button type="button" className="btn btn-secondary btn-xs" style={{width:"100%"}}>
                                회원가입
                            </button>
                        </Link>
                    </div>
                    {/* 구글 로그인 */}
                    {/* <div id="g_id_onload" data-client_id="YOUR_GOOGLE_CLIENT_ID"
                        data-login_uri="https://your.domain/your_login_endpoint" data-auto_prompt="false">
                    </div>
                    <div class="g_id_signin" data-type="standard" data size="large"
                        data-theme="outline" data-text="sign_in_with" data-shape="rectangular" data-logo_alignment="left">
                    </div> */}
                </div>
            </div>
        </div>
        
    )
}

export default Body