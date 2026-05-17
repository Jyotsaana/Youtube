import express from "express";
import {
    registerUser,
    loginUser,
    
   logoutUser  
} from "../controller/user.controller.js";

import {verifyJWT} from "../middlewares/auth.js"

import {upload} from "../middlewares/multer.js"

const router = express.Router();


  

router.post("/register", 
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]), 
    registerUser
);


router.route("/login").post(
  
   loginUser
     )


router.route("/logout").post(
   verifyJWT,
   logoutUser
     )

// router.get("/", getUsers);

// router.delete("/:id", deleteUser);

export default router;