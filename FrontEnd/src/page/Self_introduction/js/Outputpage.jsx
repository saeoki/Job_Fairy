import "../css/Output_Body.css";
import React, { useState, useEffect } from 'react';
import { CardContainer, CardTitle, Self_Container, CardContent } from "../../../CommonStyles";
import Typography from '@mui/material/Typography';
import { LoadingOutlined, SoundTwoTone, CheckCircleTwoTone } from "@ant-design/icons";
import { Button } from "antd";
import { CallGPT, GPT_keyword } from "./chat";
import {jwtDecode} from 'jwt-decode';
import { ErrorToast, SaveSuccessToast } from "../../../components/ToastMessage"

const Outputpage = ({ infoList }) => {

  const token = localStorage.getItem('token');
  const userData = jwtDecode(token);
  const { kakaoId, nickname } = userData;

  const [data, setData] = useState("");
  const [keyData, setKeyData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoading) return;

      setIsLoading(true);
      
      try {
        const isAddContentListEmpty = Object.keys(infoList.addContent).length === 0;

        const sentence = `희망 직무: ${Object.values(infoList.jobList).join(', ')}, ` +
                         `키워드 : ${Object.values(infoList.keywordList).join(', ')}, ` +
                         `${isAddContentListEmpty ? "" : "추가 내용:" + infoList.addContent}`;
        const keySentence = `희망 직무: ${Object.values(infoList.jobList).join(', ')}, ` +
                         `키워드 : ${Object.values(infoList.keywordList).join(', ')}`;

        // 병렬 처리
        const [messages, keyMessages] = await Promise.all([
          CallGPT(sentence),
          GPT_keyword(keySentence),
        ]);

        setData(messages);
        setKeyData(keyMessages);
      } catch (error) {
        console.error('API 호출 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [infoList]);

  const handleSave = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/jasose/save', {
            method: 'POST',
            credentials: 'include', // 필요 시 추가
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              kakaoId: kakaoId,
              nickname: nickname,
              jasose: data,
              keyJasose: keyData,
              job: infoList.jobList,
              keyword: infoList.keywordList
            }),
        });
        SaveSuccessToast()
        setTimeout(() => {
          window.location.href = '/Report';
        }, 1000);
    } catch (error) {
      ErrorToast(22)
    }
}

  return (
    <div className='outPage'>
      {isLoading&& (
        <div>
          불러오는 중...
          <LoadingOutlined />
        </div>
      )}
      <Self_Container>
        <CardContainer>
          <CardTitle>
            <SoundTwoTone 
              twoToneColor="#FF9AA2"
              style={{ marginRight: "6px" }}
            />
            초안 작성 결과
          </CardTitle>
          <CardContent>
            {data.split('\n\n').map((paragraph, index) => (
              <Typography key={index} variant="body1" paragraph>
                {paragraph.split('\n').map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Typography>
            ))}
          </CardContent>
        </CardContainer>
        <CardContainer>
          <CardTitle>
            <CheckCircleTwoTone 
              twoToneColor="#01DF01"
              style={{ marginRight: "6px" }}
            />
            키워드 별 평가
          </CardTitle>
          <CardContent>
            {keyData.split('\n\n').map((paragraph, index) => (
              <Typography key={index} variant="body1" paragraph>
                {paragraph.split('\n').map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Typography>
            ))}
          </CardContent>
        </CardContainer>
      </Self_Container>
      <div className="save_box">
        <Button className="save_btn" type="primary" disabled={!(data&&keyData)} onClick={handleSave}>
          저장하기
        </Button>
      </div>
    </div>
  );
}

export default Outputpage;
