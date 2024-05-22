import React, { useState } from "react";
import Header from "../../Home/js/Header"
import Body from "./Body";
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from "../../Home/js/Footer";
function AI_interview_start() {
    return(
        <div >
            <Header />
            <Body />
            <Footer />
        </div>
      )
}

export default AI_interview_start;