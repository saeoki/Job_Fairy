import React, { useEffect, useState } from 'react';
import { Slider, Typography, Box } from '@mui/material';

const SalarySlider = ({registerList, setRegisterList}) => {
  const [value, setValue] = useState([2000,12000]);
  useEffect(()=>{
    setValue(registerList.salary)
  },[])

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setRegisterList(prevState => ({
      ...prevState,
      salary : newValue
    }))
  };

  return (
    <Box sx={{ maxWidth: 300, minWidth: 200, marginBottom: "20px"}}>
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
