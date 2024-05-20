import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel, Chip, Box } from '@mui/material';

const locations = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

function LocationSelector() {
  const [open, setOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = (location) => () => {
    const currentIndex = selectedLocations.indexOf(location);
    const newChecked = [...selectedLocations];

    if (currentIndex === -1) {
      newChecked.push(location);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedLocations(newChecked);
  };

  const handleDelete = (locationToDelete) => () => {
    setSelectedLocations((locations) => locations.filter((location) => location !== locationToDelete));
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} sx={{width:"300px"}}>
        지역 선택
      </Button>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}>
        {selectedLocations.map((location) => (
          <Chip
            key={location}
            label={location}
            onDelete={handleDelete(location)}
          />
        ))}
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>지역 선택</DialogTitle>
        <DialogContent>
          {locations.map((location) => (
            <FormControlLabel
              key={location}
              control={
                <Checkbox
                  checked={selectedLocations.indexOf(location) !== -1}
                  onChange={handleToggle(location)}
                  name={location}
                />
              }
              label={location}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default LocationSelector;
