import express from "express";
import authRoutes from "./routes/auth.routes.js"
import { connectDb } from "./config/db.config.js";

await connectDb();
const app = express();
const PORT = process.env.PORT;

app.use(express.json())

app.get("/", (req, res) => {
  res.end("Hello");
});

app.use("/auth", authRoutes);


app.use((err,req,res,next) => {

  return res.status(500).json({success:false,message:"Something went wrong."})
})

app.listen(PORT, () => {
  console.log(`Server started`);
});
