import { Mask } from "../constant/constant"
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom"
import {Path} from "../constant/constant"



export function createEmptyMask () : Mask {
    return {
        id : nanoid(),
        avatar : "gpt-bot",
        name : "新面具",
        context : [],
    }
}