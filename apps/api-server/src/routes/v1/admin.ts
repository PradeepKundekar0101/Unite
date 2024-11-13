import express from 'express'
import { authAdmin } from '../../middleware/AuthAdmin';
import { createAvatar, createElement, createMap, updateElement } from '../../controller/admin';

const router = express.Router()

router.post("/element",authAdmin,createElement)
router.put("/element/:elementId",authAdmin,updateElement)
router.post("/avatar",authAdmin,createAvatar)
router.post("/map",authAdmin,createMap)

export default router;