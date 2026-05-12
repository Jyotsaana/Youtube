import {asyncHandler} from '/utility/asynchandeler.js';
import {ApiError} from '/utility/apierror.js';
import {user} from '/model/user.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerUser =  asyncHandler(async (req, res) => {
   
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
    console.log(req.body);

   if(
   [username,email,fullName,password].some(
      (field)=>field?.trim()===""
   )
 ){
   throw new ApiError(400,"All fields are required");
  }


    const existedUser = await user.findOne({
   $or:[{username},{email}]
   })
 


   if(existedUser){
    throw new ApiError(409,"user already exist with this username "+ "or email")
   }

  
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   
   const avatar = await uploadOnCloudinary(
   avatarLocalPath
);


   //avatar is required but cover image is optionnal
    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is reqiured")
    }




   //create
   const createdUser = await user.create({
   username,
   email,
   fullName,
   password,
   avatar:avatar.url,
   coverImage:coverImage?.url || ""
    })

    //Never send password to frontend.

    const newUser = await user.findById(createdUser._id).select(
   "-password -refreshToken"
     )
   

     //final response
      
    
    return res.status(201).json({
   success:true,
   message:"User registered successfully",
   data:newUser
    })

})
