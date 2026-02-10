import express from "express"
const app = express()
const PORT = process.env.PORT


app.get("/",(req,res) => {
    res.end("Hello")
})

app.listen(PORT,() => {
    console.log(`Server started`);
})
