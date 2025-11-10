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
import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // make sure your User model path is correct

export const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token)
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id)
      return res.status(401).json({ success: false, message: "Invalid Token" });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user || { _id: decoded.id }; // 👈 now req.user._id is valid
    next();
  } catch (err) {
    console.error("[authUser] JWT Error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or Expired Token" });
  }
};
