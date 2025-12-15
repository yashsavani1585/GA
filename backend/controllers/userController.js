// userController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Email/Password Login
 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User doesn't exist" });

    // Prevent login if Google-auth user tries email login
    if (user.authProvider === "google") {
      return res.json({ success: false, message: "Please sign in using Google." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = createToken(user._id);
    res.json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Email/Password Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) return res.json({ success: false, message: "User already exists" });

    if (!phone) return res.json({ success: false, message: "Phone number is required." });
    if (!/^\d{10}$/.test(phone)) return res.json({ success: false, message: "Invalid 10-digit phone number." });
    if (!confirmPassword) return res.json({ success: false, message: "Please confirm your password." });
    if (password !== confirmPassword) return res.json({ success: false, message: "Passwords do not match." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      authProvider: "jwt"
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.json({ success: true, token });
    }
    res.json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

 
// Update User Profile (JWT only)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const allowedFields = ["firstName", "lastName", "name", "phone", "address", "apartment", "city", "state", "zip", "dob", "gender"];
    const updateFields = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    });

    await userModel.findByIdAndUpdate(userId, updateFields, { new: true });
    res.json({ success: true, message: "Profile updated"});
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: "Server error" });
  }
};

 
// Google OAuth Login
const googleLogin = async (req, res) => {
  try {
    const { email, firstName, lastName, googleId, photo } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      // Create new user
      user = await userModel.create({
        email,
        firstName,
        lastName,
        name: `${firstName || ""} ${lastName || ""}`.trim(),
        googleId,       // store Google ID
        photo,
        authProvider: "google",
      });
    } else {
      // Existing user, update lastLogin
      user.lastLogin = Date.now();
      await user.save();
    }

    const token = createToken(user._id);
    res.json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.json({ success: false, message: "All fields are required." });
    }

    if (newPassword !== confirmPassword) {
      return res.json({ success: false, message: "Passwords do not match." });
    }

    // Find the user
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found." });

    // Prevent Google-auth users from changing password here
    if (user.authProvider === "google") {
      return res.json({ success: false, message: "Please use Google sign-in to access your account." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};




export { loginUser, registerUser, adminLogin, updateProfile, googleLogin, getProfile,changePassword};







