
// import React from "react";
// import { Link } from "react-router-dom";
// import Button from '@mui/material/Button'; // Material UI의 Button 컴포넌트 사용

// function Camcheck() {
//     return (
//         <div className="camcheck-box">
//             <Link to="/CheckCamMic">
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     size="large"
//                     style={{
//                         width: "60%",
//                         padding: "10px",
//                         fontSize: "16px",
//                         fontWeight: "bold",
//                         boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // 그림자 추가
//                         transition: "0.3s", // 애니메이션 추가
//                     }}
//                     onMouseOver={(e) => e.target.style.boxShadow = "0px 6px 14px rgba(0, 0, 0, 0.2)"} // 마우스 오버 시 효과
//                     onMouseOut={(e) => e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)"}  // 마우스 아웃 시 원상복구
//                 >
//                     마이크 및 CAM 점검
//                 </Button>
//             </Link>
//         </div>
//     );
// }

// export default Camcheck;
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
