import React, { useState } from "react";

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
            <h1>LoginPage</h1>
            {/* 아이디 입력란 */}
            <label>
                ID:
                <input type="text" value={username} onChange={handleUsernameChange} />
            </label>

            {/* 비밀번호 입력란 */}
            <label>
                Password:
                <input type="password" value={password} onChange={handlePasswordChange} />
            </label>

            {/* 로그인 버튼 */}
            <button>Login</button>
        </div>
    );
}

export default LoginPage;
