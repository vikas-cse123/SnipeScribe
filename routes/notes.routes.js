import express from "express"
import {  createNote,emptyTrash,getNoteById,getNotes,  getPinnedNotes,  getTrashedNotes,  moveNoteToTrash, permanentlyDeleteNote,     restoreNote,  togglePinNote,  updateNote } from "../controller/notes.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import { verifyNoteOwnership } from "../middlewares/verifyNoteOwnership.middleware.js"
const router = express.Router()

router.get("/",authenticateUser,getNotes)
router.post("/",authenticateUser,createNote)
router.delete("/trash",authenticateUser,emptyTrash)
router.get("/trash",authenticateUser,getTrashedNotes)
router.patch("/:noteId/pin",authenticateUser,verifyNoteOwnership,togglePinNote)
router.get("/pin",authenticateUser,getPinnedNotes)
router.get("/:noteId",authenticateUser,verifyNoteOwnership,getNoteById)
router.patch("/:noteId",authenticateUser,verifyNoteOwnership,updateNote)
router.patch("/:noteId/trash",authenticateUser,verifyNoteOwnership,moveNoteToTrash)
router.delete("/:noteId",authenticateUser,verifyNoteOwnership,permanentlyDeleteNote)
router.patch("/:noteId/restore",authenticateUser,verifyNoteOwnership,restoreNote)





export default router

