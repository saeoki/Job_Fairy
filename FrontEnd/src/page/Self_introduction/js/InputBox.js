import * as React from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function InputBox() {
  return (
        <Autocomplete
            multiple
            limitTags={2}
            id="multiple-limit-tags"
            options={programmerList}
            getOptionLabel={(option) => option.title}
            defaultValue={[programmerList[0]]}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label="직무" 
                    placeholder="선호 직무" 
                />
            )}
            sx={{ width: '350px' }}
        />
  );
}

const programmerList = [
  { title: '프론트엔드'},
  { title: '벡엔드'},
  { title: '인공지능'},
  { title: '네트워크'},
  { title: '펌웨어'},
];