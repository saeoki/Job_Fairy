import axios from 'axios';

const openAIRequest = async (transcription) => {
  try {
    console.log('Sending transcription to OpenAI:', transcription);
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '당신은 AI 면접관입니다. 면접 응답의 명확성, 정확성, 그리고 답변의 전반적인 품질에 대해 평가를 내립니다.',
        },
        {
          role: 'user',
          content: `다음은 면접 질문에 대한 응답입니다: "${transcription}". 이 응답의 명확성, 정확성, 그리고 개선할 부분에 대해 평가해 주세요.`,
        },
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPEN_API_KEY}`, // 환경 변수로 설정된 API 키
        'Content-Type': 'application/json',
      },
    });

    console.log('Received response from OpenAI:', response.data);

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('Error in OpenAI API request:', err.response ? err.response.data : err.message);
    throw new Error('면접 응답 평가에 실패했습니다.');
  }
};

export default openAIRequest;
