import express from "express"
import { createPendingUser, requestSignupOtp, } from "../controller/auth.controller.js"
const router = express.Router()


router.post("/users/pending",createPendingUser)
router.post("/signup/otp",requestSignupOtp)




export default router