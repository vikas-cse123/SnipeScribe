import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  expiresAt: {
    type: Date,
    expires: 0,
  },
});

const Session =  mongoose.model("Session", sessionSchema);
export default Session;
