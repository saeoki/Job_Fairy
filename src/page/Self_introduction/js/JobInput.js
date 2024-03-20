// import React, { useState } from 'react';
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';
// import '../css/Body.css';

// function JobInput() {
//   const [content, setContent] = useState('');
//   const jobList = ['직무1', '직무2', '직무3', '직무4','직무5']; // 선택 가능한 직무 목록

//   const handleJobSelect = (event, selectedJob) => {
//     setContent(selectedJob);
//   };

//   return (
//     <div>
//       <h5>직무를 선택해 주세요</h5>
//       <Autocomplete
//         value={content}
//         onChange={handleJobSelect}
//         options={jobList}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             className="input-textarea-box" 
//           />
//         )}
//       />
//     </div>
//   );
// }

// export default JobInput;
// JobInput.js

import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function JobInput({ setSelectedJob }) {
  const [content, setContent] = useState('');
  const jobList = ['직무1', '직무2', '직무3', '직무4','직무5']; // 선택 가능한 직무 목록

  const handleJobSelect = (event, selectedJob) => {
    setContent(selectedJob);
    setSelectedJob(selectedJob); // 선택된 직무를 App 컴포넌트의 selectedJob state로 설정
  };

  return (
    <div>
      <h5>직무를 선택해 주세요</h5>
      <Autocomplete
        value={content}
        onChange={handleJobSelect}
        options={jobList}
        renderInput={(params) => (
          <TextField
            {...params}
            className="input-textarea-box" 
          />
        )}
      />
    </div>
  );
}

export default JobInput;


