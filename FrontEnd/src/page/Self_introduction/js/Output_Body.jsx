// Body.js
import "../css/Output_Body.css"
import React from 'react';
import Outputpage from "./Outputpage";

const Body = ({ isInput, infoList }) => {
  return (
    <div className="body">
        <div id='Output_Self_introduction'>
            <Outputpage isInput={isInput} infoList={infoList} />
        </div>
    </div>
  );
}

export default Body;
