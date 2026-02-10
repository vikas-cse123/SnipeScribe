import express from "express"
import { createPendingUser,  loginUser, requestSignupOtp, verifySignupOtp, } from "../controller/auth.controller.js"
const router = express.Router()


router.post("/users/pending",createPendingUser)
router.post("/signup/otp",requestSignupOtp)
router.post("/signup/otp/verify",verifySignupOtp)
router.post("/signin",loginUser)




export default router