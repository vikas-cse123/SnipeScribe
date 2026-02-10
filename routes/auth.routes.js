import express from "express"
import { createPendingUser } from "../controller/auth.controller.js"
import { sendEmail } from "../services/sendEmail.service.js"
const router = express.Router()


router.post("/users/pending",createPendingUser)




export default router