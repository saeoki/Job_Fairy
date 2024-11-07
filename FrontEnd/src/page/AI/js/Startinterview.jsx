import React, { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from "react-router-dom";
import "../css/ButtonStyles.css"; // 공통 버튼 스타일 적용

function StartInterview({ isPersonalityInterviewChecked, isTechnicalInterviewChecked, isRecordingChecked, selectedJob }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleStartInterview = () => {
        navigate('/AI_interview_start', {
            state: {
                isPersonalityInterviewChecked,
                isTechnicalInterviewChecked,
                isRecordingChecked,
                selectedJob,
            }
        });
    };

    // 기술 면접이 선택되면 직무도 선택되어야 "예" 버튼을 누를 수 있음
    const isStartButtonDisabled = (!isPersonalityInterviewChecked && !isTechnicalInterviewChecked) || 
                                  (isTechnicalInterviewChecked && selectedJob === "");

    return (
        <div className="interview-start-box">
            <Button
                className="custom-button"
                onClick={handleOpen}
                variant="contained"
                color="primary"
            >
                면접 시작
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>면접 시작</DialogTitle>
                <DialogContent>
                    {/* 아무 면접 유형도 선택되지 않은 경우 경고 메시지 표시 */}

                    {isTechnicalInterviewChecked && selectedJob === "" ? (
                        <p className="warning-text" style={{ color: 'red' }}>직무를 선택하세요!</p>  
                    ) : (
                        <p className="selected-job-text">해당 면접 정보로 면접을 시작하겠습니까?</p>  
                    )}
                        {!isPersonalityInterviewChecked && !isTechnicalInterviewChecked && (
                        <p className="warning-text" style={{ color: 'red' }}>질문을 선택해주세요!</p>
                    )}
                    <div>
                        <FormControlLabel
                            control={<Checkbox checked={isPersonalityInterviewChecked} />}
                            label="인적성 면접"
                            labelPlacement="start"
                            disabled
                        />
                        <FormControlLabel
                            control={<Checkbox checked={isTechnicalInterviewChecked} />}
                            label="기술 면접"
                            labelPlacement="start"
                            disabled
                        />
                        {isTechnicalInterviewChecked && selectedJob && (
                            <p className="selected-job-text">선택한 직무: {selectedJob}</p>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleStartInterview} 
                        className="custom-button" 
                        color="primary" 
                        variant="contained" 
                        disabled={isStartButtonDisabled} // 버튼 활성화 조건 적용
                    >
                        예
                    </Button>
                    <Button onClick={handleClose} color="primary" variant="outlined">
                        아니오
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default StartInterview;
