import React from "react";

import "../css/default.css"
import Jasose from "./jasose";
import Myeonjoeb from "./myeonjeob";

const Body = () => {

    return(
        <div className="report_container">
            <div className="row">
                <div className="col-12 col-md-3 col-lg-2" id="col_1">
                    <div className="nav nav-pills mb-3 d-md-block d-flex justify-content-between" 
                                    id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <button className="nav-link active" id="v-pills-interview-tab" data-bs-toggle="pill" 
                                data-bs-target="#v-pills-interview" type="button" role="tab" aria-controls="v-pills-interview" 
                                aria-selected="true">면접결과</button>
                        <button className="nav-link" id="v-pills-jasose-tab" data-bs-toggle="pill"
                                data-bs-target="#v-pills-jasose" type="button" role="tab" aria-controls="v-pills-jasose" 
                                aria-selected="false">자기소개서</button>
                    </div>
                </div>
                <div className="col-12 col-md-9 col-lg-10">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="v-pills-interview" 
                                role="tabpanel" aria-labelledby="v-pills-interview-tab">
                            <Myeonjoeb />
                        </div>
                        <div className="tab-pane fade" id="v-pills-jasose" 
                            role="tabpanel" aria-labelledby="v-pills-jasose-tab">
                            <Jasose />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Body