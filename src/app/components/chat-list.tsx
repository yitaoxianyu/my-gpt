import { useNavigate } from "react-router-dom";
import DeleteIcon from "../icons/delete.svg";
import style from "./home.module.scss";
import { Mask, Path } from "../constant/constant";
import { useSessionStore } from "../store/session";
import { useEffect } from "react";
import { updateLayoutConfig } from "mermaid/dist/diagrams/c4/c4Db.js";
import { Session } from "../constant/constant";

export function ChatItem(props : 
    {   
        id : string,
        onClick : () => void,
        onDelete : () => void,
        title : string,
        count : number,
        date : string,
        Mask : Mask,
        index : number,
    }
)
{ 
    return (
        <div
          className={style["chat-item"]}
          onClick={props.onClick}
          title={props.title}
        >
          <>
              <div className={style["chat-item-title"]}>{props.title}</div>
              <div className={style["chat-item-info"]}>
                <div className={style["chat-item-count"]}>
                  {props.count}
                </div>
                <div className={style["chat-item-date"]}>{props.date}</div>
              </div>
            </>
    
          <div
            className={style["chat-item-delete"]}
            onClickCapture={(e) => {
              props.onDelete?.();
              e.preventDefault();
              //
              //如果子组件触发onclick函数，最终会自动冒泡到父组件，并且调用父组件的onclick
              e.stopPropagation();
            }}
          >
            <DeleteIcon />
          </div>
        </div>
    
      );
     
}





export default function ChatList(){
    const navigate = useNavigate();

    const sessions = useSessionStore((state) => state.sessions);
    const loadSession = useSessionStore((state) => state.loadSession);
    const deleteSession = useSessionStore((state) => state.deleteSession);
    const updateCurrentIndex = useSessionStore((state) => state.updateCurrentIndex)
    useEffect(() => {
      loadSession();
    },[])
//空数组表示组件在第一次被挂载时，调用

    return(
    <div className={style["chat-list"]}>
        {sessions.map((item,i) => (
            <ChatItem
            title={item.topic}
            date={(localStorage.getItem(item.id))??"unknow time"}
            count={item.messages.length}
            key={item.id}
            id={item.id}
            index={i}
            // selected={i === selectedIndex}//该值为一个boolean属性
            onClick={() => {
              const emptySessions : Session[] = [];
              if(sessions == emptySessions ) return ;
              navigate(Path.Chat);
              updateCurrentIndex(i);
              //这里可以正确设置index
            }}
            onDelete={async () => {
              if (sessions.length == 1){
                alert("无法清空列表！");
                return ;
              }
              deleteSession(i);
            }}
            Mask={item.mask}
          />
        ))
        
        }
    </div>
    )
}