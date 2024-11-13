import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import v1Router from './routes/v1'

dotenv.config()
const app = express()
app.use(cors({
    origin:"*"
}))
app.use(express.json())
app.use("/api/v1",v1Router)
const PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log("API SERVER Running at PORT: "+PORT)
})