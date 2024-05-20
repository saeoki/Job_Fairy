import "../css/inputForm.css"
import LocationSelector from "./location"
import MilitaryStatus from "./militaryStatus"
import PositionSelector from "./positionSelect"
import SlideBar from "./slider"



const InputForm2 = () => {
    return (
        <>
            <div className="input-form-box">
                <span>병역의무</span>
                <MilitaryStatus />
            </div>
            <div className="input-form-box">
                <span>희망 직무</span>
                <PositionSelector />
            </div>
            <div className="input-form-box">
                <span>관심 지역</span>
                <LocationSelector />
            </div>
            <div className="input-form-box">
                <span>희망 연봉</span>
                <SlideBar />
            </div>
        </>
    )
}

export default InputForm2