import React, { useEffect, useState } from "react";
import axios from 'axios';

import { Button as Antd_btn, Modal }  from "antd"; // Import Modal
import { EditOutlined } from "@ant-design/icons"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {jwtDecode} from 'jwt-decode';

import "../css/myeonjeob.css"
import "../css/jasose.css"
import { ErrorToast, RemoveJasoseReportToast } from "../../../components/ToastMessage";
import { Button } from "@mui/material";

const BackendIP = process.env.REACT_APP_EC2_IP

const Myeonjoeb = () => {
    const token = localStorage.getItem('token');
    const userData = jwtDecode(token);
    const { kakaoId, nickname } = userData;

    const [data, setData] = useState([]);
    const [openAccordion, setOpenAccordion] = useState(null);
    const [isFavorite, setIsFavorite] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [deleteId, setDeleteId] = useState(null);

    const toggleAccordion = (index) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    const toggleFavorite = (index) => {
        const newFavorites = [...isFavorite];
        newFavorites[index] = !newFavorites[index]; 
        setIsFavorite(newFavorites);
        const action = newFavorites[index] ? "add" : "remove";
        handleFavoriteAction(data[index]._id, action); 
    };

    const handleFavoriteAction = async (id, action) => {
        try {
            // await axios.post(`http://localhost:5000/api/favorites/${action}`, { 
            await axios.post(`${BackendIP}/api/favorites/${action}`, {
                kakaoId, nickname, id, type: "myeonjeob"
            });
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    useEffect(() => {
        const fetchJasoseData = async () => {
            try {
                // const myeonjeobResponse = await axios.post('http://localhost:5000/api/myeonjeob/get', 
                const myeonjeobResponse = await axios.post(`${BackendIP}/api/myeonjeob/get`, 
                    { kakaoId, nickname },
                    { withCredentials: true }
                );
                // const favoriteResponse = await axios.post('http://localhost:5000/api/favorites/get', 
                const favoriteResponse = await axios.post(`${BackendIP}/api/favorites/get`, 
                    { kakaoId, nickname }, 
                    { withCredentials: true } 
                );
    
                if (myeonjeobResponse && Array.isArray(myeonjeobResponse.data.data)) {
                    setData(myeonjeobResponse.data.data);
                    const favoriteIds = favoriteResponse.data.data.myeonjoeb;
                    const initialFavorites = myeonjeobResponse.data.data.map(item => favoriteIds.includes(item._id));
                    setIsFavorite(initialFavorites);
                } else {
                    setData([]);
                    setIsFavorite([]);
                }
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    ErrorToast(30);
                }
            }
        };
        fetchJasoseData();
    }, [kakaoId, nickname]);

    const removeJasoseReport = async (id) => {
        try {
            // const response = await axios.post('http://localhost:5000/api/myeonjeob/remove', { kakaoId, nickname, id });
            const response = await axios.post(`${BackendIP}/api/myeonjeob/remove`, { kakaoId, nickname, id });
            if (response.status === 200) {
                // Remove the deleted item from the state
                setData(prevData => prevData.filter(item => item._id !== id));
                RemoveJasoseReportToast()
            }
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                ErrorToast(32);
            } else {
                ErrorToast(99)
            }
        }
    };

    const handleCreateBtn = () => {
        window.location.href = "/Self_introduction"
    }
    const handleDelBtn = (id) => {
        setDeleteId(id);
        setIsModalOpen(true); 
    };

    const confirmDelete = () => {
        removeJasoseReport(deleteId);
        setIsModalOpen(false);
    };

    const emotionTranslations = {
        "Angry": "분노",
        "Disgust": "혐오",
        "Fear": "공포",
        "Happy": "행복",
        "Neutral": "중립",
        "Sad": "슬픔",
        "Surprise": "놀람"
    };

    return (
        <div className="jasose_box">
            <div className="accordion" id="accordionExample">
                {data.length !== 0 ? (
                    data.map((item, index) => { 
                        const date = new Date(item.createdAt);
                        const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
                        const totalValue = Object.values(item.accumulatedEmotions).reduce((sum, value) => sum + value, 0);
    
                        const translatedEmotions = Object.entries(item.accumulatedEmotions).map(([emotion, value]) => {
                            const koreanEmotion = emotionTranslations[emotion]; // 감정을 한국어로 변환
                            const percentage = ((value / totalValue) * 100).toFixed(2); // 백분율로 변환하고 소수점 두 자리까지 표시
                            return {
                                emotion: koreanEmotion,
                                rate: `${percentage}%`
                            };
                        });
                        return (
                        <div className="accordion-item" key={index}>
                            <h2 className="accordion-header" id={`heading${index}`}>
                                <button className={`accordion-button ${openAccordion === index ? "" : "collapsed"}`} 
                                        type="button"
                                        onClick={() => toggleAccordion(index)} 
                                        aria-expanded={openAccordion === index}
                                        data-bs-target={`#collapse${index}`} 
                                        aria-controls={`collapse${index}`} >
                                    <div onClick={() => toggleFavorite(index)} >
                                        {isFavorite[index] ? (
                                            <FavoriteIcon style={{ color: 'red' }} />
                                        ) : (
                                            <FavoriteBorderIcon />
                                        )}
                                    </div>
                                    <div id="jasose_date">
                                        <p>{formattedDate}</p>
                                    </div>
                                </button>
                            </h2>
                            <div id={`collapse${index}`} className={`accordion-collapse collapse ${openAccordion === index ? "show" : ""}`} 
                                 aria-labelledby={`heading${index}`}>
                                <div className="accordion-body" style={{overflowY:"auto"}}>
                                    <strong>정밀분석 결과</strong>
                                    <Button id="content_delbtn" variant="contained" color="error" size="small" onClick={() => handleDelBtn(item._id)}>삭제</Button>
                                    <hr />
                                    <strong>표정 분석 결과</strong><br />
                                    {translatedEmotions.map((emotionData, idx) => {
                                    return (
                                        <>
                                            <span className="emotion_detail"><strong>{emotionData.emotion}</strong> : </span>
                                            <span className="emotion_detail">{emotionData.rate} </span>
                                        </>
                                    );
                                    })}
                                    <p className="emotion_feedback">{item.emotionFeedback}</p>
                                    <hr />
                                    <strong>역량 평가</strong><br />
                                    {item?.questionsAndAnswers?.map((QA,idx)=> {
                                        return (
                                        <div className="qa">
                                            <p className="qa_q">
                                                질문{idx+1} : {QA?.question}
                                            </p>
                                            <p className="qa_a">
                                                답변{idx+1} : {QA?.answer}
                                            </p>
                                            <p className="qa_s">
                                                평가{idx+1} : {QA?.evaluation}
                                            </p>
                                        </div>
                                        )
                                    })}                        
                                </div>
                            </div>
                        </div>
                    )})
                ) : (
                    <div className="empty_box">
                        <img src="/images/empty.png" id="empty_img"/>
                        <p>저장된 면접 리포트가 없습니다!</p>
                        <Antd_btn
                            type='primary'
                            id="createJasose_button"
                            icon={<EditOutlined />}
                            onClick={handleCreateBtn}
                            size='Default'>
                            AI 면접 보러가기
                        </Antd_btn>
                    </div>
                )}
            </div>
            <Modal
                title="삭제 확인"
                open={isModalOpen}
                centered
                onOk={confirmDelete}  // Confirm deletion
                okType='danger'
                onCancel={() => setIsModalOpen(false)}  // Close modal
                okText="삭제"
                cancelText="취소"
            >
                <p>정말 삭제하시겠습니까?</p>
            </Modal>
        </div>
    );
};

export default Myeonjoeb;
