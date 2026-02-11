import Session from "../models/session.model.js";
import User from "../models/user.model.js";
export const authenticateUser = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const session = await Session.findById(req.cookies.sid);
    if (!session) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Authentication required. Please log in.",
        });
    }
    const user = await User.findById(session.userId);
    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Authentication required. Please log in.",
        });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};
