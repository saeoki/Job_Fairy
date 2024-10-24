import React from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button'; // Material UI의 Button 컴포넌트 사용
import '../css/ButtonStyles.css'; // 공통 버튼 스타일 적용

function Camcheck() {
    return (
        <div className="camcheck-box">
            <Link to="/CheckCamMic">
                <Button
                    className="custom-button" // 공통된 클래스 사용
                    variant="contained"
                    color="primary"
                >
                    마이크 및 CAM 점검
                </Button>
            </Link>
        </div>
    );
}

export default Camcheck;
