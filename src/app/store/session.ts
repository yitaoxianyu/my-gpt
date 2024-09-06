import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { Session } from "../constant/constant";
import { nanoid } from "nanoid";

// 定义会话状态的接口
interface SessionState {
  sessions: Session[];
  loadSession: () => void;
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
    // mask: createEmptyMask() // 如果需要 mask，可以定义
  };
}

// 使用 Zustand 创建存储，并添加持久化选项
export const useSessionStore = create<SessionState>()(
  persist<SessionState>(
    (set, get) => ({
      sessions: [createEmptySession()],
      currentIndex: 0,
      loadSession() {
        fetch(process.env.NEXT_PUBLIC_API_URL + "/session/all")
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
      selectedIndex: 0,
    }),
    {
      name: "chat-session", // 存储的键名
      getStorage: () => localStorage, // 你可以定义使用的存储，默认为 localStorage
    } as PersistOptions<SessionState>
  )
);
