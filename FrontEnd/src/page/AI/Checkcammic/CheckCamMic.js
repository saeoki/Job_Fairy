import React, { useState } from "react";
import Header from "../../Home/js/Header"
import Body from "./Body";
import { BrowserRouter as Router } from 'react-router-dom';

function CheckCamMic() {
    return(
        <div >
            <Header />
            <Body />
        </div>
      )
}

export default CheckCamMic;