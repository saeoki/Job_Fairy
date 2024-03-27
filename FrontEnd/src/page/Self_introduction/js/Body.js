// Body.js
import "../css/Body.css"

import React from 'react';
import Inputwords from './Inputwords';
import JobInput from './JobInput';
import SettingsApply from './SettingsApply';
import AdditionalContent from './AdditionalContent';
import Self_introduction from "./Self_introduction";
import StartIntroduction from "./StartIntroduction";

function Body() {
  return (
    <div className="body">
      <div id = "Self_introductionBox" >
        <div class="jobinput-box">
            <JobInput />
        </div>

        <div class="inputkeywords-box">
           <Inputwords />
        </div>

        <div class="settingapply-box">
          <SettingsApply />
        </div>

        <div class="addtionalcontent-box">
            <AdditionalContent />
        </div>
        <StartIntroduction />
      </div>
    </div>
  );
}

export default Body;
