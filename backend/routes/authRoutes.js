import express from "express";
import {loginUser,logoutUser,registerUser,adminLogin} from "../controller/authController.js";

const authRoutes=express.Router();

authRoutes.post("/register",registerUser);
authRoutes.post("/login",loginUser);
authRoutes.post("/logout",logoutUser);
authRoutes.post("/admin/login",adminLogin);

export default authRoutes;

