import PendingUser from "../models/pendingUser.model.js";
import { formatValidationError } from "../utils/errorFormatter.js";

export const createPendingUser = async (req, res,next) => {
  try {
    
    const { name, email, password } = req.body;
    const existngPendingUser = await PendingUser.findOne({ email });
    console.log({ existngPendingUser });
    if (existngPendingUser) {
      return res.redirect("/signup/otp")
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
    next(error)
  }
};
