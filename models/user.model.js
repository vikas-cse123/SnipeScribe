import mongoose from "mongoose";
import bcrypt from "bcrypt"
const userSchema = await mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minLength: [3, "Name must be at least 3 characters."],
      maxLength: [100, "Name cannot exceed 100 characters."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minLength: [8, "Password must be at least 8 characters."],
    },
     bookmarks:{
        type:[mongoose.Types.ObjectId],

    }
  },
  { timeStamps: true },
);


userSchema.methods.verifyPassword = async function(password){
  console.log(this,password);
  return await bcrypt.compare(password,this.password)

}
const User = mongoose.model("User", userSchema);
export default User;
