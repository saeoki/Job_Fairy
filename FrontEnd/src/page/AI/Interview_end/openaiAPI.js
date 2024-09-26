// // import axios from 'axios';

// // const openAIRequest = async (transcription) => {
// //   try {
// //     console.log('Sending transcription to OpenAI:', transcription);
    
// //     const response = await axios.post('https://api.openai.com/v1/chat/completions', {
// //       model: 'gpt-4',
// //       messages: [
// //         {
// //           role: 'system',
// //           content: '당신은 AI 면접관입니다. 면접 응답의 명확성, 정확성, 그리고 답변의 전반적인 품질에 대해 평가를 내립니다.',
// //         },
// //         {
// //           role: 'user',
// //           content: `다음은 면접 질문에 대한 응답입니다: "${transcription}". 이 응답의 명확성, 정확성, 그리고 개선할 부분에 대해 평가해 주세요.`,
// //         },
// //       ],
// //     }, {
// //       headers: {
// //         'Authorization': `Bearer ${process.env.REACT_APP_OPEN_API_KEY}`, // 환경 변수로 설정된 API 키
// //         'Content-Type': 'application/json',
// //       },
// //     });

// //     console.log('Received response from OpenAI:', response.data);

// //     return response.data.choices[0].message.content;
// //   } catch (err) {
// //     console.error('Error in OpenAI API request:', err.response ? err.response.data : err.message);
// //     throw new Error('면접 응답 평가에 실패했습니다.');
// //   }
// // };

// // export default openAIRequest;
// import axios from 'axios';

// const openAIRequest = async (transcription) => {
//   try {
//     console.log('Transcription을 GPT API로 전송합니다:', transcription);

//     // 면접 응답 평가를 위한 프롬프트 생성
//     const prompt = `
// 당신은 AI 면접관입니다. 면접 응답의 명확성, 정확성, 그리고 답변의 전반적인 품질에 대해 평가를 내립니다.

// 다음은 면접 질문에 대한 응답입니다:
// "${transcription}"

// 이 응답의 명확성, 정확성, 그리고 개선할 부분에 대해 평가해 주세요.
//     `;

//     // 학교의 GPT API로 요청 전송
//     const response = await axios.get('https://cesrv.hknu.ac.kr/srv/gpt', {
//       params: {
//         prompt: prompt,
//       },
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
    

//     console.log('GPT API로부터 응답을 받았습니다:', response.data);

//     // 응답에서 결과 추출
//     return response.data.response;
//   } catch (err) {
//     console.error('GPT API 요청 중 에러 발생:', err.response ? err.response.data : err.message);
//     throw new Error('면접 응답 평가에 실패');
//   }
// };

// export default openAIRequest;
import axios from 'axios';

const openAIRequest = async (question, transcription) => { // 질문도 함께 전달
  try {
    console.log('질문과 응답을 GPT API로 전송합니다:', { question, transcription });

    // GPT API로 보낼 프롬프트 생성
    const prompt = `
      당신은 AI 면접관입니다. 면접 질문과 응답의 명확성, 정확성, 그리고 답변의 전반적인 품질에 대해 평가를 내립니다.

      면접 질문:
      "${question}"

      면접 응답:
      "${transcription}"

      이 응답의 명확성, 정확성, 그리고 개선할 부분에 대해 평가해 주세요.
    `;

    const response = await axios.get('https://cesrv.hknu.ac.kr/srv/gpt', {
      params: {
        prompt: prompt,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('GPT API 응답:', response.data);

    return response.data.response; // 평가 결과 반환
  } catch (err) {
    console.error('GPT API 요청 중 에러 발생:', err.response ? err.response.data : err.message);
    throw new Error('면접 응답 평가에 실패했습니다.');
  }
};

export default openAIRequest;
