/*
    ChatGPT API 연결하는 파일
    유저의 입력을 받아와 자기소개서 초안을 작성하는 함수
*/


import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPEN_API_KEY,
    dangerouslyAllowBrowser: true,
});

export const CallGPT = async ({prompt}) => {
    // console.log(">> Call GPT")

    const messages = [{
        "role": "system",
        "content": "개발자 자기소개서 초안을 작성해주는 컨설턴트이다. 입력한 키워드를 포함한 자기소개서 초안을 작성하는 업무를 담당한다. 작성할 내용은 250자 이내로 마무리해야한다. 인삿말은 하지말고 자기소개서 바로 작성해야한다."
    },
    {
        "role": "user",
        "content": `"${prompt}"`,
    }]
    
    const completion = await openai.chat.completions.create({
        messages,
        model: "gpt-3.5-turbo",
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    const responseData = completion.choices[0]
    // console.log(responseData.message.content);

    return responseData.message.content;
}