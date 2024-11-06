import React, { useState, useEffect } from "react";
import { qnaList, infoList } from "./data"; 
import { HomeFilled } from '@ant-design/icons'
import { Link } from "react-router-dom";
import "../css/main.css";
import "../css/default.css";
import "../css/animation.css";
import "../css/qna.css";
import "../css/result.css"

const Itap = () => {
  const [currentStep, setCurrentStep] = useState('main');
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [select, setSelect] = useState(Array(infoList.length).fill(0)); // 결과 데이터 길이에 맞춰 select 배열 초기화
  const [isresult, setIsResult] = useState(false); // 결과 여부 상태

  const fadeOut = 'fadeOut';
  const fadeIn = 'fadeIn';

  const begin = () => {
    setCurrentStep('qna');
    setQIdx(0);
    setAnswers(qnaList[0].a);
  };

  const goResult = () => {
    setCurrentStep('result');
    setIsResult(true); // 결과 페이지로 이동할 때 결과 상태 업데이트
  };

  const handleAnswerClick = (index) => {
    const currentAnswers = qnaList[qIdx].a;
    const selectedAnswer = currentAnswers[index];
  
    // 선택한 답변의 type을 가져옵니다.
    const selectedAnswerType = selectedAnswer.type;
  
    // 선택한 답변의 score를 가져옵니다.
    const selectedAnswerScore = selectedAnswer.score;
  
    // 선택한 답변의 type과 score을 select 배열에 반영합니다.
    selectedAnswerType.forEach(type => {
      setSelect(prevSelect => {
        const newSelect = [...prevSelect];
        newSelect[type] += selectedAnswerScore;
        return newSelect;
      });
    });
  
    // 다음 질문으로 넘어갑니다.
    const nextIdx = qIdx + 1;
    if (nextIdx < qnaList.length) {
      setQIdx(nextIdx);
      setAnswers(qnaList[nextIdx].a);
    } else {
      goResult();
    }
  };

  const setResult = () => {
    const point = calResult();
  
    // 결과를 설정합니다.
    const resulttitleElement = document.querySelector('.resultTitle');
    if (resulttitleElement) {
        resulttitleElement.innerHTML = infoList[point].title;
    }
    const resultNameElement = document.querySelector('.resultname');
    if (resultNameElement) {
      resultNameElement.innerHTML = infoList[point].name;
    }
  
    const imgDiv = document.querySelector('#resultImg');
    if (imgDiv) {
      // 이미지 요소를 생성하고 설정합니다.
      const resultImg = document.createElement('img');
      const imgURL = `images/sub/image-${point}.png`; // 이미지 경로 설정
      resultImg.src = imgURL;
      resultImg.alt = infoList[point].name;
      resultImg.classList.add('img-fluid');
  
      // 기존 이미지를 지우고 새로운 이미지를 추가합니다.
      imgDiv.innerHTML = ''; // 기존 이미지 삭제
      imgDiv.appendChild(resultImg); // 새로운 이미지 추가
    }
  
    const resultDescElement = document.querySelector('.resultDesc');
    if (resultDescElement) {
      resultDescElement.innerHTML = infoList[point].desc;
    }
  };
  

  const calResult = () => {
    const max = Math.max(...select);
    return select.indexOf(max);
  };

  const restartTest = () => {
    setCurrentStep('main');
    setQIdx(0);
    setAnswers([]);
    setSelect(Array(infoList.length).fill(0));
    setIsResult(false); // 테스트 재시작 시 결과 상태 초기화
  };

  useEffect(() => {
    // 전체 페이지 배경색
    document.body.style.backgroundColor = 'skyblue'; 
    if (currentStep === 'qna') {
      const status = document.querySelector('.statusBar');
      status.style.width = `${(100 / qnaList.length) * (qIdx + 1)}%`;
    }
  }, [currentStep, qIdx]);

  useEffect(() => {
    if (isresult) {
      setResult(); // 결과 상태가 true일 때 setResult 함수 호출
    }
  }, [isresult]);

  return (
    <div className="ITAP_container">
      <div className="container" id="ITAP">
      <div className="home mt-3">
        <Link to="/" className="home_link">
          <HomeFilled className="home_img"/> 
          <span id="back">돌아가기</span>
          </Link>
      </div>
        {/* <div> */}
      {currentStep === 'main' && (
        <section
          id="main"
          className={`mx-auto mt-2 mb-5 pt-4 pb-5 px-3 ${currentStep === 'main' ? fadeIn : fadeOut}`}
        >
          <h2 className="pp"><i className="red">I</i><i className="blue">T</i><i className="green">A</i><i className="purple">P</i></h2>
          <p>IT Aptitude Profile ; IT 직무 적성검사</p>
          <div>
            <img src="/images/sub/main.png" className="mainImg"/>
          </div>
          <br />
          <p>
            나와 어울리는 IT 직무 찾기! <br />
            아래 시작하기 버튼을 눌러 시작해 주십시오.
          </p>
          <button type="button" className="btn btn-outline-danger mt-3 btn-lg" onClick={begin}>
            시작하기
          </button>
        </section>
      )}
      {currentStep === 'qna' && (
        <section
          id="qna"
          className={`status mx-auto mt-5 ${currentStep === 'qna' ? fadeIn : fadeOut}`}
        >
          <div className="statusBar">
            {/* 상태 바 내용 */}
          </div>
          <div className="qBox my-3 py-3 mx-auto">
            <p>{qnaList[qIdx].q}</p>
            <div className="answerBox">
              {answers.map((answerObj, index) => (
                <button
                  key={index}
                  className={`answerList my-3 py-3 mx-auto ${answerObj.className || fadeIn}`}
                  onClick={() => handleAnswerClick(index)}
                  disabled={answerObj.disabled}
                >
                  {answerObj.answer}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
      {currentStep === 'result' && (
        <section
          id="result"
          className={`mx-auto mt-2 mb-5 py-5 px-3 ${currentStep === 'result' ? fadeIn : fadeOut}`}
        >
        <h2 className="resultTitle"></h2>
        <div className="resultImg" id="resultImg"></div>
            <div className="resultDetails">
              <h3 className="resultname"></h3>
              <br/>
              <p className="resultDesc"></p>
            </div>
        <button type="button" className="btn btn-outline-danger mt-3 btn-lg" onClick={restartTest}>
            다시 시작하기
        </button>
        </section>
      )}
    {/* </div> */}
    </div>
    </div>
  );
};

export default Itap;
