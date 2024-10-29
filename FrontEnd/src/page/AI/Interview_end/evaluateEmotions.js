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
      content: `당신은 면접 진행관 역할을 맡고 있습니다. 응답자의 감정 점수를 분석하여, 면접 과정에서 나타난 태도와 감정 표현에 대한 피드백을 제공해 주세요. 특히 높은 점수를 보이는 감정이 있다면, 그 감정이 면접에 미친 긍정적 혹은 부정적 영향을 구체적으로 평가해 주세요.`,
    },
    {
      role: "user",
      content: `응답자의 감정 점수: ${JSON.stringify(
        emotionScores
      )}\n\n각 감정 점수를 바탕으로 응답자의 전반적인 면접 태도를 평가하고, 주된 감정이 면접 과정에 미친 영향에 대해 상세하게 설명해 주세요.`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1,
      max_tokens: 700,
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
