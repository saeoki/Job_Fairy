import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPEN_API_KEY,
    dangerouslyAllowBrowser: true,
});

export const CallGPT = async () => {
    console.log(">> Call GPT")
    
    const completion = await openai.chat.completions.create({
        messages: [{ 
            "role": "system",
            "content": "개발자 자기소개서 초안을 작성해주는 컨설턴트이다. 입력한 키워드에 맞춰 초안을 작성하는 업무를 담당한다.\n작성할 내용은 200자 이내로 마무리해야한다."
        }],
        model: "gpt-3.5-turbo",
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    const responseData = completion.choices[0]
    console.log(responseData.message.content);

    return responseData.message.content;
}