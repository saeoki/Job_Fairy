// InputKeywords.js

import React, { useState } from 'react';
import '../css/Self_Body.css';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';

const InputKeywords = ({ setSelectedJob }) => {
  const [keywordsList, setKeywordsList] = useState(['']);

  const handleAddKeyword = () => {
    setKeywordsList([...keywordsList, '']);
  };

  const handleRemoveKeyword = (indexToRemove) => {
    if (keywordsList.length > 1) {
      setKeywordsList(keywordsList.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleKeywordChange = (index, value) => {
    const updatedKeywordsList = [...keywordsList];
    updatedKeywordsList[index] = value;
    setKeywordsList(updatedKeywordsList);
    setSelectedJob(value); // 선택한 직무를 상위 컴포넌트로 전달
  };

  return (
    <div className='inputkeywords-box'>
      <div className="horizontal-container">
        <h5>자기소개서 키워드 입력하기</h5>
        <Button variant="contained" className="keywords-button" color="primary" onClick={handleAddKeyword}>
          +
        </Button>
        {keywordsList.length > 1 && (
          <Button variant="contained" className="keywords-button" color="error"  onClick={() => handleRemoveKeyword(0)}>
            -
          </Button>
        )}
      </div>
      <div className="textarea-container">
        {keywordsList.map((keyword, index) => (
          <div key={index} className="input-textarea-row">
            <FormControl variant="outlined">
              <OutlinedInput
                className="input-textarea-box"
                value={keyword}
                onChange={(e) => handleKeywordChange(index, e.target.value)}
              />
            </FormControl>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputKeywords;
