import React from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';

import "../../Home/css/Home_Body.css"

function Body(){
    return(
        <div className="body">
            <div className="row" style={{marginTop:"3vh"}}>
                <div className="col-12 col-md-6">
                    <Link to="/AIinterview">
                        <Button variant="primary">
                            AI 면접✨
                        </Button>
                    </Link>
                </div>
                <div className="col-12 col-md-6">
                    <Link to="/Self_introduction">
                        <Button variant="primary">
                            자소서 작성🧚‍♀️
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-6">
                    <Link to="/Recruitment">
                        <Button variant="primary">
                            채용 정보🔎
                        </Button>
                    </Link>
                </div>
                <div className="col-12 col-md-6">
                    <Link to="/Report">
                        <Button variant="primary">
                            리포트📃
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
        
    )
}

export default Body