
import React, { useState } from "react";

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import "../css/Body.css"
import StartInterview from "./Startinterview";
import Camcheck from "./Camcheck";

function Body() {
    const [isPersonalityInterviewChecked, setIsPersonalityInterviewChecked] = useState(false);
    const [isTechnicalInterviewChecked, setIsTechnicalInterviewChecked] = useState(false);
    const [isRecordingChecked, setIsRecordingChecked] = useState(false);
    const [selectedJob, setSelectedJob] = useState(""); // 직무 선택 상태 추가

    const handlePersonalityInterviewChange = (event) => {
        setIsPersonalityInterviewChecked(event.target.checked);
    };

    const handleTechnicalInterviewChange = (event) => {
        setIsTechnicalInterviewChecked(event.target.checked);
    };

    const handleRecordingChange = (event) => {
        setIsRecordingChecked(event.target.checked);
    };

    const handleJobChange = (event) => {
        setSelectedJob(event.target.value); // 직무 선택 값 업데이트
    };

    return (
        <div className="Ai_container mx-5 my-3 py-2">
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

                    {/* 기술 면접 선택 시 직무 선택 콤보박스 표시 */}
                    {isTechnicalInterviewChecked && (
                        <div>
                            <h5>직무를 선택하세요</h5>
                            <Select
                                value={selectedJob}
                                onChange={handleJobChange}
                                displayEmpty
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>직무 선택</em>
                                </MenuItem>
                                <MenuItem value="frontend">프론트엔드</MenuItem>
                                <MenuItem value="backend">백엔드</MenuItem>
                                <MenuItem value="ai">풀스택</MenuItem>
                                <MenuItem value="network">데브옵스</MenuItem>
                                <MenuItem value="firmware">데이터 엔지니어</MenuItem>
                                <MenuItem value="firmware">데이터 사이언티스트</MenuItem>
                                <MenuItem value="firmware">AI 엔지니어</MenuItem>
                                <MenuItem value="firmware">모바일 앱</MenuItem>
                                <MenuItem value="firmware">시스템 엔지니어</MenuItem>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="interview-type-box">
                    <span> <h5>해당 면접에 대하여<br /> 녹화를 하시겠습니까?</h5> </span>
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
                    selectedJob={selectedJob}  // 선택한 직무 값 전달
                />
            </div>
        </div>
    );
}

export default Body;
