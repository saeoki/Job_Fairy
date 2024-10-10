import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Button as Antd_btn }  from "antd";
import { EditOutlined } from "@ant-design/icons"

import { PromptContainer, PromptContent, Divider, PromptTitle } from "../../../CommonStyles";
import {CheckCircleTwoTone, TagsTwoTone, PushpinTwoTone} from "@ant-design/icons"

const StartIntroduction = ({infoList ,setIsInput }) => {

  const [open, setOpen] = useState(false);

  const handleStartButtonClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsInput(false)
  };

  const handleConfirm = () => {
    setOpen(false);
    setIsInput(true)
  };

  const isJobListEmpty = Object.keys(infoList.jobList).length === 0;
  const isKeywordListEmpty = Object.keys(infoList.keywordList).length === 0;
  const isAddContentListEmpty = Object.keys(infoList.addContent).length === 0;

  // 버튼 비활성화 여부를 결정하는 함수
  const shouldDisableButton = isJobListEmpty || isKeywordListEmpty 

  return (
    <div className="startintroduction-button-container">
      <Stack direction="row" spacing={2}>
        <Antd_btn
          type='primary'
          className='startintroduction-button'
          icon={<EditOutlined />}
          onClick={handleStartButtonClick}
          size='Default'
          disabled={shouldDisableButton}
        >
          자기소개서 작성 시작
        </Antd_btn>

      </Stack>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>입력한 내용을 확인해주세요.</DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
        <PromptContainer>
            <PromptTitle>
              <CheckCircleTwoTone 
                twoToneColor="#B5DAE7"
                style={{ marginRight: "6px" }}
              />
              선호 직무
            </PromptTitle>
            <PromptContent>
              {Object.values(infoList.jobList).map((job, index) => (
                  <li key={index}>{job}</li>
                ))}
            </PromptContent>
        </ PromptContainer>
        <Divider />
        <PromptContainer>
            <PromptTitle>
              <TagsTwoTone 
                twoToneColor="#FF9AA2"
                style={{ marginRight: "6px" }}
              />
              키워드
            </PromptTitle>
            <PromptContent>
              {Object.values(infoList.keywordList).map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
            </PromptContent>
        </ PromptContainer>
        <Divider />
        { isAddContentListEmpty ? <></> :
        <PromptContainer>
            <PromptTitle>
              <PushpinTwoTone 
                twoToneColor="#FF9AA2"
                style={{ marginRight: "6px" }}
              />
              추가 내용
            </PromptTitle>
            <PromptContent>
              {infoList.addContent}
            </PromptContent>
          </PromptContainer> }
            자기소개서 작성을 시작하시겠습니까?
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }} >
          <Button onClick={handleConfirm} autoFocus>네</Button>
          <Button onClick={handleClose}>아니요</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default StartIntroduction;
