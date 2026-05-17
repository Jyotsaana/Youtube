import asyncHandler from '../utility/asynchandeler.js';
import ApiError from '../utility/apierror.js';
import ApiResponse from '../utility/apiresponse.js';

import { User } from '../models/user.js';
import { uploadOnCloudinary } from "../utility/cloudinary.js";
// import {isPasswordCorrect} from "../models/user.js"


  const generateAccessAndRefreshTokens=async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accesstoken=user.generateAccessToken()
        const refreshtoken=user.generateRefreshToken()

           user.refreshToken=refreshtoken
           await user.save({validateBeforeSave:false})
     

           return {accesstoken,refreshtoken}
           
    }

    catch(error){
        throw new ApiError(500,"something went wrong while generating tokens")
    }
  }


 const registerUser =  asyncHandler(async (req, res) => {
   
     //get user details from frontend
     //validation -not empty
    //check if user laready exists:username ,email
    //check for avatar and cover image
    //upload them to cloudinary-avatar check
    //create user object-create entry in db
    //remove password and refresh token field from response for sending to frontend
    //check for user creation
    //return res

    const {username,email,fullName,password}=req.body;
//     console.log(req.body);
    

//      console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_SECRET); 


   if(
   [username,email,fullName,password].some(
      (field)=>field?.trim()===""
   )
 ){
   throw new ApiError(400,"All fields are required");
  }

    

    const existedUser = await User.findOne({
   $or:[{username},{email}]
   })
 


   if(existedUser){
    throw new ApiError(409,"user already exist with this username "+ "or email")
   }

  
   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

   if(!avatarLocalPath){
       throw new ApiError(400,"avatar is required")
   }

   



 let coverImage;


   // Uncomment this after setting up Cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   
   if(coverImageLocalPath){
      
       coverImage = await uploadOnCloudinary(coverImageLocalPath);
   }




   //create
   const createdUser = await User.create({
   username,
   email,
   fullName,
   password,
   avatar:avatar.url,
   coverImage:coverImage?.url || ""
    })

    //Never send password to frontend.

    const newUser = await User.findById(createdUser._id).select(
   "-password -refreshToken"
     )
   

     //final response
      
    
    return res.status(201).json({
   success:true,
   message:"User registered successfully",
   data:newUser
    })

})



 const loginUser =asyncHandler(async(req,res)=>{
      //req body->data
      // username or email
      // find the user 
      // no user find req send back
      // password check 
      //access and refresh tokens
      //send cookies
      

      const{email,username,password}=req.body;

      if(!username && !email){
        throw new ApiError(400,"email or username is required");
      }


      const user=await User.findOne({
         $or:[{username,email}]
      })



      if(!user){
        throw new ApiError(404,"user does not exist");
      }

      const isPasswordvalid=await user.isPasswordCorrect(password)

      if(!isPasswordvalid){
        throw new ApiError(401,"Invalid user credentials");
      }



     const {accesstoken,refreshtoken}=await generateAccessAndRefreshTokens(user._id)
    

   const loggedInUser= await User.findById(user._id).select("-password -refreshToken")


   //cookies
     const options={
      httpOnly:true,
      secure:true
     }


     return res
     .status(200)
     .cookie("accesstoken",accesstoken,options)
     .cookie("refreshtoken",refreshtoken,options)
     .json(
       
      new ApiResponse(
        200,
        {
       user:loggedInUser,accesstoken,refreshtoken
        }
        ,
        "user logged in succesfully"
      )

     )

})


const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json({
        message: "User logged out"
    })
})



 const changeCurrentPassword = asyncHandler(async (req, res) => {

    // get old and new password from body
    const { oldPassword, newPassword } = req.body;

    // check if fields are empty
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "All fields are required");
    }

    // get logged in user
    const user = await User.findById(req.user?._id);

    // check old password is correct or not
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    // set new password
    user.password = newPassword;

    // save user
    // validateBeforeSave false because only password changing
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password changed successfully"
            )
        );
});


const getCurrentUser = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        );
});


const updateAccountDetails = asyncHandler(async (req, res) => {

    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Account details updated successfully"
            )
        )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
}

