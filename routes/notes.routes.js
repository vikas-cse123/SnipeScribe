import express from "express"
import { createNote, deleteNote } from "../controller/notes.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.post("/",authenticateUser,createNote)
router.delete("/:noteId",authenticateUser,deleteNote)


export default router

