import express from "express";
import authRoutes from "./routes/auth.routes.js"
import notesRoutes from "./routes/notes.routes.js"
import bookmarksRoutes from "./routes/bookmarks.routes.js"
import sharedRoutes from "./routes/shared.route.js"
import { connectDb } from "./config/db.config.js";
import cookieParser from "cookie-parser";

await connectDb();
const app = express();
const PORT = process.env.PORT;

app.use(express.json())

app.use(cookieParser())

app.get("/", (req, res) => {
  res.end("Hello");
});

app.use("/auth", authRoutes);
app.use("/notes",notesRoutes)
app.use("/shared",sharedRoutes)
app.use("/bookmarks",bookmarksRoutes)


app.use((err,req,res,next) => {
  return res.status(500).json({success:false,message:"Something went wrong."})
})

app.listen(PORT, () => {
  console.log(`Server started`);
});
