import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutGoingMessage, Space } from "../types";
import client from "@repo/db/client"
import crypto from "crypto"
import dotenv from "dotenv"
import jwt, { JwtPayload } from "jsonwebtoken"
dotenv.config()
export class User{
    public id:string
    private spaceId?:string
    private x:number
    private y:number
    private userId?:string
    private space?:Space
    constructor( private ws:WebSocket)
    {
        this.x = 0;
        this.y = 0;
        this.id = crypto.randomUUID()
    }
    send(payload:OutGoingMessage){
        this.ws.send(JSON.stringify(payload))
    }
    initHandlers(){
        this.ws.on("close",(data)=>{
            RoomManager.getInstance().boardCastMessage({type:"user-left",payload:{userId:this.userId}},this,this.spaceId!)
            RoomManager.getInstance().removeUser(this.spaceId!,this)
        })
        this.ws.on("message",async(data)=>{
            try {
                console.log(data.toString())
                const {type,payload}:{
                    type:string,
                    payload:any
                } = JSON.parse(data.toString())
                switch(type){
                    case "join":
                        const token  = payload.token
                        const spaceId = payload.spaceId 
                        
                        this.userId = (jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload).userId
                        if(!this.userId){
                            this.ws.close()
                            return
                        }
    
                        const spaceFeatched = await client.space.findUnique({where:{id:spaceId}})
                       
                        if(!spaceFeatched){
                            this.ws.close()
                            return;
                        }
                        this.space = {
                            height:spaceFeatched.height!,
                            width:spaceFeatched.width,
                            creatorId:spaceFeatched.createrId,
                            name:spaceFeatched.name
                        }
                        RoomManager.getInstance().addUser(spaceId,this)
                        this.spaceId = spaceId
                        this.x = Math.floor(Math.random() * this.space.width), 
                        this.y =  Math.floor(Math.random() * this.space.height!)
                        this.send({
                            type:"space-joined",
                            payload:{
                                spawn:{
                                    x: this.x,
                                    y: this.y
                                },
                                users: RoomManager.getInstance().rooms.get(spaceId)?.map((u) => ({ id: u.id })).filter((e)=>e.id!=this.id) ?? []
                            }
                        })
                        RoomManager.getInstance().boardCastMessage({type:"user-joined",payload:{
                            x:this.x,
                            y:this.y,
                            userId:this.userId!
                        }},this,this.spaceId!)
                        break;
                    case "move":
                        const {x:newX,y:newY} = payload
                        const xMove = Math.abs(newX-this.x)
                        const yMove = Math.abs(newY-this.y);
    
                        if(!(xMove==1 && yMove==0 || yMove==1 && xMove==0)){
                            this.send({
                                type:"movement-rejected",
                                payload:{
                                    x:this.x,
                                    y:this.y
                                }
                            })
                            return
                        }
    
                        if( newX > this.space?.width! || newY > this.space?.height! || newX<0 || newY <0  ){
                            this.send({
                                type:"movement-rejected",
                                payload:{
                                    x:this.x,
                                    y:this.y
                                }
                            })
                            return
                        }
                        this.x = newX
                        this.y = newY
                        RoomManager.getInstance().boardCastMessage({
                            type:"movement",
                            payload:{
                                userId:this.id,
                                x:newX,
                                y:newY
                            }
                        },this,this.spaceId!)
                        break;
                }
            } catch (error) {
                this.send({type:"error",payload:{message:"Invalid data"}})
            }
        })
        this.ws.on("error",(data)=>{
            console.log(data)
        })
        }
}