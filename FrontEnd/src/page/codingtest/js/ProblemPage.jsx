import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import axios from 'axios';

function ProblemPage() {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Code');
  const [results, setResults] = useState([]);
  const [output, setOutput] = useState('');

  const problemNo = 1; // 테스트할 문제 번호를 입력합니다.

  useEffect(() => {
    // 'no'를 사용하여 문제와 테스트셋을 가져옵니다.
    axios.get(`http://localhost:5000/api/problem/${problemNo}`)
      .then(response => {
        setProblem(response.data);

        // 기본 코드 틀 설정
        setCode(`function solution(arr) {
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
        `Input: ${r.input}\nResult: ${r.result}\nExpected: ${r.expectedOutput}\n${r.passed ? 'Pass' : 'Fail'}\n`
      ).join('\n'));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="left-panel">
        <h2>{problem?.title}</h2>
        <p>{problem?.description}</p>
        <h3>Test Cases</h3>
        <ul>
          {problem?.testCases.map((test, index) => (
            <li key={index}>
              <strong>Input:</strong> {test.input} <br />
              <strong>Expected Output:</strong> {test.expectedOutput}
            </li>
          ))}
        </ul>
      </div>
      <div className="right-panel">
        <h2>Code Editor</h2>
        <CodeMirror
          value={code}
          onChange={(newCode) => setCode(newCode)}
          options={{
            mode: 'javascript',
            theme: 'dracula',
            lineNumbers: true,
            indentUnit: 2,
            tabSize: 2,
          }}
        />
        <button onClick={runCode}>Run Code</button>
        <pre>Results:<br />{output}</pre>
      </div>
    </div>
  );
}

export default ProblemPage;
