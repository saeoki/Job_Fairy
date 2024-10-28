import React, { useEffect } from "react";
import Header from "../../Home/js/Header";
import Body from "./Body";
import Footer from "../../Home/js/Footer";
import { LoginErrorToast } from "../../../components/ToastMessage"; // 로그인 에러 토스트 메시지

function AIinterview() {
  
    const token = localStorage.getItem('token'); // 토큰 확인

    if (!token) {
      LoginErrorToast(); // 로그인 에러 메시지 출력
    }

  return (
    <div>
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

export default AIinterview;
