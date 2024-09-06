import { DEFAULT_MAX_VERSION } from "tls"
import style from "./home.module.scss"
import ChatGptIcon from "../icons/chatgpt.svg"
import { useNavigate } from "react-router-dom"
import { Path } from "../constant/constant"
import ChatList from "./chat-list"

export default function Sidebar() {
    const navigate = useNavigate();

    function handleNewChat(){
        navigate(Path.Mask);
    }

    return (
        <div className={style.sidebar}>
             {/*整个sidebar样式  */}
            <div className={style["sidebar-header"]}> 
                <div className={style["sidebar-title"]}>
                    artificial intelligence
                </div>
                <div className={style["sidebar-sub-title"]}>
                    use chatgpt to build your assistant
                </div>
                <div  className={style["sidebar-logo"] + " no-dark"}>
                    <ChatGptIcon />
                </div>
            </div>
            <button className={style["new-chat-button"]} onClick={handleNewChat}>
                新建对话
            </button>
            <div className={style["sidebar-body"]}>
                <ChatList />
            </div>
            {/* 用来放ChatList,由ChatSession来映射 */}
        </div>  
    )
}