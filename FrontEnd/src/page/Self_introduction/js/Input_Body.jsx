// Body.js
import "../../Self_introduction/css/Self_Body.css"

import React from 'react';
import Inputwords from './Inputwords';
import AdditionalContent from './AdditionalContent';
import StartIntroduction from "./StartIntroduction";
import InputBox from "./InputBox";

const Body = ({ setIsInput, infoList, setInfoList}) => {

  return (
    <div className="body">
      <div id = "Self_introductionBox" >
        <div className="jobinput-box">
            <InputBox setInfoList={setInfoList}/>
        </div>

        <div className="inputkeywords-box">
           <Inputwords setInfoList={setInfoList}/>
        </div>

        <div className="addtionalcontent-box">
            <AdditionalContent setInfoList={setInfoList}/>
        </div>
        <StartIntroduction infoList={infoList} setIsInput={setIsInput} />
      </div>
    </div>
  );
}

export default Body;
