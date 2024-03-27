// import React from "react";
// import { Link } from "react-router-dom";

// function Camcheck(){
//     return(
//         <div className="camcheck-box">
//             <Link to="/CheckCamMic">
//                 <button type="button" className="btn btn-primary btn-sm" style={{width:"50%", height:"30%"}}>
//                     마이크 및 CAM 점검
//                 </button>
//             </Link>    
//         </div>
//     )


// }

// export default Camcheck;

import React from "react";
import axios from "axios";

function Camcheck() {
    const handleButtonClick = () => {
        axios.get("http://localhost:5000/check_camera_microphone")
            .then(response => {
                console.log(response.data.result);
                // 여기서 서버로부터 받은 응답을 처리하세요.
            })
            .catch(error => {
                console.error("Error occurred:", error);
            });
    };

    return (
        <div className="camcheck-box">
            <button type="button" className="btn btn-primary btn-xs" style={{ width: "50%" }} onClick={handleButtonClick}>
                마이크 및 CAM 점검
            </button>
        </div>
    );
}

export default Camcheck;
