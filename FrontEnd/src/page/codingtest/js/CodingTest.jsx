import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

import "../css/header.css"
import "../css/default.css"
import "../css/font.css"

import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import { javascript } from '@codemirror/lang-javascript';
import { Theme } from "./Theme";

const CondingTest = ({problemNo=1}) => {
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
    axios.get(`http://localhost:5000/api/problem/${problemNo}`)
      .then(response => {
        setProblem(response.data);
        setIsClick(false)

        // 기본 코드 틀 설정
        setCode(`function solution(nums) {
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
      </div>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
        {/* 사이드 바 내용 */}
      </aside>

      <main className="main-content">
        <div className="headerbar">
          <h5>문제 설명</h5>
        </div>

        <div className="content-grid">
          <div className="problem-description">
            {/* 문제 및 문제 예시 */}
            <h5>{problem?.description}</h5>
            <hr />
            <h6>입출력 예</h6>
            <table className="testcase_tb">
              <thead>
                <tr>
                  <th>nums</th>
                  <th>result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{problem?.testCases[0].input}</td>
                  <td>{problem?.testCases[0].expectedOutput}</td>
                </tr>
                <tr>
                  <td>{problem?.testCases[1].input}</td>
                  <td>{problem?.testCases[1].expectedOutput}</td>
                </tr>
                <tr>
                  <td>{problem?.testCases[2].input}</td>
                  <td>{problem?.testCases[2].expectedOutput}</td>
                </tr>
              </tbody>
            </table>
            <br />
            <h6>입출력 예 설명</h6>

          </div>

          <div className="code-editor">
            {/* CodeMirror 컴포넌트 */}
            <CodeMirror
          value={code}
          onChange={(newCode) => setCode(newCode)}
          // theme={copilot}
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
          {/* {problem?.testCases.map((test, index) => (
            <li key={index}>
              <strong>Input:</strong> {test.input} <br />
              <strong>Expected Output:</strong> {test.expectedOutput}
            </li>
          ))} */}
          </div>
        </div>
      </main>
      <footer className="footer">
          <button className="run-code-button" onClick={runCode}>실행하기</button>
      </footer>
    </div>
  );
}

export default CondingTest;
