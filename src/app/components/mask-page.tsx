import style from "./mask-page.module.scss"
import { useMaskStore } from "../store/mask"
import { Mask } from "../constant/constant"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Path } from "../constant/constant"
import {Avatar, EmojiAvatar} from "./others/emoji"



export function MaskAvatar(props : {avatar : string}){
     return (
        <Avatar avatar= {props.avatar} />
    )
}


export function MaskItem(props : {
    mask : Mask,
        onClick : () => void,
    }
)
{
    return (
    <div className={style["mask"]} onClick={props.onClick}>
      <MaskAvatar
       avatar={props.mask.avatar}
      />
      <div className={style["mask-name"] + " one-line"}>{props.mask.name}</div>
    </div>
    )   
}


//映射成面具页面

export default function MaskPage() {
    //当点击新建对话时，MaskPage组件会重新加载，同时向服务器请求所有对话。
    
    const navigate = useNavigate();
    
    
    const [masks,loadMask] = useMaskStore(
        (state) => [state.masks,state.loadMask]
    );
    //获取面具
    useEffect(() => {
        loadMask();
    }, []);

    function startChat() {
        navigate(Path.Chat)
    }
    return (
    <div className={style["new-chat"]}>
        <div className={style["mask-cards"]}>
            <div className={style["mask-card"]}>
            <EmojiAvatar avatar="1f606" size={24} />
            </div>

            <div className={style["mask-card"]}>
            <EmojiAvatar avatar="1f916" size={24} />
            </div>

            <div className={style["mask-card"]}>
            <EmojiAvatar avatar="1f479" size={24} />
            </div>

        </div>

            <div className={style["title"]}>{"挑选一个面具"}</div>
            <div className={style["sub-title"]}>{"现在开始，与面具背后的灵魂思维碰撞"}</div>
            <div className={style["mask-container"]}>
                {masks.map((mask, index) => (
                <MaskItem
                    key={index}
                    mask={mask}
                    onClick={startChat}
                />
                ))}
            </div>
        </div>
    )
}