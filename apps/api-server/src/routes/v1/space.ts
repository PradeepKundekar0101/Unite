import express from 'express'
import { authUser } from '../../middleware/Authuser';
import { addElementToSpace, createSpace, deleteSpace, getAllSpaces, getSpaceById, removeElementFromSpace } from '../../controller/space';
const router = express.Router()
router.post("/",authUser,createSpace)
router.delete("/element",authUser,removeElementFromSpace) 
router.delete("/:spaceId",authUser,deleteSpace)
router.get("/all",authUser,getAllSpaces)
router.get("/:spaceId",authUser,getSpaceById)
router.post("/element",authUser,addElementToSpace) 
export default router;