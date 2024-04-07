async function apiCall(){
    const { Configuration, OpenAIApi } = require("openai");
    
    const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    
    const completion = await openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: "파이썬 자바",
        });
    }
    

export default apiCall