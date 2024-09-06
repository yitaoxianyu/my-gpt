export enum Path{
    Home = "/",
    Mask = "/mask",
    Chat = "/chat",
}

export type ChatMessage = {
    content : string,
    date : string,
}

export type Mask = {
    id : string,
    avatar : string,
    name : string,
    context :  ChatMessage[],
    onClick : () => void,
}


export type Session = {
    id : string,
    topic : string,
    lastUpdateTime : string,
    messages : ChatMessage[],
    // Mask : Mask,   
}