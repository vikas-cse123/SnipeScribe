import express from "express"
import { createPendingUser } from "../controller/auth.controller.js"
const router = express.Router()

router.post("/users/pending",createPendingUser)


export default router