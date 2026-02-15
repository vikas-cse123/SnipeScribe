import express from "express"
import { createPendingUser,  loginUser, logout, requestSignupOtp, verifySignupOtp, } from "../controller/auth.controller.js"
import { authenticateUser } from "../middlewares/auth.middleware.js"
const router = express.Router()


router.post("/users/pending",createPendingUser)
router.post("/signup/otp",requestSignupOtp)
router.post("/signup/otp/verify",verifySignupOtp)
router.post("/signin",loginUser)
router.post("/logout",authenticateUser,logout)




export default router