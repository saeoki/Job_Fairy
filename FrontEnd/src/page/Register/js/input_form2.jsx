import "../css/inputForm.css"
import LocationSelector from "./location"
import MilitaryStatus from "./militaryStatus"
import PositionSelector from "./positionSelect"
import SlideBar from "./slider"



const InputForm2 = ({registerList, setRegisterList}) => {
    return (
        <>
            <div className="input-form-box">
                <span>병역의무</span>
                <MilitaryStatus registerList={registerList} setRegisterList={setRegisterList} />
            </div>
            <div className="input-form-box">
                <span>희망 직무</span>
                <PositionSelector registerList={registerList} setRegisterList={setRegisterList} />
            </div>
            <div className="input-form-box">
                <span>관심 지역</span>
                <LocationSelector registerList={registerList} setRegisterList={setRegisterList} />
            </div>
            <div className="input-form-box">
                <span>희망 연봉</span>
                <SlideBar registerList={registerList} setRegisterList={setRegisterList} />
            </div>
        </>
    )
}

export default InputForm2