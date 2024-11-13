import client from "@repo/db/client";
import {  Response,Request } from "express";

export const getAllElements = async(req:Request,res:Response)=>{
    try {
        const elements = await client.element.findMany()
        res.status(200).json({elements})
    } catch (error) {
        res.status(400).json({message:"Error"})
    }
}