// Body.js
import "../../Self_introduction/css/Self_Body.css"

import React from 'react';
import Inputwords from './Inputwords';
import SettingsApply from './SettingsApply';
import AdditionalContent from './AdditionalContent';
import StartIntroduction from "./StartIntroduction";
import InputBox from "./InputBox";

function Body() {
  return (
    <div className="body">
      <div id = "Self_introductionBox" >
        <div className="jobinput-box">
            <InputBox  />
        </div>

        <div className="inputkeywords-box">
           <Inputwords />
        </div>

        <div className="settingapply-box">
          <SettingsApply />
        </div>

        <div className="addtionalcontent-box">
            <AdditionalContent />
        </div>
        <StartIntroduction />
      </div>
    </div>
  );
}

export default Body;
