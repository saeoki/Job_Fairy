import React, { useState } from 'react';
import { red } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';

function SettingsApply() {
  const [applySettings, setApplySettings] = useState(false);

  const handleCheckboxChange = () => {
    setApplySettings(!applySettings); // Checkbox의 상태를 반전시킴
  };

  return (
    <div>
      <h5>개인설정 적용하기</h5>
      <label className='settingapply-box'>
          - 마이페이지의 개인 설정을 적용합니다
        <Checkbox
          className="settingapply-box-checkbox"
          checked={applySettings}
          onChange={handleCheckboxChange}
          style={{ color: red[600] }} // Checkbox의 색상을 빨간색으로 지정
        />
      </label>
    </div>
  );
}

export default SettingsApply;
