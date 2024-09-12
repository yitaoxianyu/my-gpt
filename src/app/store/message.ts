import { persist } from "zustand/middleware"
import { ChatMessage } from "../constant/constant"
import { create } from "zustand"

// const修饰符不能修饰interface
interface messageState {
    messages : ChatMessage[],
    updateMessage: (newMessages: ChatMessage[]) => void; // 更新所有消息
    addMessage: (newMessage: ChatMessage) => void;       // 添加单条消息
}

export const useMessageStore = create<messageState>()(
    persist<messageState>((set,get) => ({
        messages : [],
        // updateMessage : (newMessages : ChatMessage[]) => set((state) => ({messages : [...state.messages, ...newMessages]}))
    
        // updateMessage :  (newMessages) => {
        //     set((state) => {
        //       const messageSet = new Set(state.messages.map(msg => msg.id));
        //       const filteredNewMessages = newMessages.filter(msg => !messageSet.has(msg.id));
        //       return { messages: [...state.messages, ...filteredNewMessages] };
        //     });
        //   },
        updateMessage: (newMessages) => set(() => ({ messages: newMessages })),
        addMessage(newMessage) {
            set((state) => ({messages :  [...state.messages,newMessage]}))
        },
    
    
    }),
    {
        name : "message"
    })
)