import mongoose from "mongoose";
export const connectDB=async(req,res)=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database connected succesfully");
    }
    catch(error){
        console.log(`database not connected due to ${error}`);
    }
};