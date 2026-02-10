import mongoose from "mongoose";
import bcrypt from "bcrypt"
const pendingUserSchema = await mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,"Name is required."],
      minLength: [3,"Name must be at least 3 characters."],
      maxLength: [100,"Name cannot exceed 100 characters."],
      trim: true,
    },
    email: {
      type: String,
      required: [true,"Email is required."],
      unique: true,
      match:[/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,"Invalid email."]

    },
    password: {
      type: String,
      required: [true,"Password is required."],
      minLength: [8,"Password must be at least 8 characters."],
    },
    isVerifed: {
      type: Boolean,
      default: false,
    },
  },
  { timeStamps: true },
);

pendingUserSchema.pre("save",async function(){
  console.log("qqqqq");
  console.log(this);
  this.password = await bcrypt.hash(this.password,10)
})

const pendingUser = mongoose.model("PendingUser", pendingUserSchema);
export default pendingUser;
