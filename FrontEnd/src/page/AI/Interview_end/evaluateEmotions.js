// evaluateEmotions.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPEN_API_KEY,
  dangerouslyAllowBrowser: true,
});

// 감정 점수를 평가하여 피드백을 반환하는 함수
export const generateEmotionFeedback = async (emotionScores) => {
  const messages = [
    {
      role: "system",
      // content: `당신은 감정 분석 평가관입니다. 주어진 감정 점수를 바탕으로 감정 상태에 대한 평가를 수행하고, 높은 점수를 가진 감정이 있다면 해당 감정에 대한 피드백을 제공해 주세요.`,
      content: `당신은 비대면 면접관입니다. 주어진 감정 점수를 바탕으로 면접에 임하는 지원자의 감정 상태에 대한 평가를 수행하고, 높은 점수를 가진 감정이 있다면 해당 감정이 면접에 어떤 영향이 줄 수 있는지 피드백을 제공해 주세요.`,
    },
    {
      role: "user",
      content: `감정 점수: ${JSON.stringify(
        emotionScores
      // )}\n\n각 감정 점수에 따라 응답자의 전반적인 감정 상태를 평가하고, 특히 점수가 높은 감정이 있다면 그 감정에 대해 구체적으로 설명해 주세요.`,
      )}\n\n각 감정 점수에 따라 응답자의 전반적인 감정 상태를 평가하고, 특히 점수가 높은 감정이 있다면 그 감정을 면접에 활용하는 방법에 대해 구체적으로 400자 내로 설명해 주세요.`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1,
      max_tokens: 500, // 감정 평가 토큰 수
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("감정 평가 API 호출 오류:", error);
    return "감정 평가 실패 - 다시 시도해 주세요.";
  }
};
