import React, { useEffect, useState } from "react";
import axios from 'axios';

import { Button as Antd_btn, Modal }  from "antd"; // Import Modal
import { EditOutlined } from "@ant-design/icons"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {jwtDecode} from 'jwt-decode';

import "../css/jasose.css"
import { ErrorToast, RemoveJasoseReportToast } from "../../../components/ToastMessage";
import { Button } from "@mui/material";

const BackendIP = process.env.REACT_APP_EC2_IP

const Jasose = () => {
    const token = localStorage.getItem('token');
    const userData = jwtDecode(token);
    const { kakaoId, nickname } = userData;

    const [data, setData] = useState([]);
    const [openAccordion, setOpenAccordion] = useState(null);
    const [isFavorite, setIsFavorite] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [deleteId, setDeleteId] = useState(null); // State to store ID of the item to delete

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
            await axios.post(`http://localhost:5000/api/favorites/${action}`, { 
                kakaoId, nickname, id, type: "jasose"
            });
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    useEffect(() => {
        const fetchJasoseData = async () => {
            try {
                // const jasoseResponse = await axios.post('http://localhost:5000/api/jasose/get', 
                const jasoseResponse = await axios.post(`${BackendIP}/api/jasose/get`, 
                    
                    { kakaoId, nickname },
                    { withCredentials: true }
                );
                // const favoriteResponse = await axios.post('http://localhost:5000/api/favorites/get', 
                const favoriteResponse = await axios.post(`${BackendIP}/api/favorites/get`, 
                    { kakaoId, nickname }, 
                    { withCredentials: true } 
                );
    
                if (jasoseResponse && Array.isArray(jasoseResponse.data.data)) {
                    setData(jasoseResponse.data.data);
                    const favoriteIds = favoriteResponse.data.data.jasose;
                    const initialFavorites = jasoseResponse.data.data.map(item => favoriteIds.includes(item._id));
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
            // const response = await axios.post('http://localhost:5000/api/jasose/remove', { kakaoId, nickname, id });
            const response = await axios.post(`${BackendIP}/api/jasose/remove`, { kakaoId, nickname, id });
            if (response.status === 200) {
                // Remove the deleted item from the state
                setData(prevData => prevData.filter(item => item._id !== id));
                RemoveJasoseReportToast(); // Show success toast
            }
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                ErrorToast(32);
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

    // Confirm deletion and close modal
    const confirmDelete = () => {
        removeJasoseReport(deleteId);
        setIsModalOpen(false); // Close modal
    };

    return (
        <div className="jasose_box">
            <div className="accordion" id="accordionExample">
                {data.length !== 0 ? (
                    data.map((item, index) => { 
                        const date = new Date(item.time);
                        const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
                        const keyword = item.data.keyword.join(" ");
                        return (
                        <div className="accordion-item" key={index}>
                            <h2 className="accordion-header" id={`heading${index}`}>
                                <button className={`accordion-button ${openAccordion === index ? "" : "collapsed"}`} 
                                        type="button"
                                        onClick={() => toggleAccordion(index)} 
                                        aria-expanded={openAccordion === index}
                                        data-bs-target={`#collapse${index}`} 
                                        aria-controls={`collapse${index}`} >
                                    <div onClick={() => toggleFavorite(index)}>
                                        {isFavorite[index] ? (
                                            <FavoriteIcon style={{ color: 'red' }} />
                                        ) : (
                                            <FavoriteBorderIcon />
                                        )}
                                    </div>
                                    <div id="jasose_date">
                                        <p>{formattedDate}</p>
                                    </div>
                                    <div id="jasose_keyword" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        <p>{keyword}</p>
                                    </div>
                                </button>
                            </h2>
                            <div id={`collapse${index}`} className={`accordion-collapse collapse ${openAccordion === index ? "show" : ""}`} 
                                 aria-labelledby={`heading${index}`}>
                                <div className="accordion-body">
                                    입력 키워드/직무 : <strong>{keyword} / {item.data.job}</strong>
                                    <Button id="content_delbtn" variant="contained" color="error" size="small" onClick={() => handleDelBtn(item._id)}>삭제</Button>
                                    <hr />
                                    <strong>초안작성 결과</strong><br />
                                    {item.data.jasose}
                                    <hr />
                                    <strong>키워드별 평가</strong><br />
                                    {item.data.keyJasose}
                                </div>
                            </div>
                        </div>
                    )})
                ) : (
                    <div className="empty_box">
                        <img src="/images/empty.png" id="empty_img"/>
                        <p>저장된 자기소개서가 없습니다!</p>
                        <Antd_btn
                            type='primary'
                            id="createJasose_button"
                            icon={<EditOutlined />}
                            onClick={handleCreateBtn}
                            size='Default'>
                            자기소개서 작성 하러가기
                        </Antd_btn>
                    </div>
                )}
            </div>

            {/* Modal for deletion confirmation */}
            <Modal
                title="삭제 확인"
                open={isModalOpen}
                onOk={confirmDelete}  // Confirm deletion
                onCancel={() => setIsModalOpen(false)}  // Close modal
                okText="삭제"
                cancelText="취소"
            >
                <p>정말 삭제하시겠습니까?</p>
            </Modal>
        </div>
    );
};

export default Jasose;
