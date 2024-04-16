/* 자기소개서 */
import "../../Self_introduction/css/Self_Body.css"

import React, { useState } from "react";
import Header from "../../Home/js/Header"
import Input_Body from "./Input_Body";
import Footer from "../../Home/js/Footer";
import Output_Body from "./Output_Body"

function Self_introduction(){

  const [isInput, setIsInput] = useState(false);

  return(
    <div className="container_box">
        <Header />
        {isInput ? 
        <Output_Body /> :
        // <></> :
        <Input_Body isInput={isInput} setIsInput={setIsInput} />
        }
        <Footer />
    </div>
  )
}
export default Self_introduction;
