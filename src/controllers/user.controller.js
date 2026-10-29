import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";

import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary_upload.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req, res) => {

    // GET the user data from the request body
    //validate the user data (e.g., check for required fields, validate email format, etc.)
    //check if the user already exists in the database
    //check for images , check for avatar 
    //upload them to the cloudnary and get the image URL
    //create user object -create entry in db 
    //remove password from the response object before sending it back to the client and refresh toekn
    // check for user creation 
    //return response

    const { username , fullName, email, password } = req.body
    console.log("email:",email);


    // if(fullName == ""){
    //     throw new ApiError(400,"fullName is required")
    // }-->kind --usual

    if(
        [fullName, email, username, password].some((field) => 
        field?.trim() === ""
        )){
            throw new ApiError(400,"All field are required")
        }

        const existedUser =await User.findOne({
            $or : [{email},{username}]

        })

        if(existedUser){
            throw new ApiError(409, "User with email or username already exist")
        }
        console.log(req.files);

        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

        if(!avatarLocalPath){
            throw new ApiError(400,"Avatar file is required")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if(!avatar){
            throw new ApiError(400,"Avatar file is required")
        }
        
        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500,"something went wrong while regisetering the user ")
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, " User registered Succesfully")
        )




    //   res.status(200).json({ 
    //     message: 'registered successfully' 
    // })

});

export { registerUser };