import express from "express"
import { createNote } from "../controller/notes.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.post("/",authenticateUser,createNote)


export default router