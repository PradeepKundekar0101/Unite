import { Request, Response } from "express";
import client from "@repo/db/client"
import jwt from 'jsonwebtoken'
import { SignInSchema, SignUpSchema } from "../types";
import {hash,compare} from '../utils/bcrypt'
const JWT_SECRET = process.env.JWT_SECRET

export const createAccount = async (req:Request,res:Response)=>{
    const parsedData = SignUpSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({
            message:"Invalid inputs"
        })
        return
    }
    try {
        const hashedPassword = await hash(parsedData.data.password)
        const createUser = await client.user.create({data:{
            username:parsedData.data.username,
            password:hashedPassword,
            role: parsedData.data.type
        }})
        res.status(200).json({userId:createUser.id})
    } catch (error) {
        res.status(400).json({message:"User name already taken"})
    }

}
export const signIn = async (req: Request, res: Response) => {
    const parsedData = SignInSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({
            message:"Input invalidation failed"
        })
        return
    }

    try {
        const user = await client.user.findFirst({
            where: {
                username:parsedData.data.username
            }
        });
        if (!user) {
            res.status(403).json({ message: "User not found" });
            return;
        }
        const isPasswordCorrect = await compare(parsedData.data.password,user.password)
        if(!isPasswordCorrect){
            res.status(403).json({message:"Incorrect password"})
            return
        }
        const token = jwt.sign({
            role:user.role,
            userId:user.id
        },JWT_SECRET!,{
            expiresIn:"7D"
        })
        res.status(200).json({ message: "Sign-in successful", token });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during sign-in", error });
    }
};