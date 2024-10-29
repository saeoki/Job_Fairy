import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Box } from '@mui/material';

import "../css/inputForm.css"

const positions = [
  '프론트엔드', '백엔드', '풀스택',
  '데브옵스', '데이터 엔지니어', '데이터 분석가', '데이터 사이언티스트',
  '모바일 앱', '게임개발', '시스템 엔지니어', '개발PM'
];

const PositionSelector = ({registerList, setRegisterList}) => {
  const [open, setOpen] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState(registerList.position);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleButtonClick = (position) => () => {
    const currentIndex = selectedPositions.indexOf(position);
    const newSelected = [...selectedPositions];

    if (currentIndex === -1) {
      newSelected.push(position);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedPositions(newSelected);
    setRegisterList(prevState => ({
      ...prevState,
      position : newSelected
    }))
  };

  const handleDelete = (positionToDelete) => () => {
    setSelectedPositions((positions) => {
      const updatedPositions = positions.filter((position) => position !== positionToDelete);

      // registerList 업데이트
      setRegisterList((prevState) => ({
          ...prevState,
          position: updatedPositions
      }));
      return updatedPositions; // updatedPositions 반환
    }) 
  };

  return (
    <div >
      <Button className='position_btn' variant="outlined" onClick={handleClickOpen}>
        희망 직무 선택
      </Button>
      <div>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2, }}>
        {selectedPositions.map((position) => (
          <Chip
            key={position}
            label={position}
            onDelete={handleDelete(position)}
          />
        ))}
      </Box>
      </ div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>희망 직무 선택</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {positions.map((position) => (
              <Button
                key={position}
                variant={selectedPositions.indexOf(position) !== -1 ? 'contained' : 'outlined'}
                onClick={handleButtonClick(position)}
                sx={{
                  borderRadius: 2,
                  margin: '5px',
                  minWidth: '120px',
                  backgroundColor: selectedPositions.indexOf(position) !== -1 ? '#3493d7' : 'transparent',
                  color: selectedPositions.indexOf(position) !== -1 ? '#fff' : '#3493d7',
                  '&:hover': {
                    backgroundColor: selectedPositions.indexOf(position) !== -1 ? '#297bb0' : '#e3f2fd',
                    color: selectedPositions.indexOf(position) !== -1 ? '#fff' : '#3493d7',
                  },
                }}
              >
                {position}
              </Button>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PositionSelector;
