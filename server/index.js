import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js"
import interviewRoutes from "./routes/interview.route.js"
import interviewResponseRoutes from "./routes/interviewResponse.route.js"
import resumeAnalyzeRoutes from "./routes/resumeAnalyze.route.js"
dotenv.config();
connectDB();
const app=express();
const PORT=process.env.PORT || 5000

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));


app.use("/api/auth",authRoutes)
app.use("/api/interview",interviewRoutes)
app.use("/api/interviewResponse",interviewResponseRoutes)
app.use("/api/resume",resumeAnalyzeRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
})