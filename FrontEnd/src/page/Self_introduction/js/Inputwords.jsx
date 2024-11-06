// InputKeywords.js

import React, { useState } from 'react';
import '../css/Self_Body.css';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';


const InputKeywords = ({ setInfoList }) => {
  const [keywordsList, setKeywordsList] = useState(['']);

  const handleAddKeyword = () => {
    setKeywordsList([...keywordsList, '']);
    setInfoList(prevState => ({
      ...prevState,
      keywordList : keywordsList,
    }))
  };

  const handleRemoveKeyword = (indexToRemove) => {
    if (keywordsList.length > 1) {
      const updatedKeywords = keywordsList.filter((_, index) => index + 1 !== indexToRemove + 1);
      setKeywordsList(updatedKeywords);
      setInfoList(prevState => ({
        ...prevState,
        keywordList : updatedKeywords,
      }))
    }
  };

  const handleKeywordChange = (index, value) => {
    const updatedKeywordsList = [...keywordsList];
    updatedKeywordsList[index] = value;
    setKeywordsList(updatedKeywordsList);
    setInfoList(prevState => ({
      ...prevState,
      keywordList : updatedKeywordsList,
    }))
  };

  return (
    <div className='inputkeywords-box'>
      <div className="horizontal-container">
        <h5>자기소개서 키워드 입력하기</h5>
        <div className='button_box'>
          <AddCircleIcon onClick={handleAddKeyword} color="primary" 
            sx={{
              fontSize:35,
            }}
          />
        </div>
        
      </div>
      <div className="textarea-container">
        {keywordsList.map((keyword, index) => (
          <div key={index + 1} className="input-textarea-row">
            <FormControl variant="outlined">
              <OutlinedInput
                className="input-textarea-box"
                value={keyword}
                onChange={(e) => handleKeywordChange(index, e.target.value)}
                placeholder={"키워드를 입력해주세요." }
              />
            </FormControl>
            {keywordsList.length > 1 && (
              <RemoveCircleIcon onClick={() => handleRemoveKeyword(index)} color='error' 
                sx={{
                  fontSize:35,
                  marginTop:1.2,
                  marginLeft:1
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputKeywords;