import { Fragment, useRef, useState } from "react";
import style from "./chat.module.scss"
import { useSessionStore } from "../store/session";
import SendWhiteIcon from "../icons/send-white.svg"
import IconButton from "./button";
import { ChatMessage } from "../constant/constant";
import { nanoid } from "nanoid"
import { MaskAvatar } from "./mask-page";
import { Avatar } from "./others/emoji";
import { Navigate, useNavigate } from "react-router-dom";
import { Path } from "../constant/constant";
import { error } from "console";
import { Markdown } from "./others/markdown";



export default function Chat() {
    const [userInput,setUserInput] = useState("");

    const navigate = useNavigate();
    const inputRef= useRef<HTMLTextAreaElement>(null);

    //拿到loadSession方法
    const sessions = useSessionStore((state) => state.sessions);
    const currentIndex = useSessionStore((state) => state.currentIndex);


    //此处有一个bug,sessions列表不能为空。 
    const currentSession = sessions[currentIndex];

    const loadSession = useSessionStore((state) => state.loadSession)

    const messages : ChatMessage[]  = currentSession.messages;


    function onInput (text : string) {
        setUserInput(text);
    }
    
    function doSubmit(text : string) {
        //加一个判断是否为全空
        if(text.trim() === "") return ;

        //应当组成一个，message对象然后提交到后端
        const nowTime = new Date().toLocaleDateString('zh-CN');
        
        const message : ChatMessage = {
            //id前缀，区分属于哪个对话。
            id : `${currentSession.topic}-${nanoid().toString()}`,
            content : text,
            date : nowTime,
            role : "user",
        }
        //封装成消息对象
        const URL = "http://localhost:8080/session/message/add?";

        fetch(URL + `sessionId=${encodeURIComponent(currentSession.id)}`,
        {   method : "post",
            headers: { "Content-Type": "application/json" },
            //放到请求体中，后端要在对应参数加入相应的注解。
            body : JSON.stringify(message),
        }
    )
        .then((res) => {console.log(res)})
        .catch((error) => {console.error(error)})

        setUserInput("");//发送之后清空

        loadSession();

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

        {/* 为对话框部分 */}

        {messages.map((item,index) =>{
             const isUser = item.role === "user";

            return (               
                <Fragment key={item.id}>
                    <div className={isUser ? style["chat-message-user"] : style["chat-message"]}>
                         <div className = {style["chat-message-container"]}> 
                            <div className = {style["chat-message-header"]}>
                                <div className = {style["chat-message-avatar"]}>
                                    <div>
                                    {isUser ?
                                        (<Avatar avatar ="1f603"/>)
                                     :
                                        (<MaskAvatar  avatar = {currentSession.mask.avatar}/>)
                                    }                                        
                                    </div>
                                    <div className={style["chat-message-item"]}>
                                        
                                    </div>
                                    
                                    
                                </div>
                            </div>
                         </div>
                    </div>
                </Fragment>
            )
        })
        }







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