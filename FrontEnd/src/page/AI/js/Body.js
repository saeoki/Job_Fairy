import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import "../css/Body.css"
import StartInterview from "./Startinterview";
import Camcheck from "./Camcheck";


function Body(){
    const [isPersonalityInterviewChecked, setIsPersonalityInterviewChecked] = useState(false);
    const [isTechnicalInterviewChecked, setIsTechnicalInterviewChecked] = useState(false);
    const [isRecordingChecked, setIsRecordingChecked] = useState(false);

    const handlePersonalityInterviewChange = (event) => {
        setIsPersonalityInterviewChecked(event.target.checked);
    };

    const handleTechnicalInterviewChange = (event) => {
        setIsTechnicalInterviewChecked(event.target.checked);
    };

    const handleRecordingChange = (event) => {
        setIsRecordingChecked(event.target.checked);
    };

    return(
        <div className="body">
            <div id="AIinterviewbox">
                <div className="interview-type-box">
                    <span> <h5>면접 종류를 선택하세요</h5></span>
                    <FormControlLabel  
                        control={<Checkbox checked={isPersonalityInterviewChecked} onChange={handlePersonalityInterviewChange} />} 
                        label="인적성 면접" 
                        labelPlacement="start"
                    />
                    <FormControlLabel  
                        control={<Checkbox checked={isTechnicalInterviewChecked} onChange={handleTechnicalInterviewChange} />} 
                        label="기술 면접"
                        labelPlacement="start" 
                    />
                </div>

                <div className="interview-type-box">
                    <span> <h5>해당 면접에 대하여<br/> 녹화를 하시겠습니까?</h5> </span>
                    <FormControlLabel  
                        control={<Checkbox checked={isRecordingChecked} onChange={handleRecordingChange} />} 
                        label=" 녹화 여부" 
                        labelPlacement="start"
                    />
                </div>

                <Camcheck />

                <StartInterview 
                    isPersonalityInterviewChecked={isPersonalityInterviewChecked}
                    isTechnicalInterviewChecked={isTechnicalInterviewChecked}
                    isRecordingChecked={isRecordingChecked}
                />

            </div>

        </div>
    )
}

export default Body;
