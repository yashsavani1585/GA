// import jwt from 'jsonwebtoken'

// const adminAuth = async (req,res,next) =>{
//     try {
//         const {token} = req.headers
//         if(!token){
//             return res.json({success:false, message:"Not Authorized Login Again"})
//         }
//         const token_decode = jwt.verify(token,process.env.JWT_SECRET);
//         console.log(token_decode);
        
//         if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
//             return res.json({success:false, message:"Not Authorized Login Again"})
//         }
//         next()
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:error.message})
//     }
// }
// export default adminAuth


// middleware/adminAuth.js
import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: "Access Denied. Admin only." });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.error("adminAuth error:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export default adminAuth;
