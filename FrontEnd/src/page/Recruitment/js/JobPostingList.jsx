import React from "react";
import Header from "../../Home/js/Header";
import JobPostingListBody from "./JobPostingListBody";
import Footer from "../../Home/js/Footer";



function JobPostingList(){
    return(
        <div> 
            <Header />
            <JobPostingListBody />
            <Footer />
        </div>
    )
}
export default JobPostingList;