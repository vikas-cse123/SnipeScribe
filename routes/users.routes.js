import express from "express"
import { authenticateUser } from "../middlewares/auth.middleware.js"
import { getCurrentUser } from "../controller/users.controller.js"
const router = express.Router()

router.get("/me",authenticateUser,getCurrentUser)

export default router