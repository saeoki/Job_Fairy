
import React, { useState } from 'react';

const AdditionalContent = ({setInfoList}) => {

  const [additionalContent, setAdditionalContent] = useState('');

  const ChangeHandler = (e) => {
    setAdditionalContent(e.target.value)
    setInfoList(prevState => ({
      ...prevState,
      addContent : e.target.value,
    }))
  }
  return (
    <div>
      <h5>추가 내용</h5>
      <textarea className='additional-textarea-box' 
          value={additionalContent} 
          onChange={ChangeHandler}
      />
    </div>
  );
}

export default AdditionalContent;
