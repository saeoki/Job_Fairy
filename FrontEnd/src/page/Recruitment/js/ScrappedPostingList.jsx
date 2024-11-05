import React from "react";
import Header from "../../Home/js/Header";
import ScrappedPostingListBody from "./ScrappedPostingListBody";
import Footer from "../../Home/js/Footer";



function ScrappedPostingList(){
    return(
        <div> 
            <Header />
            <ScrappedPostingListBody />
            <Footer />
        </div>

    )
}
export default ScrappedPostingList;