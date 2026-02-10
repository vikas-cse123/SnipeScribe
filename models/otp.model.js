import mongoose from "mongoose";
const otpSchema = mongoose.Schema({
    otp:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:300
    }

})

const Otp = mongoose.model("Otp",otpSchema)
export default Otp