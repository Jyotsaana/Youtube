import asyncHandler from '../utility/asynchandeler.js';
import ApiError from '../utility/apierror.js';
import { User } from '../models/user.js';
import { uploadOnCloudinary } from "../utility/cloudinary.js";

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

})
