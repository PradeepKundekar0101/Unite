import { Request, Response } from "express";
import { AddElementToSpaceSchema, CreateSpaceSchema, RemoveSpaceElementSchema } from "../types";
import client from "@repo/db/client";
import { AuthenticatedRequest } from "../middleware/Authuser";

export const createSpace = async (req: AuthenticatedRequest, res: Response) => {
  const parsedData = CreateSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid data",
    });
    return;
  }
  try {
 
    if (!parsedData.data.mapId) {
        if(!parsedData.data.dimensions){
            res.status(400).json({message:"Invalid input"})
            return
        }
        
        const height = Number(parsedData.data.dimensions.split("x")[0]);
        const width = Number(parsedData.data.dimensions.split("x")[1]);
        const newSpace = await client.space.create({
            data: {
            name: parsedData.data.name,
            height,
            width,
            createrId: req.userId!,
            },
        });
        res.status(200).json({
            message: "Space created",
            spaceId: newSpace.id,
        });
      return;
    }

    const existingMap = await client.map.findUnique({
      where: {
        id: parsedData.data.mapId,
      },
      select: {
        elements: true,
        height:true,
        width:true
      },
    });
    if (!existingMap) {
        res.status(400).json({ message: "Map does not exist" });
        return;
    }
    
    
    const newSpace = await client.space.create({
      data: {
        spaceElements: {
          create: existingMap.elements.map((e) => {
            return { x: e.x!, y: e.y!, elementId: e.elementId! };
          }),
        },
        name: parsedData.data.name,
        height:existingMap.height,
        width:existingMap.width,
        createrId: req.userId!,
        mapId: parsedData.data.mapId,
      },
    });
    res.status(200).json({ spaceId: newSpace.id });
  } catch (error) {
    res.status(400).json({
      message: "Space name already taken",
    });
  }
};
export const deleteSpace = async (req: AuthenticatedRequest, res: Response) => {
    const spaceId = req.params.spaceId
    if(!spaceId)
    {
        res.status(400).json({message:"No spaceId provided"})
        return
    }
    try {
        const space = await client.space.findFirst({
            where:{
                id:spaceId
            }
        })
        if(!space){
            res.status(400).json({message:"Space not found"})
            return;
        }
        if(space.createrId!=req.userId){
            res.status(403).json({message:"Unauthorized"})
            return
        }
        await client.spaceElements.deleteMany({
            where:{
                spaceId
            }
        })
        await client.space.delete({where:{id:spaceId}})
        res.status(200).json({message:"Delete"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error"})
    }
};
export const getAllSpaces =async (req: AuthenticatedRequest, res: Response) => {
        try {
            const spaces = await client.space.findMany({
                where:{
                    createrId:req.userId
                }
            })
            res.status(200).json({
                spaces
            })
        } catch (error) {
            res.status(500).json({
                message:"Error"
            })
        }
};
export const getSpaceById = async(req: Request, res: Response) => {
    try {
        const spaceId = req.params.spaceId;
        if(!spaceId){
            res.status(400).json({
                message:'Spaceid not provided'
            })
            return
        }
        const space = await client.space.findUnique({where:{
            id:spaceId
        }})
        if(!space)
        {
            res.status(400).json({
                data:"Space not found"
            })
            return
        }
        const spaceElements = await client.spaceElements.findMany({
            where:{spaceId},
            include:{element:true}
        })

        res.status(200).json({
            "dimensions":`${space.height}x${space.width}`,
            "elements": spaceElements.map((e)=>{return {
                id:e.id,
                element:{
                    id:e.element.id,
                    imageUrl: e.element.imageUrl,
                    static:e.element.static,
                    height:e.element.height,
                    width:e.element.width
                }

            }})
        })
    } catch (error) {
        res.status(500).json({
            data:"Error"
        })
        
    }
};
export const addElementToSpace =async (req: Request, res: Response) => {
    const parsedData = AddElementToSpaceSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({message:"Invalid data"})
        return
    }
    try {
        const space = await client.space.findFirst({where:{id:parsedData.data?.spaceId}})
        if(!space){
            res.status(400).json({message:"Space not found"})
            return
        }
        if((parsedData.data.x>space.width!) || (parsedData.data.y>space.height!)){
            res.status(400).json({message:"Space not found"})
            return
        }
        const spaceElement = await client.spaceElements.create({
            data:{
                spaceId:parsedData.data?.spaceId!,
                x:parsedData.data?.x!,
                y:parsedData.data?.y!,
                elementId:parsedData.data?.elementId!,
            }
        })
        res.status(200).json({spaceElementId:spaceElement.id})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error"})
        
    }
};
export const removeElementFromSpace = async(req: Request, res: Response) => {
    const parsedData = RemoveSpaceElementSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({message:"Invalid data"})
        return
    }
    try {
        const spaceElement = await client.spaceElements.findUnique({where:{id:parsedData.data.id}})
        if(!spaceElement){
            res.status(400).json({message:"Space not found"})
            return
        }
       
        await client.spaceElements.delete({
            where:{
                id: parsedData.data?.id
            }
        })
        res.status(200).json({
            message:"Deleted"
        })
    }catch(e){
        res.status(500).json({message:"Error"})
    }
};
