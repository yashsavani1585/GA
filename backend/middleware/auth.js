// import jwt from 'jsonwebtoken'
// // import cartRouter from '../routes/cartRoute.js';
// const authUser = async (req,res, next) => {
//     const {token} = req.headers;

//     if (!token) {
//         return res.json({success:false, message:'Not Authorized Login Again'})
//     }

//     try {
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET)
//     req.user = { id: token_decode.id }
//         next()
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message})
//     }
// }

// export default authUser
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import User from "../models/userModel.js"; // adjust path if needed

// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET || "yash";


// export const authUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     if (!authHeader)
//       return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });

//     const token = authHeader.split(" ")[1]; // Bearer <token>
//     if (!token)
//       return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET ||JWT_SECRET ||"yash");
//     if (!decoded || !decoded.id)
//       return res.status(401).json({ success: false, message: "Invalid Token" });

//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(401).json({ success: false, message: "User not found" });

//     req.user = user || { _id: decoded.id }; // 👈 now req.user._id is valid
//     next();
//   } catch (err) {
//     console.error("[authUser] JWT Error:", err.message);
//     return res.status(401).json({ success: false, message: "Invalid or Expired Token" });
//   }
// };

// export async function protect(req, res, next) {
//   try {
//     // 1) Read token (header, cookie, or query)
//     const authHeader = req.headers.authorization || req.headers.Authorization;
//     let token = null;

//     if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
//       token = authHeader.split(" ")[1].trim();
//     } else if (req.cookies && req.cookies.token) {
//       token = req.cookies.token;
//     } else if (req.query && req.query.token) {
//       token = req.query.token;
//     }

//     if (!token) {
//       return res.status(401).json({ success: false, message: "Not authenticated — token missing" });
//     }

//     // 2) Ensure JWT secret available (fallback used if not set)
//     if (!JWT_SECRET) {
//       console.error("JWT_SECRET missing and no fallback available.");
//       return res.status(500).json({
//         success: false,
//         message: "Server misconfiguration: JWT secret missing.",
//       });
//     }

//     // 3) Verify token using the defined secret
//     let decoded;
//     try {
//       decoded = jwt.verify(token, JWT_SECRET);
//     } catch (err) {
//       console.warn("Invalid/expired JWT:", err.message);
//       return res.status(401).json({ success: false, message: "Invalid or expired token" });
//     }

//     // 4) Extract user id and validate
//     const userId = decoded?.id || decoded?._id || decoded?.userId;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Invalid token payload" });
//     }

//     // 5) Fetch user from DB
//     const user = await User.findById(userId).select("_id name email role");
//     if (!user) {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }

//     // 6) Attach user and continue
//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("auth protect error:", err);
//     return res.status(401).json({ success: false, message: "Unauthorized", error: err.message });
//   }
// }


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
