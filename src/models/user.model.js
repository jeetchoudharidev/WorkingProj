
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"; 
import bcrypt from "bcryptjs"; 

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    coverImage: {
      type: String,
      default: null,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
      default: null,
    },

    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
     this.password =  await bcrypt.hash(this.password, 10)  // password should contain await 
     next()
})

userSchema.methods.isPasswordCorrect = async function(passwod){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);









// import mongoose, {Schema} from 'mongoose';

// const userSchema = new Schema(
//     {
//     id: { type: String, required: true, unique: true },
//     username: { type: String, required: true,unique: true,
//     lowercase: true, trim: true,index: true },
//     email: { type: String, required: true, unique: true }, 
//     fullName: { type: String, required: true,trim: true },
//     avatar: { type: String,//cloudnary image url
//         required:true,
//          default: null },
//     coverImage: { type: String, default: null },
//     password: { type: String, required:[true, "Password is required"] },
//     refreshToken: { type: String, default: null },
//     {
//         timestamps: true
//     },
//     // createdAt: { type: Date, default: Date.now },
//     // updatedAt: { type: Date, default: Date.now },
//     watchHistory: [
//         {
//             type: Schema.Types.ObjectId,
//             reference: 'Video',    
//     }]
// }
// )