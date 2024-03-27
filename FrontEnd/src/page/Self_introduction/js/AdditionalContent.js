
import React, { useState } from 'react';

function AdditionalContent() {
  const [additionalContent, setAdditionalContent] = useState('');

  return (
    <div>
      <h5>추가 내용</h5>
      <textarea className='additional-textarea-box' value={additionalContent} onChange={(e) => setAdditionalContent(e.target.value)} />
    </div>
  );
}

export default AdditionalContent;
