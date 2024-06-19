import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';

const MilitaryStatus = ({setRegisterList}) => {
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleButtonClick = (status) => () => {
    setSelectedStatus(status);
    setRegisterList(prevState=> ({
      ...prevState,
      military : status
  }))
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant={selectedStatus === '군필' ? 'contained' : 'outlined'}
          onClick={handleButtonClick('군필')}
          sx={{
            color: selectedStatus === '군필' ? '#fff' : '#3493d7',
            backgroundColor: selectedStatus === '군필' ? '#3493d7' : '#fff',
            borderColor: '#3493d7',
            '&:hover': {
              backgroundColor: selectedStatus === '군필' ? '#297bb0' : '#e3f2fd',
              borderColor: '#297bb0',
            }
          }}
        >
          군필
        </Button>
        <Button
          variant={selectedStatus === '미필' ? 'contained' : 'outlined'}
          onClick={handleButtonClick('미필')}
          sx={{
            color: selectedStatus === '미필' ? '#fff' : '#3493d7',
            backgroundColor: selectedStatus === '미필' ? '#3493d7' : '#fff',
            borderColor: '#3493d7',
            '&:hover': {
              backgroundColor: selectedStatus === '미필' ? '#297bb0' : '#e3f2fd',
              borderColor: '#297bb0',
            }
          }}
        >
          미필
        </Button>
        <Button
          variant={selectedStatus === '면제/해당없음' ? 'contained' : 'outlined'}
          onClick={handleButtonClick('면제/해당없음')}
          sx={{
            color: selectedStatus === '면제/해당없음' ? '#fff' : '#3493d7',
            backgroundColor: selectedStatus === '면제/해당없음' ? '#3493d7' : '#fff',
            borderColor: '#3493d7',
            '&:hover': {
              backgroundColor: selectedStatus === '면제/해당없음' ? '#297bb0' : '#e3f2fd',
              borderColor: '#297bb0',
            }
          }}
        >
          면제/해당없음
        </Button>
      </Box>
    </Box>
  );
}

export default MilitaryStatus;
