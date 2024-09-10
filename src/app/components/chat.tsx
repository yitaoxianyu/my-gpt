import { Fragment, useEffect, useRef, useState } from "react";
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
import { useMessageStore } from "../store/message";


export default function Chat() {
    const [userInput,setUserInput] = useState("");

    const navigate = useNavigate();
    const inputRef= useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    
    //拿到loadSession方法
    const sessions = useSessionStore((state) => state.sessions);
    const currentIndex = useSessionStore((state) => state.currentIndex);
    const loadSession = useSessionStore((state) => state.loadSession);
    const [messages,updateMessage] = useMessageStore((state) => [state.messages,state.updateMessage]);


    //此处有一个bug,sessions列表不能为空。 
    const currentSession = sessions[currentIndex];

    //这样会当组件被挂载是，这个函数才会被调用。
    // 当你刷新页面时，React 会重新挂载 Chat 组件。在这个过程中，会发生以下几件事情：

    // 组件初次挂载：在组件初次挂载时，React 会执行 useEffect 钩子函数。如果依赖项数组为空 []，useEffect 只会在初次挂载时执行一次。

    // 数据加载：在组件初次挂载时，currentSession 可能还没有从服务器获取到数据。因此，currentSession 在初始状态可能是 undefined 或者一个空对象，这意味着 currentSession.messages 可能是 undefined 或一个空数组。

    // 异步数据更新：之后，你的应用程序可能会发起异步请求（例如从服务器获取数据）来更新 currentSession，但由于 useEffect 的依赖项为空，它不会在 currentSession 发生变化时重新执行。
    useEffect(() => {
        //更新之前，先进行排序。
        sortByDate(currentSession.messages);
        updateMessage(currentSession.messages);
    },[currentSession])

    //由早到晚进行排序
    function sortByDate(messages : ChatMessage[]){
        messages.sort(function(a, b) {
            return b.date < a.date ? 1 : -1
        })
    }


    function onInput (text : string) {
        setUserInput(text);
    }
    

    function doSubmit(text : string) {
        //加一个判断是否为全空
        if(text.trim() === "") return ;

        //应当组成一个，message对象然后提交到后端
        const options : Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          };
            
        const nowTime = new Date().toLocaleString('zh-CN', options);
        
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

        updateMessage(messages.concat([message]));


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
                        {`共${messages.length}条对话`}                        
                    </div>
                </div>
        </div >

        {/* 为对话框部分 */}
        <div className={style["chat-body"]} ref={scrollRef}>
        {/* 注意这里必须要给面具赋值，如果想创建空白对话则赋值为0 */}
        {messages.map((item,index) =>{
             const isUser = (item.role === "user");
             const isContext = item.mask_id ?? 0;
            return (               
                <Fragment key={item.id}>
                    <div className={isUser ? style["chat-message-user"] : style["chat-message"]}>
                         <div className = {style["chat-message-container"]}> 
                            <div className = {style["chat-message-header"]}>
                                <div className = {style["chat-message-avatar"]}>
                                    
                                    {isUser ?
                                        (<Avatar avatar ="1f603"/>)
                                     :
                                        (<MaskAvatar  avatar = {currentSession.mask.avatar}/>)
                                    }                                        
                                    </div>
                                    <div className={style["chat-message-item"]} ref={scrollRef}>
                                        <Markdown
                                        // 处理对话
                                            content={item.content}
                                            // loading = {! isUser}
                                            defaultShow = {index >= messages.length - 6}
                                        />

                                    
                                    
                                    



                                    </div>
                                    <div className={style["chat-message-action-date"]}>
                                    {/* 这里用来判断是否是提示词 */}
                                    {!! isContext
                                        ? "预设提示词"
                                        : item.date}
                                    </div>

                                   
                                    
                                    
                                
                            </div>
                        </div>
                    </div>
            </Fragment>
            )
        })
        }
        </div>



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