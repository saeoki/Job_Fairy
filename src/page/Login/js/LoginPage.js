import React, { useState } from "react";
import Header from "../../Home/js/Header";

import Body from "./Body";

function LoginPage() {
    // 아이디와 비밀번호 상태 관리
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // 아이디 입력 시 상태 업데이트
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    // 비밀번호 입력 시 상태 업데이트
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <div>
            <Header />
            <Body />
        </div>
    );
}

export default LoginPage;
