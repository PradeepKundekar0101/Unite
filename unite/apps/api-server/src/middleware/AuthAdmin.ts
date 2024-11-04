import {Request,Response,NextFunction} from 'express'
import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET||""
export const authAdmin  = (req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization
    if(!authHeader)
        return res.status(403).send({message:"Unauthorized"})   
    const token = authHeader.split(" ")[0]
    if(!token)
        return res.status(403).send({message:"Unauthorized"})   
    const decodedToken  = jwt.verify(token,JWT_SECRET)
    
}