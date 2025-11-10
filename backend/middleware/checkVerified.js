import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware: Check if user is authenticated and verified
export const checkVerified = async (req, res, next) => {
  try {
    // 1️⃣ Check Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // 3️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 4️⃣ Fetch user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 5️⃣ Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Profile verification pending. Please submit documents to participate.",
      });
    }

    // 6️⃣ Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("checkVerified middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
