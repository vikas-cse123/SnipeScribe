import express from "express"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import { verifyNoteOwnership } from "../middlewares/verifyNoteOwnership.middleware.js"
import { addBookmark, getBookmarks, removeBookmark } from "../controller/bookmarks.controller.js"
const router = express.Router()

router.post("/:noteId",authenticateUser,verifyNoteOwnership,addBookmark)
router.patch("/:noteId",authenticateUser,verifyNoteOwnership,removeBookmark)
router.get("/",authenticateUser,getBookmarks)


export default router