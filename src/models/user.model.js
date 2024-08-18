import mongoose, {Schema} from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            lowercase:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            lowercase:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String, //cloudinary url we will use
            required:true,
        },
        coverImage:{
            type:String,// cloudinary url
        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            requied:[true,'Password is required']
        },
        refreshToken:{
            type:String,
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next() 
})

// custom msg design kr rhe
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(password){
    return JsonWebTokenError.sign(
        {
            _id: this._id,
            email:this.email,
            userName:this.username,
            fullName:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(password){
    return JsonWebTokenError.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User= mongoose.model("User", userSchema)