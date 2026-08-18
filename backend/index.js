import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app=express();
//connecting database
connectDB()
//middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/auth",authRoutes);


const PORT=process.env.PORT || 4000
app.get("/",(req,res)=>{
    res.send("hello welcome to server");
});
app.listen(PORT,()=>{
    console.log(`server is rurnning at port ${PORT}`);
});
