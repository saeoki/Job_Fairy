import React, { useState } from 'react';

import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const StartIntroduction = ({infoList, isInput ,setIsInput }) => {

  const [open, setOpen] = useState(false);

  const handleStartButtonClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsInput(false)
  };

  const handleConfirm = () => {
    setOpen(false);
    setIsInput(true)
  };

  return (
    <div className="startintroduction-button-container">
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          className='startintroduction-button'
          startIcon={<CreateIcon />}
          onClick={handleStartButtonClick}
        >
          자기소개서 작성 시작
        </Button>
      </Stack>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>입력한 프롬프트를 확인해주세요.</DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
            <div>
              <h2>선호 직무</h2>
              <p>
                {Object.values(infoList.jobList).map((job, index) => (
                  <li key={index}>{job}</li>
                ))}
              </p>

              <h2>키워드</h2>
              <p>
                {Object.values(infoList.keywordList).map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </p>

              <h2>추가 내용</h2>
              <p>{infoList.addContent}</p>
            </div>
            자기소개서 작성을 시작하시겠습니까?
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }} >
          <Button onClick={handleConfirm} autoFocus>네</Button>
          <Button onClick={handleClose}>아니요</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default StartIntroduction;
