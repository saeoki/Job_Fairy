import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from 'jwt-decode';
/*
    Context 기능 설명
    Context 를 통해 전역으로 상태변수를 할당할 수 있다.
    모든 파일 및 코드에서 로그인에 대한 정보는 필수적이기에 전역으로 관리한다.

    주의점
    너무 많은 상태변수를 전역으로 설정하면 렌더링 수가 늘어나 성능(속도 등) 저하가 일어날 수 있다.
*/

// Context 생성
export const AuthContext = createContext();

// Provider 컴포넌트 생성
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // 현재 시간 (초 단위)
        
            if (decodedToken.exp < currentTime) {
              // 토큰이 만료됨
              alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
              localStorage.removeItem('token'); // 토큰 삭제
              setIsLoggedIn(false)
              window.location.href = '/';  // 로그인 페이지로 리다이렉트
            } else{
                setIsLoggedIn(!!token); // true/false로 변환
            }
          }

        
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token); // 로컬 스토리지에 토큰 저장
        setIsLoggedIn(true); // 로그인 상태 업데이트
    };

    const logout = () => {
        localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
        setIsLoggedIn(false); // 로그인 상태 업데이트
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};