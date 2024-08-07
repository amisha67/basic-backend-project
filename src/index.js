// require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({
    path: './env'
});



connectDB()







/*
const app=express()
 ( async ()=>{
    try{
        await mongoose.connect('${process.env.MONGODB_URI}/${DB_NAME}')
        app.on("errror",(error)=>{
            console.log("not able to listen to db: ",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log('App is listening on port ${process.env.PORT}')
        })
    } catch(error){
        console.error("not able to connect db: ", error)
        throw err
    }
 })()
*/