require('dotenv').config({path:"./.env"}); //this is used to read env file earlier so no wait 
import mongoose from "mongoose";
import { DB_NAME } from "./constants";

import connectDB from "./db/index.js";



connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("error connecting to daatabase",err)
})







/*
 import express from "express";
 const app=express();

(async()=>{
try{
 await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
   app.on("error",(error)=>{
      console.log("errro",error);
   })

   app.listen(process.env.PORT,()=>{
        console.log(`server is running on port ${process.env.PORT}`);
   })
}
   catch(err){
     console.log("Error connecting to database",err)
     throw err
   }

})
   */