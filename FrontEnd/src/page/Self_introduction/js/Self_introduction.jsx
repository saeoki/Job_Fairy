/* 자기소개서 */
import "../../Self_introduction/css/Self_Body.css"

import React, { useState, useContext } from "react";
import Header from "../../Home/js/Header"
import Input_Body from "./Input_Body";
import Footer from "../../Home/js/Footer";
import Output_Body from "./Output_Body"

import { AuthContext } from "../../../context/AuthContext"
import { LoginErrorToast } from "../../../components/ToastMessage";

function Self_introduction(){

  const token = localStorage.getItem('token');

  if(!token){
    LoginErrorToast()
  }

  const [isInput, setIsInput] = useState(false);

  const [infoList, setInfoList] = useState({
    jobList:{},
    keywordList:{},
    addContent:""
  })

  


  return(
    <div className="container_box">
        <Header />
        {isInput ? 
        <Output_Body isInput={isInput} infoList={infoList} /> :
        <Input_Body isInput={isInput} setIsInput={setIsInput} infoList={infoList} setInfoList={setInfoList} />
        }
        <Footer />
    </div>
  )
}
export default Self_introduction;
