import mongoose, {Schema} from "mongoose";
// import { User } from "./user.model";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema=new Schema(
    {
        videoFile:{
            type:String, // cloudinary
            required:true,
        },
        thumbnail:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        duration:{
            type:Number, // extracted from cloudinary
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },{
        timestamp:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video= mongoose.model("Video",videoSchema)