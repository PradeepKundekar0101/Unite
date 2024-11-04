import express from "express"
import spaceRouter from './space'
import adminRouter from './admin'
import userRouter from './user'
const router = express.Router()
import { Request, Response } from "express";


router.post("/signin",(req:Request,res:Response)=>{
    res.send("Hello")
})
router.post("/signup",(req:Request,res:Response)=>{
    res.send("Hello")
})
router.get("/avatars",(req:Request,res:Response)=>{
    res.send("Hello")
})
router.get("/element",(req:Request,res:Response)=>{
    res.send("Hello")
})
router.use("/user",userRouter)
router.use("/space",spaceRouter)
router.use("/admin",adminRouter)

export default router;