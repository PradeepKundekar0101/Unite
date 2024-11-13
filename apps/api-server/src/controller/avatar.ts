import client from "@repo/db/client";
import { Request, Response } from "express";

export const getAllAvatars =async (req:Request,res:Response)=>{
    try {
        const result = await client.avatar.findMany()

        res.status(200).json({avatars:result})
    } catch (error) {
        res.status(500).json({message:"Error"})
    }
}
