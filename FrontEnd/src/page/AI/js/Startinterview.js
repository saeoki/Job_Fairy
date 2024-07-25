import React, { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";

function StartInterview({ isPersonalityInterviewChecked, isTechnicalInterviewChecked, isRecordingChecked }) {
    const [open, setOpen] = useState(false); // 다이얼로그 열고 닫는 상태 관리

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div className="interview-start-box">
            <Button className="btn btn-primary btn-xs" onClick={handleOpen} variant="contained" color="primary" style={{width:"50%"}}> 
                면접 시작
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>면접 시작</DialogTitle>
                <DialogContent>
                    <p>해당 면접 정보로 면접을 시작하겠습니까?</p>
                    <div>
                        <div>
                            <FormControlLabel
                                control={<Checkbox checked={isPersonalityInterviewChecked} />}
                                label="인적성 면접"
                                labelPlacement="start"
                                disabled={!isPersonalityInterviewChecked}
                            />
                        </div>
                        <div>
                            <FormControlLabel
                                control={<Checkbox checked={isTechnicalInterviewChecked} />}
                                label="기술 면접"
                                labelPlacement="start"
                                disabled={!isTechnicalInterviewChecked}
                            />
                        </div>
                        <div>
                            <FormControlLabel
                                control={<Checkbox checked={isRecordingChecked} />}
                                label="녹화 여부"
                                labelPlacement="start"
                                disabled={!isRecordingChecked}
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Link to="/AI_interview_start">          
                        <Button color="primary">
                            예
                        </Button>
                    </Link>
                    <Button onClick={handleClose} color="primary">
                        아니오
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default StartInterview;
