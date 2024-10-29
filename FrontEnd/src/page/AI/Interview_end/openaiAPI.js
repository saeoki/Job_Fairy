import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPEN_API_KEY,
  dangerouslyAllowBrowser: true,
});

// 각 질문에 대해 개별 평가를 수행하는 함수
export const evaluateInterviewIndividually = async (questionsAndAnswers) => {
  // const results = [];
  const results = [
    {
      question: "자신의 강점에 대해 설명해 주세요.",
      answer: "저는 문제 해결 능력이 뛰어나며 팀과 협력하여 어려운 문제도 빠르게 해결하는 것을 강점으로 생각합니다.",
      evaluation: `
      명확성: 5점 - 응답이 명확하고 구체적입니다.
      정확성: 4점 - 응답의 내용은 일반적으로 정확하나, 구체적인 사례를 언급하면 더 좋습니다.
      개선점: 응답에 구체적인 예시나 경험을 덧붙여 강점을 뒷받침할 수 있습니다. 예를 들어, 실제로 문제 해결 능력을 발휘했던 상황을 설명하면 더욱 설득력 있는 답변이 됩니다.
      `
    },
    {
      question: "최근의 성공적인 프로젝트 경험을 말씀해 주세요.",
      answer: "최근에 진행했던 프로젝트에서 목표를 초과 달성하며 고객 만족도를 높일 수 있었습니다.",
      evaluation: `
      명확성: 4점 - 응답이 이해하기 쉬우나 다소 일반적입니다.
      정확성: 5점 - 응답의 내용이 사실적이고 정확한 표현입니다.
      개선점: 더 구체적인 목표 달성 수치나 프로젝트 성과를 제시하면 응답이 더 구체적이고 효과적일 수 있습니다.
      `
    },
    {
      question: "어려운 상황에서 어떻게 대처하셨나요?",
      answer: "저는 침착함을 유지하면서 문제를 단계적으로 해결해 나가는 방식을 선호합니다.",
      evaluation: `
      명확성: 5점 - 응답이 명확하고 일관적입니다.
      정확성: 4점 - 상황에 따라 대처 방식이 다를 수 있어 약간의 추가 설명이 필요합니다.
      개선점: 어려운 상황에 대한 구체적인 예시를 제시하면 응답이 더 생동감 있게 들릴 수 있습니다. 예를 들어, 최근 어려웠던 상황과 구체적인 대처 방법을 설명해 보세요.
      `
    }
  ];
  
  for (const { question, answer } of questionsAndAnswers) {
    const messages = [{
      "role": "system",
      "content": `당신은 AI 면접 평가관입니다. 각 질문과 응답의 명확성, 정확성, 그리고 답변의 전반적인 품질에 대해 평가해 주세요. 각 항목에 대해 1점에서 5점까지의 점수를 부여하고, 개선할 부분이 있다면 구체적으로 설명해 주세요.`
    }, {
      "role": "user",
      "content": `면접 질문: "${question}"\n\n면접 응답: "${answer}"\n\n이 응답의 명확성, 정확성, 그리고 개선할 부분에 대해 평가해 주세요.`,
    }];

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 1,
        max_tokens: 500,  // 각 질문에 대한 개별 평가 토큰 수
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      // 결과를 각각의 질문에 매핑하여 저장
      results.push({
        question: question,
        answer: answer,
        evaluation: completion.choices[0].message.content.trim(),
      });
    } catch (error) {
      console.error('API 호출 오류:', error);
      results.push({
        question: question,
        answer: answer,
        evaluation: "평가 실패 - 다시 시도해 주세요.",
      });
    }
  }

  return results;
};

