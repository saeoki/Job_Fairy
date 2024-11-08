import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';

import "../css/header.css"
import "../css/default.css"
import "../css/font.css"
import "../css/sidebar.css"
import "../css/main.css"

import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import { javascript } from '@codemirror/lang-javascript';
import { Theme } from "./Theme";
import Sidebar from "./Sidebar";

import { AuthContext } from "../../../context/AuthContext"
import { LoginErrorToast, LoginExpErrorToast } from "../../../components/ToastMessage";
import {jwtDecode} from 'jwt-decode';

const BackendIP = process.env.REACT_APP_EC2_IP

const CondingTest = () => {

  const token = localStorage.getItem('token');
  const { isLoggedIn } = useContext(AuthContext);

  if(!token&&!isLoggedIn){
    LoginExpErrorToast();
  }
  if(!token){
    LoginErrorToast()
  }
  const userData = jwtDecode(token);
  const { nickname } = userData;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const problemNo = queryParams.get('problemNo') || 1; // 기본값을 1로 설정

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('');
    const [results, setResults] = useState([]);
    const [output, setOutput] = useState('');
    const [isClick, setIsClick] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
    // axios.get(`http://localhost:5000/api/problem/${problemNo}`)
    axios.get(`${BackendIP}/api/problem/${problemNo}`)
      .then(response => {
        setProblem(response.data);
        setIsClick(false)

        // 기본 코드 틀 설정
        setCode(`function solution(${response.data.params}) {
  // 여기에 코드를 작성하세요
  var answer = 0;
  return answer;
}`);
      })
      .catch(error => console.error('Error fetching problem:', error));
  }, [problemNo]);

  const runCode = () => {
    try {
      const functionTemplate = `
        ${code}
        const testCases = ${JSON.stringify(problem.testCases)};
        const results = testCases.map(({ input, expectedOutput }) => {
          const parsedInput = JSON.parse(input);
          const result = solution(parsedInput);
          return {
            input,
            result,
            expectedOutput,
            passed: result.toString() === expectedOutput
          };
        });
        return results;
      `;
      
      const runFunction = new Function(functionTemplate);
      const testResults = runFunction();
      
      setResults(testResults);
      setOutput(testResults.map(r => 
        `입력값: ${r.input}\n출력값: ${r.result}\n예측값: ${r.expectedOutput}\n${r.passed ? '통과' : '실패'}\n`
      ).join('\n'));
      setIsClick(true)
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  var level = 1
  return (
    <div className={`coding_container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <header className="navbar">
        <nav className="navbar-content" style={{"--bs-breadcrumb-divider": "'>'"}} aria-label="breadcrumb">
          {/* 네비게이션 바 내용 */}
          <Link to={"/"}>
            <img className="logo" src="/logo/logo_mini.png"/>
          </Link>
          <ol className="breadcrumb">
            <li className="breadcrumb-item items"><Link to={"/"} style={{ textDecoration: "none", color: "inherit"}}>취업의 요정</Link></li>
            <li className="breadcrumb-item">코딩 테스트</li>
            <li className="breadcrumb-item" aria-current="page">레벨 {level}</li>
            <li className="breadcrumb-item">{problem?.type}</li>
          </ol>
        </nav>
      </header>

      <div className="current-problem">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="current-problem-title">{problem?.title}</div>
        <div className="header_name">
          <strong>{nickname}</strong> 님
        </div>
      </div>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
        {/* 사이드 바 내용 */}
        <div className="sidebar_content">
          <Sidebar />
        </div>
      </aside>

      <main className="main-content">
        <div className="content-grid">
          <div className="problem-description">
            {/* 문제 및 문제 예시 */}
            <h5>문제 설명</h5>
            <h6 dangerouslySetInnerHTML={{__html:problem?.description}}></h6>
            <hr />
            {(problem?.inputType.length > 0 || problem?.outputType.length > 0 ) ? 
            <h5>제한 사항</h5>
            : null}
            <ul>
            {problem?.inputType.map((inputType)=>(
              <li dangerouslySetInnerHTML={{__html:inputType}}></li>
            ))}
            {problem?.outputType.map((outputType)=>(
              <li>{outputType}</li>
            ))}
            </ul>
            
            <h5>입출력 예</h5>
            <table className="testcase_tb">
              <thead>
                <tr>
                  {problem?.params.map((param) => (
                  <th>{param}</th>
                  ))}
                  <th>result</th>
                </tr>
              </thead>
              <tbody>
                {problem?.testCases.slice(0, 3).map((testCase) => (
                  <tr>
                    {testCase.input.map((input)=>(
                      <td>
                        {input}
                      </td>
                    ))}
                    <td>
                      {testCase.expectedOutput}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br />
            <h5>입출력 예 설명</h5>
            {problem?.inputDescription.map((inputDes, index)=>(
              <div className="inputDescription">
                  입출력 예#{index+1}
                  <br />
                  {inputDes.example.map((example)=>(
                    <p>{example}</p>
                ))}
                <br />
              </div>
            ))}
          </div>

          <div className="code-editor">
            {/* CodeMirror 컴포넌트 */}
            <CodeMirror
          value={code}
          onChange={(newCode) => setCode(newCode)}
          theme={Theme}
          extensions={[javascript({ jsx: true })]}
          options={{
            mode: 'javascript',
            lineNumbers: true,
            indentUnit: 2,
            tabSize: 2,
          }}
        />
          </div>

          <div className="test-results">
          <pre>결과:<hr /></pre>
            { isClick ? output : "결과가 여기에 나타납니다."}
          </div>
        </div>
      </main>
      <footer className="code_footer">
          <button className="run-code-button" onClick={runCode}>실행하기</button>
      </footer>
    </div>
  );
}

export default CondingTest;
