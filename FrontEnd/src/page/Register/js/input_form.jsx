import "../css/Body.css"

import { Tooltip } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const InputForm = () => {
    return (
        <>
            <div className="input-form-box">
                <span>아이디 </span>
                <input type="text" name="uid" className="form-control" placeholder="아이디를 입력하세요"/>
                <button type="button" className="btn btn-primary btn-sm" id="btn-check" style={{maxHeight:"26px", maxWidth:"60px", marginTop:"5px"}}>
                        중복체크
                </button>
            </div>
            <div className="input-form-box">
                <span>이름 </span>
                <input type="text" name="uid" className="form-control" placeholder="이름을 입력하세요"/>
            </div>
            <div className="input-form-box">
                <span>비밀번호 </span>
                <input type="password" name="upw" className="form-control" placeholder="비밀번호를 입력하세요"/>
                    <Tooltip title="비밀번호는 영문,숫자,특수기호를 포함한 6~12자리" placement="right">
                        <ErrorOutlineIcon sx={{fontSize: 33, marginLeft:1}}/>
                    </Tooltip>
            </div>
            <div className="input-form-box">
                <span>비밀번호 확인 </span>
                <input type="text" name="uid" className="form-control" placeholder="비밀번호를 재입력하세요"/>
            </div>
        </>
    )
}

export default InputForm