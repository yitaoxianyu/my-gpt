import { Mask } from "../constant/constant"
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom"
import {Path} from "../constant/constant"
import { create } from "zustand";
import { persist } from "zustand/middleware";




export function createEmptyMask () : Mask {
    return {
        id : nanoid(),
        avatar : "gpt-bot",
        name : "新面具",
        context : [],
    }
}



interface MaskState {
    masks : Mask[],
    loadMask : () => void,
}

export const useMaskStore = create<MaskState>()(
   persist<MaskState> ((set,get) => ({
        masks : [createEmptyMask()],
        loadMask() {
            const URL = "http://localhost:8080/mask/all";
            fetch(URL,{method : "get"}).then((res) => {return res.json()}).then(
                (masks : Mask[]) => {
                set(
                    {masks : masks}
                );
            }
            ).catch((e) => {console.log(e)});
        },
   }
   )
   ,
   {name : "mask"}
)
);
  
    