import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import v1Router from './routes/v1'
import client from "@repo/db/client"
dotenv.config()
const app = express()
app.use(cors({
    origin:"*"
}))
console.log(client)
app.use(express.json())
app.use(v1Router)
const PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log("API SERVER Running at PORT: "+PORT)
})