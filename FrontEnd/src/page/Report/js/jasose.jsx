import React, { useEffect, useState } from "react";
import axios from 'axios';

import { Button as Antd_btn }  from "antd";
import { EditOutlined } from "@ant-design/icons"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import {jwtDecode} from 'jwt-decode';

import "../css/jasose.css"
import { ErrorToast } from "../../../components/ToastMessage";

const Jasose = () => {

    const token = localStorage.getItem('token');
    const userData = jwtDecode(token);
    const { kakaoId, nickname } = userData;

    const [data, setData] = useState([])
    const [openAccordion, setOpenAccordion] = useState(null);
    
    const toggleAccordion = (index) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    const [isFavorite, setIsFavorite] = useState(Array(data.length).fill(false));

    const toggleFavorite = (index) => {
        const newFavorites = [...isFavorite];
        newFavorites[index] = !newFavorites[index]; // 해당 인덱스의 좋아요 상태 토글

        setIsFavorite(newFavorites);
        
        // 데이터베이스에 해당 고유값 추가 또는 제거 API 호출
        const action = newFavorites[index] ? "add" : "remove"; // 상태에 따라 추가 또는 제거
        handleFavoriteAction(data[index]._id, action); // id는 데이터의 고유값으로 가정
    };
    const handleFavoriteAction = async (id, action) => {
        try {
            await axios.post(`http://localhost:5000/api/favorites/${action}`, { 
                kakaoId: kakaoId,
                nickname: nickname,
                id: id,
                type: "jasose"
            }); // 추가 또는 제거 API
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    useEffect(() => {
        const fetchJasoseData = async () => {
            try {
                const jasoseResponse = await axios.get('http://localhost:5000/api/jasose/get', 
                    { kakaoId: kakaoId, nickname: nickname },
                    { withCredentials: true } // 크로스 도메인 요청 시 쿠키를 포함
                );

                const favoriteResponse = await axios.post('http://localhost:5000/api/favorites/get', 
                    { kakaoId: kakaoId, nickname: nickname }, 
                    { withCredentials: true } 
                );
    
                if (jasoseResponse && Array.isArray(jasoseResponse.data.data)) {
                    setData(jasoseResponse.data.data); // 배열로 전달된 데이터 설정
                    // 즐겨찾기 데이터와 자소서 데이터의 _id를 비교하여 초기 isFavorite 설정
                    const favoriteIds = favoriteResponse.data.data.jasose // 즐겨찾기된 자소서의 ID들
                    const initialFavorites = jasoseResponse.data.data.map(item => favoriteIds.includes(item._id)); // 자소서가 즐겨찾기에 있는지 확인
                    // console.log(initialFavorites)
                    setIsFavorite(initialFavorites);
                } else {
                    setData([]); // 배열이 아니면 빈 배열 설정
                    setIsFavorite([]); // 데이터가 없으면 하트 상태도 초기화
                }
    
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    ErrorToast(30)
                }
            }
        };
        fetchJasoseData();
    }, [kakaoId, nickname]);

    const handleCreateBtn = () => {
        window.location.href = '/Self_introduction'
    }


    return (
        <div className="jasose_box">
            <div className="accordion" id="accordionExample">
                {data.length !== 0 ? (
                    data.map((item, index) => { 
                        const date = new Date(item.time);
                        const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
                        const keyword = item.data.keyword.join(" ")
                        return (
                        <div className="accordion-item" key={index}>
                            <h2 className="accordion-header" id={`heading${index}`}>
                                {/* <button className="accordion-button" type="button" data-bs-toggle="collapse" 
                                    data-bs-target={`#collapse${index}`} aria-expanded="true" 
                                    aria-controls={`collapse${index}`}> */}
                                    <button className={`accordion-button ${openAccordion === index ? "" : "collapsed"}`} type="button"
                                            onClick={() => toggleAccordion(index)} aria-expanded={openAccordion === index}
                                            data-bs-target={`#collapse${index}`} aria-controls={`collapse${index}`} >
                                        <div onClick={() => toggleFavorite(index)}>
                                            {isFavorite[index] ? (
                                                <FavoriteIcon style={{ color: 'red' }} />
                                            ) : (
                                                <FavoriteBorderIcon />
                                            )}
                                        </div>
                                    <div id="jasose_date" >
                                        <p>{formattedDate}</p>
                                    </div>
                                    <div id="jasose_keyword" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <p>
                                            {keyword}
                                        </p>
                                    </div>
                                </button>
                            </h2>
                            {/* <div id={`collapse${index}`} className="accordion-collapse collapse show" aria-labelledby={`heading${index}`} data-bs-parent="#accordionExample"> */}
                            <div id={`collapse${index}`} className={`accordion-collapse collapse ${openAccordion === index ? "show" : ""}`}
                                aria-labelledby={`heading${index}`} style={{transition:"0.3s ease-in-out"}} > 
                                <div className="accordion-body">
                                    입력 키워드 : <strong>{keyword} </strong>
                                    입력 직무 : <strong>{item.data.job}</strong><hr />
                                    <strong>초안작성 결과</strong><br />
                                    {item.data.jasose}
                                    <hr />
                                    <strong>키워드별 평가</strong><br />
                                    {item.data.keyJasose}
                                </div>
                            </div>
                        </div>
                    )})
                ) : 
                    <div className="empty_box">
                        <img src="/images/empty.png" id="empty_img"/>
                        <p>저장된 자기소개서가 없습니다!</p>
                        <Antd_btn
                            type='primary'
                            id="createJasose_button"
                            icon={<EditOutlined />}
                            onClick={handleCreateBtn}
                            size='Default'
                        >
                            자기소개서 작성 하러가기
                        </Antd_btn>
                    </div>
                }
            </div>
        </div>
    );
};

export default Jasose