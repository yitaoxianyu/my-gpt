import { Mask } from "../constant/constant"
import { nanoid } from "nanoid";

function createEmptyMask () : Mask {
    return {
        id : nanoid(),
        avatar : "gpt-bot",

    }
}