import express from 'express';
import {getProfile, loginUser, registerUser, adminLogin, updateProfile, googleLogin, changePassword } from '../controllers/userController.js';
import { authUser } from "../middleware/auth.js";

const userRouter = express.Router();

// Email/password routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Admin route
userRouter.post('/admin', adminLogin);

// Profile update route (JWT protected)
userRouter.get("/me", authUser, getProfile);  
userRouter.post('/updateProfile', authUser, updateProfile);
userRouter.post("/change-password", changePassword);


// Google OAuth login route
userRouter.post('/google-login', googleLogin);

export default userRouter;