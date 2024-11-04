import {Request,Response,NextFunction} from 'express'
import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET||""
export const authAdmin  = (req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization
    if(!authHeader){
        res.status(403).send({message:"Unauthorized"})   
        return
    }
    const token = authHeader.split(" ")[0]
    if(!token){
        res.status(403).send({message:"Unauthorized"})   
        return
    }
    const decodedToken  = jwt.verify(token,JWT_SECRET)
    next()
}