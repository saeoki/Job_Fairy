import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPEN_API_KEY,
  dangerouslyAllowBrowser: true,
});

// 각 질문에 대해 개별 평가를 수행하는 함수
export const evaluateInterviewIndividually = async (questionsAndAnswers) => {
  const results = [];

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

