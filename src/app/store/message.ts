import { persist } from "zustand/middleware"
import { ChatMessage } from "../constant/constant"
import { create } from "zustand"

// const修饰符不能修饰interface
interface messageState {
    messages : ChatMessage[],
    updateMessage : ([] : ChatMessage[]) => void,
}

export const useMessageStore = create<messageState>()(
    persist<messageState>((set,get) => ({
        messages : [],
        updateMessage (messages){
            set({messages : messages});
        }
    }),
    {
        name : "message"
    })
)