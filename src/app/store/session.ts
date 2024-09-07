import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { Session } from "../constant/constant";
import { nanoid } from "nanoid";
import { createEmptyMask } from "./mask";
import { Mask } from "../constant/constant";


// 定义会话状态的接口
interface SessionState {
  sessions: Session[];
  loadSession: () => void;
  deleteSession : (index : number) => void;
  currentIndex: number;
  selectedIndex: number;
}

// 定义会话的默认状态
function createEmptySession(): Session {
  return {
    id: nanoid(),
    messages: [],
    lastUpdateTime: Date().toString(),
    topic: "新的对话",
    mask : createEmptyMask(),  // 如果需要 mask，可以定义
  };
}

// 使用 Zustand 创建存储，并添加持久化选项
export const useSessionStore = create<SessionState>()(
  persist<SessionState>(
    (set, get) => ({
      sessions: [createEmptySession()],
      currentIndex: 0,
      selectedIndex: 0,
      loadSession() {
        fetch("http://localhost:8080/session/all")
          .then((res) => {
            return res.json();
          })
          .then((sessions: []) => {
            if (sessions.length > 0) {
              set((state) => ({ sessions: sessions }));
            }
          })
          .catch((e) => {
            console.error(e);
          });
      },
      deleteSession(index) {
        // 拿到sessions数组。
        const deletedSession = get().sessions.at(index); //查看index索引元素是否存在
        if(! deletedSession) return ; //没有则退出
        //请求后端删除  
        const URL = "http://localhost:8080/session/delete?sessionId=" + deletedSession.id
        fetch(URL , {method : "post"}).then(() =>{
          const newSession = get().sessions.slice();
          newSession.splice(index,1);
          set({sessions : newSession})
        }).catch((e) => console.log(e));
      },
    }),
    {
      name: "chat-session", // 存储的键名
    } 
  )
);
