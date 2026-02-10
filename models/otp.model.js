import mongoose from "mongoose";
import bcrypt from "bcrypt";
const otpSchema = mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

otpSchema.pre("save", async function () {
  this.otp = await bcrypt.hash(this.otp, 10);
});

otpSchema.methods.verifyOtp = async function (otp) {
  return await bcrypt.compare(otp, this.otp);
};
const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
