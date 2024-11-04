import { Request, Response } from "express";
import client from "@repo/db/client"
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET
export const createAccount = async (req:Request,res:Response)=>{
    const {username,password,type}:{
        username:string,
        password:string,
        type: string
    } = req.body
    if(!username || !password || !type){
        res.status(400).send({message:"All fields required"})
        return
    }
    if(type!=="Admin" &&  type!=="User"){
        res.status(400).send({message:"Invalid type"})
        return 

    }
    const existingUser = await client.user.findFirst({
        where:{
            username
        }
    })
    if(existingUser){
        res.status(400).send({message:"User name already taken"})
        return 
    }
    const createUser = await client.user.create({data:{
        username,
        password,
        role:type
    }})
    res.status(200).send({userId:createUser.id})
}
export const signIn = async (req: Request, res: Response) => {
    const { username, password }: { username: string, password: string } = req.body;
    if (!username || !password) {
        res.status(400).send({ message: "Username and password are required" });
        return;
    }

    try {
        const user = await client.user.findFirst({
            where: {
                username
            }
        });
        if (!user) {
            res.status(400).send({ message: "User not found" });
            return;
        }
        if (user.password !== password) {
            res.status(400).send({ message: "Incorrect password" });
            return;
        }
        const token = jwt.sign({
            role:user.role,
            id:user.id
        },JWT_SECRET!)
        res.status(200).send({ message: "Sign-in successful", userId: user.id });
    } catch (error) {
        res.status(500).send({ message: "An error occurred during sign-in", error });
    }
};