import * as React from 'react';


import "../css/Body.css"
import Stepper from './Stepper';
import InputForm from './input_form';
import InputForm2 from './input_form2';


function Body(){
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return(
        <div className="body">
            <div className='box'>
                <div id="RegisterBox">
                    <div id="inputBox">
                        {activeStep === 0 && <InputForm />}
                        {activeStep ===1 && <InputForm2 />}
                    </div>
                </div>
            </div>
            <div className='stepper'>
                <Stepper activeStep={activeStep} handleNext={handleNext} handleBack={handleBack}/>
            </div>
        </div>
    )
}

export default Body