import { Request, Response } from "express";
import { createAvatarSchema } from "../types";
import client from "@repo/db/client";

export const createElement = (req:Request,res:Response)=>{

}
export const updateElement = (req:Request,res:Response)=>{

}
export const createAvatar = async(req:Request,res:Response)=>{
    const parsedData = createAvatarSchema.safeParse(req.body)
    if(!parsedData.success){
        console.log("first")
        res.status(400).json({message:"Invalid input"})
        return
    }
    try {
        const avatar = await client.avatar.findFirst({
            where:{
                name:parsedData.data.name
            }
        })
        if(avatar){
            res.status(400).json({message:"Avatar name already exits"})
            return
        }
        const createAvatar = await client.avatar.create({
            data:{
                imageUrl:parsedData.data.imageUrl,
                name:parsedData.data.name
            }
        })
        res.status(200).json({
            avatarId:createAvatar.id
        })
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}
export const createMap = (req:Request,res:Response)=>{

}