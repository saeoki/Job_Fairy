import React from "react";
import Header from "../../Home/js/Header";
import DashBoardBody from "./DashBoardBody";
import Footer from "../../Home/js/Footer";



function DashBoard(){
    return(
        <div> 
            <Header />
            <DashBoardBody />
            <Footer />
        </div>

    )
}
export default DashBoard;