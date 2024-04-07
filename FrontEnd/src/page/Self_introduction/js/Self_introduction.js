/* 자기소개서 */
import "../../Self_introduction/css/Self_Body.css"

import React, { useState } from "react";
import Header from "../../Home/js/Header"
import Body from "./Body";
import Footer from "../../Home/js/Footer";

function Self_introduction(){
  return(
    <div className="container_box">
        <Header />
        <Body />
        <Footer />
    </div>
  )
}
export default Self_introduction;
