export interface OutGoingMessage{
    type:"space-joined" | "error" | "movement-rejected" | "movement" | "user-joined" | "user-left"
    payload:any
}
export interface Space{
    height:number,
    width:number,
    name:string,
    creatorId:string,
}