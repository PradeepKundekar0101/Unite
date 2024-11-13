import { Request, Response } from "express";
import { UpdateMetaDataSchema } from "../types";
import { AuthenticatedRequest } from "../middleware/Authuser";
import client from "@repo/db/client";

export const getMetaData = (req:Request,res:Response)=>{
    
}  

export const updateMetaData =async(req:AuthenticatedRequest,res:Response)=>{
    const parsedData = UpdateMetaDataSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({message:"Invalid input"})
        return
    }
    try {
        const userId = req.userId
        const avatar = await client.avatar.findUnique({
            where:{
                id:parsedData.data.avatarId
            }
        })
        if(!avatar){
            res.status(400).json({
                messgae:"Avatar not found"
            })
            return
        }
        await client.user.update({
            where:{
                id:userId
            },
            data:{
                avatarId:parsedData.data.avatarId
            }
        })
        res.status(200).json({message:"Updated"})
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
}  

export const getBulkMetaData = async (req: Request, res: Response) => {
    const userIdString = (req.query.ids ?? "[]") as string;
    const userIds = (userIdString).slice(1, userIdString?.length - 1).split(",");
    console.log(userIds)
    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds
            }
        }, select: {
            avatar: true,
            id: true
        }
    })

    res.json({
        avatars: metadata.map(m => ({
            userId: m.id,
            avatarId: m.avatar?.imageUrl
        }))
    })
};


