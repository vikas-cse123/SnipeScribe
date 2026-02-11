import express from "express"
import {  createNote, deleteNote, getNotes, updateNote } from "../controller/notes.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import { verifyNoteOwnership } from "../middlewares/verifyNoteOwnership.middleware.js"
const router = express.Router()

router.post("/",authenticateUser,createNote)
router.delete("/:noteId",authenticateUser,verifyNoteOwnership,deleteNote)
router.patch("/:noteId",authenticateUser,verifyNoteOwnership,updateNote)
router.get("/",authenticateUser,getNotes)




export default router

