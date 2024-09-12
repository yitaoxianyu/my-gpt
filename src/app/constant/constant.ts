export enum Path{
    Home = "/",
    Mask = "/mask",
    Chat = "/chat",
}

//interface用来描述类更加合适
export interface ChatMessage  {
    id : string,
    content : string,
    date : string,
    role? : string,
    mask_id ?: number,
}

export interface Mask  {
    id : string,
    avatar : string,
    name : string,
    context :  ChatMessage[],
}


export interface Session {
    id : string,
    topic : string,
    messages  : ChatMessage[],
    mask : Mask,   
}