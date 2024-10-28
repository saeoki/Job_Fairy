

import React from 'react';
import CameraMicAccess from './CameraMicAccess';
import "../css/Body.css"

function Body(){
    return(
        <div className="body">
            <div id = "checkcammic-box">
                <CameraMicAccess /> 
            </div>
        </div>
    )
}

export default Body;
