import Otp from "../models/otp.model.js";
import PendingUser from "../models/pendingUser.model.js";
import { sendEmail } from "../services/sendEmail.service.js";
import { formatValidationError } from "../utils/errorFormatter.js";
import { generateOtp } from "../utils/otpGenerator.js";
import { readFile } from "fs/promises";
export const createPendingUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existngPendingUser = await PendingUser.findOne({ email });
    console.log({ existngPendingUser });
    if (existngPendingUser) {
      return res.redirect("/signup/otp");
    }

    await PendingUser.create({ name, email, password });
    return res.status(201).json({
      success: true,
      message: "Pending user created successfully",
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
