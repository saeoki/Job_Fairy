import React from "react";

import Header from "../../Home/js/Header"
import Body from "./body";
import Footer from "../../Home/js/Footer"

import { LoginErrorToast } from "../../../components/ToastMessage";

function Report(){

    const token = localStorage.getItem('token');

    if(!token){
        LoginErrorToast()
    }

    return(
        <div>
            <Header />
            <Body />
            <Footer />
        </div>
    )
}
export default Report;