// src/KakaoLogin.js
import React, { useEffect, useContext } from 'react';

import { AuthContext } from "../../../context/AuthContext"
import { LoginToast, ErrorToast } from '../../../components/ToastMessage';

import "../css/Body.css"


// 엑세스 토큰을 발급받고, 아래 함수를 호출시켜서 사용자 정보를 받아옴.
function getInfo(login) {

    window.Kakao.API.request({
        url: '/v2/user/me',
        success: function (res) {
            // console.log(res);

            fetch('http://localhost:5000/api/auth/kakao', {
                method: 'POST',
                credentials: 'include', // 필요 시 추가
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    kakaoId: res.id,
                    nickname: res.properties.nickname,
                }),
                
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);

                if (data.token) {
                    LoginToast();
                    setTimeout(() => {
                        login(data.token); // 로그인 상태 업데이트
                        window.location.reload(); // 페이지 리로드 (로그인 상태 반영)
                      }, 1200); 
                    
                }

                // 서버에서 redirectUrl을 받아서 리다이렉션 처리
                if (data.redirectUrl) {
                    // 해당 URL로 리다이렉션
                    window.location.href = data.redirectUrl; 
                } else{
                    
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        },
        fail: function (error) {
            ErrorToast(3);
        }
    });
}


const KakaoLogin = () => {

    const { login } = useContext(AuthContext);

    useEffect(() => {
        // 카카오 SDK 로드
        const script = document.createElement('script');
        script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
        script.async = true;
        script.onload = () => {
            window.Kakao.init(process.env.REACT_APP_KAKAO_JS_API_KEY);
        };
        document.body.appendChild(script);

        // 클린업 함수
        return () => {
            document.body.removeChild(script);
        };
    }, []);


    // 로그인 기능
    const handleKakaoLogin = () => {
        window.Kakao.Auth.login({
            success: function (authObj) {
                // console.log(authObj);
                window.Kakao.Auth.setAccessToken(authObj.access_token); // access토큰값 저장
                
                // 정보 가져오기
                getInfo(login); 
            },
            fail: function (err) {
                ErrorToast(2)
            },
        });
        }
    // })};

    return (
        <div>
            <button className="kakao-btn btn-xs" onClick={handleKakaoLogin}>
                <img src="./images/kakao_login.png" className="kakao-icon" alt="Kakao icon"/>
            </button>
        </div>
    );
};

export default KakaoLogin;
