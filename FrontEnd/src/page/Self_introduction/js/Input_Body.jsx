// Body.js
import "../../Self_introduction/css/Self_Body.css"

import React, {useState} from 'react';
import Inputwords from './Inputwords';
import SettingsApply from './SettingsApply';
import AdditionalContent from './AdditionalContent';
import StartIntroduction from "./StartIntroduction";
import InputBox from "./InputBox";

const Body = ({isInput, setIsInput}) => {
  const [isCheck, setIsCheck] = useState(false);

  const [infoList, setInfoList] = useState({
    jobList:{},
    keywordList:{},
    addContent:""
  })

  return (
    <div className="body">
      <div id = "Self_introductionBox" >
        <div className="jobinput-box">
            <InputBox  isCheck={isCheck} setInfoList={setInfoList}/>
        </div>

        <div className="inputkeywords-box">
           <Inputwords isCheck={isCheck} setInfoList={setInfoList}/>
        </div>

        <div className="settingapply-box">
          <SettingsApply isCheck={isCheck} setIsCheck={setIsCheck}/>
        </div>

        <div className="addtionalcontent-box">
            <AdditionalContent setInfoList={setInfoList}/>
        </div>
        <StartIntroduction infoList={infoList} isInput={isInput} setIsInput={setIsInput} />
      </div>
    </div>
  );
}

export default Body;
