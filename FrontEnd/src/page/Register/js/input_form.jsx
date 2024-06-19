import "../css/Body.css"

import React, {useState} from "react";
import { Tooltip } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Alert from '@mui/material/Alert';

const InputForm = ({registerList, setRegisterList}) => {
    const [isconfirm, setIsConfirm] = useState(false)

    const handleTextValue = (name, value) =>{
        setRegisterList(prevState=> ({
            ...prevState,
            [name] : value
        }))
    }

    const handlePasswordConfirm = (value) => {
        const password = registerList.password
        if(password === value){
            setIsConfirm(true)
        } else{
            setIsConfirm(false)
        }
    }
    return (
        <>
            <div className="input-form-box">
                <span>아이디 </span>
                <input type="text" name="id" onChange={(e) => handleTextValue(e.target.name, e.target.value)}
                    className="form-control" placeholder="아이디를 입력하세요"/>
                <button type="button" className="btn btn-primary btn-sm" id="btn-check" 
                    style={{maxHeight:"26px", maxWidth:"60px", marginTop:"5px"}}>
                        중복체크
                </button>
            </div>
            <div className="input-form-box">
                <span>이름 </span>
                <input type="text" name="name" onChange={(e) => handleTextValue(e.target.name, e.target.value)}
                    className="form-control" placeholder="이름을 입력하세요"/>
            </div>
            <div className="input-form-box">
                <span>비밀번호 </span>
                <input type="password" name="password" onChange={(e) => handleTextValue(e.target.name, e.target.value)}
                    className="form-control" placeholder="비밀번호를 입력하세요"/>
                    <Tooltip title="비밀번호는 영문,숫자,특수기호를 포함한 6~12자리" placement="right">
                        <ErrorOutlineIcon sx={{fontSize: 33, marginLeft:1}}/>
                    </Tooltip>
            </div>
            <div className="input-form-box">
                <span>비밀번호 확인 </span>
                <input type="password" name="upwc" onChange={(e) => handlePasswordConfirm(e.target.value)}
                    className="form-control" placeholder="비밀번호를 재입력하세요"/>
            </div>
            {registerList.password.length >= 1 ? 
                <div className="password-feedback">
                    {isconfirm ? 
                    <Alert severity="success">비밀번호가 일치합니다.</Alert> 
                    : <Alert severity="error">비밀번호가 일치하지 않습니다.</Alert>}
                </div> 
                : <div></div>}
        </>
    )
}

export default InputForm