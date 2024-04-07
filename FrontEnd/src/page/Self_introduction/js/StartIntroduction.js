import React, { useState } from 'react';
import { Link } from "react-router-dom";

import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

function StartIntroduction() {
  const [open, setOpen] = useState(false);

  const handleStartButtonClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
  };

  return (
    <div className="startintroduction-button-container">
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          className='startintroduction-button'
          startIcon={<SendIcon />}
          onClick={handleStartButtonClick}
        >
          자기소개서 작성 시작
        </Button>
      </Stack>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>자기소개서 작성을 시작하시겠습니까?</DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          "네"를 선택하면 몇 초 후에 자동으로 결과 페이지로 이동합니다.
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }} >
          <Link to ="/Output_Self_introduction">
            <Button onClick={handleConfirm} autoFocus>네</Button>
          </Link>
          <Button onClick={handleClose}>아니요</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default StartIntroduction;
