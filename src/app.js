import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.js";

const app=express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));



app.use(cookieParser());

app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))
app.use(cookieParser());

// Routes
app.use("/", userRouter);



export {app};