import { create } from "zustand"
import { Session } from "../constant/constant";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

interface sessionState  {
    sessions : Session[],
    loadSession : () => void,
    currentIndex : number,
    selectedIndex : number,
}

function createEmptySession() : Session{
    return {
        id: nanoid(),
        messages: [],
        lastUpdateTime: Date().toString(),
        // mask: createEmptyMask(),
    };
}

export const useSessionStore = create<sessionState>(
    persist((set,get) => ({
        sessions : [createEnptySession()],
        currentIndex : 0,
        selectedIndex : 0,
        loadSession() {
            
        },
        }),
    {"name" : "chat-session"}
    )
)