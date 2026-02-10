import Otp from "../models/otp.model.js";
import PendingUser from "../models/pendingUser.model.js";
import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../services/sendEmail.service.js";
import { formatValidationError } from "../utils/errorFormatter.js";
import { generateOtp } from "../utils/otpGenerator.js";
import { readFile } from "fs/promises";

export const createPendingUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existngPendingUser = await PendingUser.findOne({ email });
    if (existngPendingUser) {
      return res.redirect("/signup/otp");
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    await PendingUser.create({ name, email, password });
    return res.status(201).json({
      success: true,
      message: "Signup started. Please verify your email to continue.",
      data: { email },
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      const errors = formatValidationError(error);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    next(error);
  }
};

export const requestSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return res
        .status(200)
        .json({ success: true, message: "Otp sent successfully" });
    }
    await Otp.deleteOne({ email });
    const otp = generateOtp();
    await Otp.create({ email, otp });
    let otpEmailHtml = await readFile(
      "./templates/emails/otpEmail.html",
      "utf-8",
    );
    otpEmailHtml = otpEmailHtml
      .replaceAll("{{APP_NAME}}", process.env.APP_NAME)
      .replaceAll("{{OTP_CODE}}", otp)
      .replaceAll("{{YEAR}}", new Date().getFullYear());

    await sendEmail(email, otpEmailHtml);
    res.status(200).json({ success: true, message: "Otp sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "Unable to send verification code.Please try again later.",
    });
  }
};

export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp: clientOtp } = req.body;
    const pendingUser = await PendingUser.findOne({ email }).lean();
    if (!pendingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }
    const otp = await Otp.findOne({ email });
    if (!otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }
    const isOtpCorrect = await otp.verifyOtp(clientOtp);
    if (!isOtpCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }
    await User.create(pendingUser);
    await PendingUser.deleteOne({ email });
    await otp.deleteOne();

    return res.status(201).json({
      success: true,
      message: "Your email has been verified and your account is now active.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "Unable to verify verification code.Please try again later.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, isRememberMe } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }
    const isPasswordCorrect = await user.verifyPassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password.." });
    }
    const sessionTime = isRememberMe
      ? 1000 * 60 * 60 * 24 * 30
      : 1000 * 60 * 60 * 24 * 7;

    const session = await Session.create({
      userId: user._id,
      expiresAt: new Date(Date.now() + sessionTime),
    });
    res.cookie("sid", session.id, {
      httpOnly: true,
      maxAge: sessionTime,
    });
    res.status(200).json({ success: true, message: "Logged in successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "Login failed. Please try again later.",
    });
  }
};
