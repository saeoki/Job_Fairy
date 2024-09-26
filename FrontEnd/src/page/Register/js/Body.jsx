import React from "react";

import "../css/Body.css"
import InputForm2 from './input_form2';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';

import {jwtDecode} from 'jwt-decode';
import { RegisterSuccessToast } from "../../../components/ToastMessage";

function Body(){

    const token = localStorage.getItem('token');

    const userData = jwtDecode(token);
    const { kakaoId, nickname } = userData;

    const [registerList, setRegisterList] = React.useState({
        kakaoId: kakaoId,
        name: nickname ? nickname : "",
        military: "",
        position: [],
        location: [],
        salary: [2000, 12000],
    })


    const isNameEmpty = Object.keys(registerList.name).length === 0;
    const isMilitaryEmpty = Object.keys(registerList.military).length === 0;
    const isPositionListEmpty = Object.keys(registerList.position).length === 0;
    const isLocationListEmpty = Object.keys(registerList.location).length === 0;

  // 버튼 비활성화 여부를 결정하는 함수
  const isDisableButton = isNameEmpty || isMilitaryEmpty || isPositionListEmpty || isLocationListEmpty

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/kakao/register', {
                method: 'POST',
                credentials: 'include', // 필요 시 추가
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerList),
            });
            RegisterSuccessToast()
            // 토스트 메시지가 사라진 후에 리다이렉션을 수행합니다.
            setTimeout(() => {
              window.location.href = '/';
            }, 2000); // 2000ms = 2초 후에 리다이렉션
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return(
        <div className="body">
            <div className='box'>
                <div id="RegisterBox2">
                    <div id="inputBox">
                        <InputForm2 registerList={registerList} setRegisterList={setRegisterList} />
                    </div>
                    <div className='btn_register'>
                        <Stack spacing={2} direction="row">
                            <Button variant="contained" size="large" type="submit" color='success' onClick={handleRegister} disabled={isDisableButton}>저장하기</Button>
                            <Button variant='contained' size="large" color='error'>다음에 하기</Button>
                        </Stack>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Body