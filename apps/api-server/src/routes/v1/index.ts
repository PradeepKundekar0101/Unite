import express from "express"
import spaceRouter from './space'
import adminRouter from './admin'
import userRouter from './user'
import { createAccount, signIn } from "../../controller/auth"
import { getAllAvatars } from "../../controller/avatar"
import { getAllElements } from "../../controller/element"

const router = express.Router()
router.get("/health",(req,res)=>{
    res.send("API Server is running")
})
router.post("/signup",createAccount)
router.post("/signin",signIn)
router.get("/avatars",getAllAvatars)
router.get("/elements",getAllElements)
router.use("/user",userRouter)
router.use("/space",spaceRouter)
router.use("/admin",adminRouter)

export default router;