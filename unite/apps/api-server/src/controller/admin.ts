import { Request, Response } from "express";
import { createAvatarSchema, CreateElementSchema, createMapSchema, updateElementSchema } from "../types";
import client from "@repo/db/client";

export const createElement = async (req:Request,res:Response)=>{
    const parsedData = CreateElementSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({message:"Invalid input"})
        return
    }
    try {
        const newElement = await client.element.create({
            data:{
                imageUrl: parsedData.data.imageUrl,
                static: parsedData.data.static,
                height: parsedData.data.height,
                width:parsedData.data.width
            }
        })
        res.status(200).json({
            id:newElement.id
        })
    } catch (error) {
        res.status(500).json({message:"Error"})
    }
}
export const updateElement = async (req:Request,res:Response)=>{
    const parsedData = updateElementSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({message:"Invalid input"})
        return
    }
    try {
        const elementId = req.params.elementId
        const element = await client.element.findUnique({where:{id:elementId}})
        if(!element){
            res.status(400).json({message:"ELement not found"})
            return 
        }
        
        await client.element.update({
            where:{
                id:elementId
            },data:{
                imageUrl:parsedData.data.imageUrl
            }
        })
        res.status(200).json({message:"Updated"})
    } catch (error) {
        res.status(500).json({
            message:"Error"
        })
    }
}
export const createAvatar = async(req:Request,res:Response)=>{
    const parsedData = createAvatarSchema.safeParse(req.body)
    console.log(parsedData)
    if(!parsedData.success){
        res.status(400).json({message:"Invalid input"})
        return
    }
    try {
        const avatar = await client.avatar.findFirst({
            where:{
                name:parsedData.data.name
            }
        })
        // if(avatar){
        //     res.status(400).json({message:"Avatar name already exits"})
        //     return
        // }
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
export const createMap = async(req:Request,res:Response)=>{
    const parsedData = createMapSchema.safeParse(req.body)
    console.log(parsedData.data)    
    if(!parsedData.success){
        res.status(400).json({message:"invalid data"})
        return 
    }
    try {

        console.log("Elements to create:", parsedData.data.defaultElements)
        
        const elementsData = parsedData.data.defaultElements.map((e)=>{
            console.log("Processing element:", e)
            return {
                x: e.x!,
                y: e.y!,
                elementId: e.elementId!
            }
        })

        console.log("Formatted elements data:", elementsData)

        const map = await client.map.create({
            data:{
                name: parsedData.data.name,
                elements: {
                    create: elementsData
                },
                height: Number(parsedData.data.dimensions.split("x")[0]),
                width: Number(parsedData.data.dimensions.split("x")[1]),
            },
            // Add include to see the created elements in the response
            include: {
                elements: true
            }
        })
        
        console.log("Created map with elements:", map)
        res.status(200).json({id: map.id})
    } catch (error) {
        console.error("Error creating map:", error)
        res.status(500).json({message: "Error"})
    }
}