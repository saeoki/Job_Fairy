/*
    ChatGPT API 연결하는 파일
    유저의 입력을 받아와 자기소개서 초안을 작성하는 함수
*/


import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPEN_API_KEY,
    dangerouslyAllowBrowser: true,
});

export const CallGPT = async (prompt) => {
    const messages = [{
        "role": "system",
        "content": "개발자 자기소개서 초안을 작성해주는 컨설턴트이다. \
        입력한 키워드를 포함한 자기소개서 초안을 작성하는 업무를 담당한다. \
        작성할 내용은 1000자 이내로 마무리해야한다. \
        인삿말은 하지말고 자기소개서 바로 작성해야한다.\
        실제 자기소개서처럼 직무에 가정 적합하게 작성해야한다.\
        읽기 편하게 띄어쓰기와 줄바꿈을 적절히 사용한다."
    },
    {
        "role": "user",
        "content": `"${prompt}"`,
    }];

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: messages,
            temperature: 1,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        // 최신 OpenAI API 응답 구조에 맞게 수정
        const responseContent = completion.choices[0].message.content;
        return responseContent;
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw error; // 오류를 호출한 곳으로 전달
    }
};

export const GPT_keyword = async (prompt) => {
    const keyMessages = [{
        "role": "system",
        "content": "입력한 키워드를 직무에 알맞은 키워드인지 판단해주는 개발자 컨설턴트이다. \
        해당 키워드가 해당 직무에 적합한지 평가해주고 추천 키워드와 강조할 키워드를 알려주고 제시해주는 업무를 담당한다. \
        작성할 내용은 1000자 이내로 마무리해야한다. \
        인삿말은 하지말고 바로 작성해야한다.\
        읽기 편하게 띄어쓰기와 줄바꿈을 적절히 사용한다."
    },
    {
        "role": "user",
        "content": `"${prompt}"`,
    }];

    try {
        const keyCompletion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: keyMessages,
            temperature: 1,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        // 최신 OpenAI API 응답 구조에 맞게 수정
        const responseContent = keyCompletion.choices[0].message.content;
        return responseContent;
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw error; // 오류를 호출한 곳으로 전달
    }
};
