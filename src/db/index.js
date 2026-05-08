import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

const connectDB=async()=>{
    try{
       const conncetionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    }

    catch(err){
        console.log("Error connecting to database",err)
        process.exit(1);
    }
}


export default connectDB;