import React, {useEffect, useState} from "react";
import axios from 'axios';

import "../css/default.css"
import TextField from '@mui/material/TextField';
import {jwtDecode} from 'jwt-decode';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import MilitaryStatus from "../../Register/js/militaryStatus"
import PositionSelector from "../../Register/js/positionSelect"
import LocationSelector from "../../Register/js/location";
import SlideBar from "../../Register/js/slider"
import {ModifySuccessToast} from "../../../components/ToastMessage"

const Body = () => {
    const token = localStorage.getItem('token');
    const userData = jwtDecode(token);
    const { kakaoId, nickname } = userData;

    const [open, setOpen] = useState(false);
    const [ismodify, setIsModify] = useState(true)
    const [data, setData] = useState({
        kakaoId: kakaoId,
        nickname: nickname ? nickname : "",
        military: "",
        position: [],
        location: [],
        salary: [0, 12000] // 초기값을 빈 배열로 설정
    });

    const handleModify = () => {
        setIsModify(false)
    }
    const handleModifyCancle = () => {
        setIsModify(true)
    }

    const handleModifyButton = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
      const handleConfirm = async () => {
        setOpen(false);
        try {
            const response = await fetch('http://localhost:5000/api/auth/kakao/register', {
                method: 'POST',
                credentials: 'include', // 필요 시 추가
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            ModifySuccessToast()
            setTimeout(() => {
              window.location.href = '/Mypage';
            }, 1500); // 2000ms = 2초 후에 마이페이지로 리다이렉션 하여 수정된 정보 확인
        } catch (error) {
            console.error('Error:', error);
        }
      };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/auth/info', 
                    { kakaoId }, // 객체 형태로 감싸기
                    { withCredentials: true } // 크로스 도메인 요청 시 쿠키를 포함
                );

                setData(response.data)
            } catch (err) {
                alert("오류 발생: " + err.message);
            }
        };

        fetchUserData();
    }, []); // 빈 배열을 주어 컴포넌트가 처음 렌더링될 때만 실행

    return(
        <div className="register_container">
            <div className={ismodify? "register_box":"register_box_modify"}>
                <div className="modify_box">
                    <div className="modify_value">
                        <span>닉네임</span>
                        <TextField className="modify_input" id="outlined-basic" variant="outlined" disabled={ismodify} 
                                    defaultValue={data.nickname}/>
                    </div>
                    <div className="modify_value">
                        <span>병역 의무</span>
                        {!ismodify? 
                        <MilitaryStatus registerList={data} setRegisterList={setData} />
                        :
                        <TextField className="modify_input" id="outlined-basic" variant="outlined" disabled={ismodify}
                        defaultValue={data.military} />
                        }
                    </div>
                    <div className="modify_value">
                        <span>희망 직무</span>
                        {!ismodify?
                        <PositionSelector registerList={data} setRegisterList={setData} />
                        :
                        <TextField className="modify_input" id="outlined-basic" variant="outlined" disabled={ismodify} 
                        defaultValue={data.position}/>
                        }
                    </div>
                    <div className="modify_value">
                        <span>관심 지역</span>
                        {!ismodify?
                        <LocationSelector registerList={data} setRegisterList={setData} />
                        :
                        <TextField className="modify_input" id="outlined-basic" variant="outlined" disabled={ismodify} 
                        defaultValue={data.location}/>
                        }
                    </div>
                    <div className="modify_value">
                        <span>희망 연봉</span>
                        {!ismodify?
                        <SlideBar registerList={data} setRegisterList={setData} />
                        :
                        <>
                        <TextField className="modify_money" id="outlined-basic" variant="outlined" disabled={ismodify} 
                                    defaultValue={data.salary[0]}/>
                        <div className="text">
                            ~
                        </div>
                        <TextField className="modify_money" id="outlined-basic" variant="outlined" disabled={ismodify} 
                                    defaultValue={data.salary[1]}/>
                        <div className="text">
                            만원
                        </div>
                        </>}
                    </div>
                </div>
                <div className="modify_btn">
                    {ismodify ? 
                    <Button variant="contained" onClick={handleModify} color="warning" >수정하기</Button>
                    :
                    <>
                        <Button id="modify_btn" variant="contained" onClick={handleModifyCancle} >취소</Button>
                        <Button id="modify_btn" variant="contained" color="success" onClick={handleModifyButton} >저장</Button>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>입력한 정보로 수정하시겠습니까?</DialogTitle>
                            <DialogActions style={{ justifyContent: 'center' }} >
                                <Button onClick={handleConfirm} autoFocus variant="contained" color="success">네</Button>
                                <Button onClick={handleClose} variant="contained" color="error">아니요</Button>
                            </DialogActions>
                        </Dialog>
                    </>
                    }
                </div>
            </div>
        </div>
    )
}


export default Body