import asyncHandler from '../utility/asynchandeler.js'
import jwt from "jsonwebtoken"
import {User} from '../models/user.js'
import ApiError from '../utility/apierror.js'





export const verifyJWT = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")

    if (!token) {
        throw new Error("Unauthorized")
    }

    const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id).select
    ("-password -refreshToken")


    if(!user){
        throw new ApiError(401,"Invalid access token")
    }

    req.user = user

    next()

})