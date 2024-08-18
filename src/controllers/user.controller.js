import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req,res)=>{
    // get all the user details from frontend
    // validation-not empty
    // check if user already exists or not - via username or email
    // check for images and avatar- as necessary
    // upload them to cloudianry-avatar-that multer have uploaded or not
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullname,email,username,password} = req.body
    console.log("email: ",email);

    // validation
    if(
        [fullname,email,username,password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    // 3
    const existedUser= User.findOne({
        $or: [{email},{username}]
    })
    
    if(existedUser){
        throw new ApiError(409,"already existed name or email")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is required")
    }


    // on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if(!avatar){
        throw new ApiError(400, "avatar file is required")
    }


    // user object create
    const user= await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    

    // return res
    if(!createduser){
        throw new ApiError(500,"something went wrong while creating user")
    }

    //
    return res.status(201).json(
        new ApiResponse(200,createduser,"user registered successfully")
    )

})


export {registerUser}




/* i was checking
const registerUser= asyncHandler((req,res)=>{
    res.status(200).json({
        message:"All ok"
    })
})
*/