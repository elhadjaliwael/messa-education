import express from "express";
import 'dotenv/config'
import mongoose from "mongoose";
const app = express()
import router from "./routes/coursesRoutes.js";
app.use(express.json())
app.use("/course",router)
mongoose.connect("mongodb://127.0.0.1:27017/courses").then(() =>  {
    console.log("Connected")
})
app.listen(process.env.PORT,() => {
    console.log("server running on port " + process.env.PORT)
})
