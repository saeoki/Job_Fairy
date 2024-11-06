// components/ScrapButton.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconButton } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';


function ScrapButton({ kakaoId, jobId, jobPosting }) {
  const [isScrapped, setIsScrapped] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkScrapStatus = async () => {
      if (!kakaoId) return;
      try {
        const response = await axios.get(`${process.env.REACT_APP_EC2_IP}/api/scrapped-jobs/${kakaoId}`);
        // const response = await axios.get(`http://localhost:5000/api/scrapped-jobs/${kakaoId}`);
        const scrappedJobs = response.data;
        const isAlreadyScrapped = scrappedJobs.some(job => job.jobId === jobId);
        setIsScrapped(isAlreadyScrapped);
      } catch (error) {
        console.error("Error checking scrap status:", error);
      }
    };
    checkScrapStatus();
  }, [kakaoId, jobId]);

  const handleScrapToggle = async () => {
    if (!kakaoId) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (loading) return; // 중복 요청 방지
    setLoading(true); // 로딩 플래그 올리고 들어감

    try {
      await axios.post(`${process.env.REACT_APP_EC2_IP}/api/scrapped-jobs/toggle`, {
      // await axios.post('http://localhost:5000/api/scrapped-jobs/toggle', {
        kakaoId,
        jobId,
        jobPosting
      });
      setIsScrapped(prev => !prev);

      // 단순 alert 메시지
      if (!isScrapped) {
        alert('스크랩 되었습니다.');
      } else {
        alert('스크랩이 삭제되었습니다.');
      }
    } catch (error) {
      console.error("Error toggling scrap status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <IconButton onClick={handleScrapToggle} color={isScrapped ? "primary" : "default"} disabled={loading}>
            {isScrapped ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
    </>
  );
}

export default ScrapButton;
