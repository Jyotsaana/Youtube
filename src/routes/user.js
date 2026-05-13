import express from "express";
import {
    registerUser,
    // getUsers,
    // deleteUser
} from "../controller/user.controller.js";

import {upload} from "../middlewares/multer.js"

const router = express.Router();

router.post("/register", 
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]), 
    registerUser
);

// router.get("/", getUsers);

// router.delete("/:id", deleteUser);

export default router;