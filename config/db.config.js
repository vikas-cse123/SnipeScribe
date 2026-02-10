import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("Database connected");
  } catch (err) {
    console.log(err);
    console.log("Database not connected");
    process.exit(1);
  }
};
