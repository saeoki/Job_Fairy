import "../css/Output_Body.css"

import React, {useState, useEffect} from 'react';
import { CardContainer, CardTitle, Self_Container, CardContent } from "../../../CommonStyles";

import {LoadingOutlined, SoundTwoTone} from "@ant-design/icons"
import {Button} from "antd"

import { CallGPT } from "./chat";

const Outputpage =  ({ infoList }) => {
  const [data,setData] = useState("")
  const [isLoading,setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const isAddContentListEmpty = Object.keys(infoList.addContent).length === 0;

      const sentence = `희망 직무: ${Object.values(infoList.jobList).join(', ')}, ` +
                       `키워드 : ${Object.values(infoList.keywordList).join(', ')}, ` +
                       `추가 내용: ${isAddContentListEmpty ? "없음" : infoList.addContent}`;
      
      // console.log(sentence)
      try {
        setIsLoading(true);
        const messages = await CallGPT(sentence);
        setData(messages);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    // infoList가 변경될 때마다 API 호출
    fetchData();
  }, [infoList]);


  return (
    <div className='outPage'>
      {isLoading && (
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
            <CardContent>{data}</CardContent>
          </CardContainer>
        </Self_Container>
        <div className="save_box">
            <Button className="save_btn" type="primary">
                저장하기
            </Button>
        </div>
    </div>
    
  );
}
export default Outputpage;
