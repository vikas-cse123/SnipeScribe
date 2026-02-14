import express from "express"
import { getSharedNote, enableNoteSharing} from "../controller/shared.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import { verifyNoteOwnership } from "../middlewares/verifyNoteOwnership.middleware.js"
const router = express.Router()

router.get("/:shareToken",getSharedNote)
router.patch("/:noteId",authenticateUser,verifyNoteOwnership,enableNoteSharing)


export default router