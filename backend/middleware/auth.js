


import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "yash"; // fallback only for dev

export const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader) return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });

    const parts = authHeader.split(" ");
    const token = parts.length === 2 ? parts[1] : null;
    if (!token) return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    if (!decoded || !decoded.id) return res.status(401).json({ success: false, message: "Invalid Token" });

    const user = await User.findById(decoded.id).select("_id name email role");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("[authUser] Error:", err);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export async function protect(req, res, next) {
  try {
    // accept token from header, cookie, or query param
    let token = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1].trim();
    else if (req.cookies && req.cookies.token) token = req.cookies.token;
    else if (req.query && req.query.token) token = req.query.token;

    if (!token) return res.status(401).json({ success: false, message: "Not authenticated — token missing" });

    const secret = process.env.JWT_SECRET || JWT_SECRET;
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const userId = decoded?.id || decoded?._id || decoded?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Invalid token payload" });

    const user = await User.findById(userId).select("_id name email role");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("protect middleware error:", err);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}
