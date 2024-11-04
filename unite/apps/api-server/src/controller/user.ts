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
    try {
        // Parse `ids` from query string, ensuring it's an array
        const ids = typeof req.query.ids === 'string' 
            ? JSON.parse(req.query.ids)  
            : req.query.ids;             

        if (!Array.isArray(ids)) {
            res.status(400).send({ message: "Invalid format for ids. Expected an array." });
            return;
        }

        // Use `Promise.all` to handle multiple asynchronous calls
        const data = await Promise.all(
            ids.map(async (id) => {
                const response = await client.avatar.findFirst({ where: { id } });
                if (!response) {
                    // Instead of stopping execution, handle missing IDs gracefully
                    return { userId: id, error: `User with ID ${id} not found` };
                }
                return { userId: id, imageUrl: response.imageUrl };
            })
        );

        res.status(200).send({ avatars: data });
        
    } catch (error) {
        console.error("Error processing IDs:", error);
        res.status(500).send({ message: "Server error while processing IDs", error });
    }
};