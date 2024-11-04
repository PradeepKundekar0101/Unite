import express from 'express'
import { authUser } from '../../middleware/Authuser';
import { getMetaData } from '../../controller/user';
const router = express.Router()

router.get("/metadata",authUser,getMetaData)
router.get("/metadata/bulk",authUser,getMetaData)

export default router;