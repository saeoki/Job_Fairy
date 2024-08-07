/* 
  자기소개서 작성 페이지
    직무 선택 박스 컴포넌트
*/


import * as React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const InputBox = ({isCheck, setInfoList}) => {
  
  const programmerList = [
    { title: '프론트엔드'},
    { title: '벡엔드'},
    { title: '인공지능'},
    { title: '네트워크'},
    { title: '펌웨어'},
  ];
  
  const jobInputHandler = (value) => {
    const selectedValues = value.map(option => option.title);
      setInfoList(prevState => ({
        ...prevState,
        jobList : selectedValues,
      }))
  }

  return (
        <Autocomplete
            multiple
            limitTags={2}
            id="multiple-limit-tags"
            options={programmerList}
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, value) => option.title === value.title}
            // defaultValue={[programmerList[0]]}
            disabled={isCheck}
            onChange={(e,value) => jobInputHandler(value)}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label="선호 직무" 
                    // placeholder="선호 직무" 
                />
            )}
            sx={{ width: '350px' }}
        />
  );
}


export default InputBox