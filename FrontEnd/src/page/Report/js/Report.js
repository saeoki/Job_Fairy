import React, {useState} from "react";

import {CallGPT} from "../../Self_introduction/js/chat"

function Report(){
    const [data,setData] = useState("")
    const [isLoading,setIsLoading] = useState(false)


    const handleClick = async () =>{
        try{
            setIsLoading(true)
            const messages = await CallGPT();
            setData(messages)
        } catch(error){

        }finally{
            setIsLoading(false)
        }
        
    }
    return(
        <>
        <h1>리포트 페이지</h1>
        <button onClick={handleClick}>GPT API CALL</button>
        <div>
            자기소개서 결과 : {data}
        </div>
        <div>
            isLoading : {isLoading ? "작성 중..." : ""}
        </div>
        </>
    )
}
export default Report;