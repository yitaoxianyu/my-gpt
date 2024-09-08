import { Fragment, useRef, useState } from "react";
import style from "./chat.module.scss"
import { useSessionStore } from "../store/session";
import SendWhiteIcon from "../icons/send-white.svg"
import IconButton from "./button";
import { ChatMessage } from "../constant/constant";
import { nanoid } from "nanoid"



export default function Chat() {
    const [userInput,setUserInput] = useState("");

    const inputRef= useRef<HTMLTextAreaElement>(null);

    const sessions = useSessionStore((state) => state.sessions);
    const currentIndex = useSessionStore((state) => state.currentIndex);
    const currentSession = sessions[currentIndex];


    function onInput (text : string) {
        setUserInput(text);
    }
    
    function doSubmit(text : string) {
        //加一个判断是否为全空
        if(text.trim() === "") return ;

        //应当组成一个，message对象然后提交到后端
        const nowTime = new Date().toLocaleDateString('zh-CN');
        
        const message : ChatMessage = {
            id : nanoid().toString(),
            content : text,
            date : nowTime,
            role : "user",
        }
        //封装成消息对象
        const URL = "http://localhost:8080/session/message/add?";

        fetch(URL + `sessionId=${encodeURIComponent(sessions[currentIndex].id)}`,
        {   method : "post",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify(message),
        }
    )
        .then((res) => {console.log(res)})
        .catch((error) => {console.error(error)})

        setUserInput("");//发送之后清空
    }

    return (
    <div className={style.chat} key={currentSession.id}>
        <div className={`window-header`} data-tauri-drag-region>

                <div className={`window-header-title ${style["chat-body-title"]}`}>
                    <div
                        className={`window-header-main-title ${style["chat-body-main-title"]}`}
                    >
                        {currentSession.topic}
                    </div>
                    <div className="window-header-sub-title">
                        {`共${currentSession.messages.length}条对话`}                        
                    </div>
                </div>
        </div >

        <div className={style["chat-input-panel"]}>
                <label
                    className={`${style["chat-input-panel-inner"]}`}
                    htmlFor="chat-input"
                >
                    <textarea
                        id="chat-input"
                        ref={inputRef} //inputRef绑定到该组件
                        className={style["chat-input"]}
                        onInput={(e) => onInput(e.currentTarget.value)} //当聊天框内容增加或者删除时会触发
                        value={userInput} //将value的值作为一个变量
                        // onKeyDown={onInputKeyDown} 实现按上键找回上次输入的内容，暂时不实现
                        // onFocus={scrollToBottom}
                        // onClick={scrollToBottom}
                        // rows={inputRows}
                        autoFocus={true} //自动聚焦
                        style={{
                            fontSize: 14,
                        }}
                    />
                    <IconButton
                        icon={<SendWhiteIcon />}
                        text="发送"
                        className={style["chat-input-send"]}
                        type="primary"
                        onClick={() => doSubmit(userInput)}
                    />
                </label>
            </div>
    </div>        
    )
}