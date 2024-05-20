import React, { useState } from 'react';
import { Slider, Typography, Box } from '@mui/material';

function SalarySlider() {
  const [value, setValue] = useState([2000, 12000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={2000}
        max={12000}
        step={1000}
        marks={[
          { value: 2000, label: '2000만원' },
          { value: 12000, label: '1억2천만원' }
        ]}
        aria-labelledby="range-slider"
      />
      <Typography>
        {value[0]}만원 - {value[1]}만원
      </Typography>
    </Box>
  );
}

export default SalarySlider;
