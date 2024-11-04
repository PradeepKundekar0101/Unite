import express from 'express'
import { authUser } from '../../middleware/Authuser';
import { getBulkMetaData, getMetaData, updateMetaData } from '../../controller/user';
const router = express.Router()

router.get("/metadata",authUser,getMetaData)
router.post("/metadata",authUser,updateMetaData)
router.get("/metadata/bulk",authUser,getBulkMetaData)

export default router;