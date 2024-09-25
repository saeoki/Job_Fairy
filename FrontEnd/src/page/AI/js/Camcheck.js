import React from "react";
import { Link } from "react-router-dom";

function Camcheck(){
    return(
        <div className="camcheck-box">
            <Link to="/CheckCamMic">
                <button type="button" className="btn btn-primary btn-sm" style={{width:"35%", height:"30%"}}>
                    마이크 및 CAM 점검
                </button>
            </Link>    
        </div>
    )


}

export default Camcheck;

