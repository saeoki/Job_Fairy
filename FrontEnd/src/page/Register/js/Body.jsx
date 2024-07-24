import * as React from 'react';

import "../css/Body.css"
import Stepper from './Stepper';
import InputForm from './input_form';
import InputForm2 from './input_form2';
import { Button } from '@mui/material';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';


function Body(){
    const [activeStep, setActiveStep] = React.useState(0);
    const [registerList, setRegisterList] = React.useState({
        id: "",
        name: "",
        password: "",
        military: "",
        position: [],
        location: [],
        salary: [2000, 12000],
    })

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    console.log(registerList)
    return(
        <div className="body">
            <div className='box'>
                <div id={activeStep === 0 ? "RegisterBox" : "RegisterBox2"}>
                    <div id="inputBox">
                        {activeStep === 0 && <InputForm registerList={registerList} setRegisterList={setRegisterList} />}
                        {activeStep === 1 && <InputForm2 registerList={registerList} setRegisterList={setRegisterList} />}
                    </div>
                </div>
                <div className='btn_register'>
                    {activeStep === 1 && <Button variant="contained" size="large" 
                        startIcon={<SupervisedUserCircleIcon />} type="submit">Register</Button>}
                </div>
            </div>
            <div className='stepper'>
                <Stepper activeStep={activeStep} handleNext={handleNext} handleBack={handleBack}/>
            </div>
        </div>
    )
}

export default Body