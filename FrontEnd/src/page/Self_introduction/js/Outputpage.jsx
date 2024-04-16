import "../css/Output_Body.css"

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardContainer, CardTitle, Divider, ResultTitle, Self_Container } from "../../../CommonStyles";

import {LoadingOutlined, CheckCircleTwoTone} from "@ant-design/icons"

const Outputpage = ({ data, isLoading }) => {
  return (
    <div className='outPage'>
        {/* <Card variant="outlined">
            <CardContent>
            <p>어쩌고 저쩌고</p>
          <p>어쩌고 저쩌고</p>
          <p>어쩌고 저쩌고</p>
          <p>어쩌고 저쩌고</p>
            </CardContent>
        </Card> */}
        <Self_Container>
        {isLoading && (
          <>
            불러오는 중...
            <LoadingOutlined />
          </>
        )}
          <Divider />
          <CardContainer>
            <CardTitle>
              <CheckCircleTwoTone 
                twoToneColor="#FF9AA2"
                style={{ marginRight: "6px" }}
              />
              초안 작성 결과
            </CardTitle>
            <CardContent>summary</CardContent>
          </CardContainer>
        </Self_Container>
        <div>
            <button>
                저장하기
            </button>
        </div>
    </div>
    
  );
}
export default Outputpage;
