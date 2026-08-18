import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config()

//generating the token and sending to browser(cookie)payload(info of customer)
const generateToken=(res,payload)=>{
    const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"});
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:24*60*60*1000
    });
    return token;

}

export const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.json({
                message:"please fill all fields",
                success:false
            });
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.json({
                message:"user already registered",
                success:false
            });
        }
        const hashedPasswords=await bcrypt.hash(password,10);
        const user=await User.create({name,email,password:hashedPasswords});
        return res.json({
            message:"user registered succesfully",
            success:true
        });
    }
    catch(error){
        console.log(error.message);
        return res.json({
            message:"internal server error",
            success:false
        });
    }
}


//login user
export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.json({
                message:"please enter mandatory fields",
                success:false
            });
        }
        const user=await User.findOne({email});
        if(!user){
            return res.json({
                message:"user not found register first",
                success:false
            });
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({
                message:"invalid credintails",
                success:false
            });
        }
        generateToken(res,{
            id:user._id,
            role:user.isAdmin? "admin":"user"
        });
        return res.json({
            message:"success login",
            success:true,
            user:{
                name:user.name,
                email:user.email
            }
        });
    }
    catch(error){
        console.log(error.message);
        return res.json({
            message:"internal server error",
            success:false
        });
    }

};


//logout user
export const logoutUser=async(req,res)=>{
    try{
        res.clearCookie("token");
        return res.json({
            message:"user logout successful",
            success:true
        });
    }
    catch(error){
        console.log(error.message);
        return res.json({
            message:"internal server error",
            success:false
        })
    }
}


//adminlogin
export const adminLogin=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.json({message:"please enter all fields",success:false});
        }
        const adminEmail=process.env.ADMIN_EMAIL
        const adminPassword=process.env.ADMIN_PASSWORD
        if(email!==adminEmail || password!==adminPassword){
            return res.json({
                message:"invalid credintials",
                success:false
            });
        }
        const token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"strict",
            maxAge:24*60*60*1000
        })
        return res.json({
            message:"admin login success",
            success:true
        });
    }
    catch(error){
        console.log(error.message);
        return res.json({
            message:"internal server error",
            success:false
        });
    }
}

//