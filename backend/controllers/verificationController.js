// // import User from "../models/userModel.js";
// // import { v2 as cloudinary } from "cloudinary";
// // import fs from "fs";

// // // Cloudinary config
// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // });

// // // -------------------------
// // // Submit verification by user
// // // -------------------------
// // export const submitVerification = async (req, res) => {
// //   try {
// //     if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

// //     const userId = req.user.id;
// //     const { documentType } = req.body;
// //     const documentFile = req.file?.path;

// //     if (!documentType || !documentFile) return res.status(400).json({ success: false, message: "Document required" });

// //     const uploaded = await cloudinary.uploader.upload(documentFile, { folder: "user_verifications", resource_type: "auto" });
// //     fs.unlinkSync(documentFile);

// //     const updatedUser = await User.findByIdAndUpdate(
// //       userId,
// //       { documentType, documentFile: uploaded.secure_url, verified: false },
// //       { new: true }
// //     ).select("-password");

// //     req.app.get("io")?.emit("newVerification", { userId: updatedUser._id, name: updatedUser.name });

// //     res.json({ success: true, message: "Document submitted! Waiting admin approval.", user: updatedUser });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };


// // // -------------------------
// // // Get user by ID
// // // -------------------------
// // export const getUserById = async (req, res) => {
// //   try {
// //     const userId = req.params.id;
// //     const user = await User.findById(userId).select("-password");
// //     if (!user) return res.status(404).json({ success: false, message: "User not found" });
// //     res.json({ success: true, user });
// //   } catch (err) {
// //     console.error("getUserById error:", err);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // // -------------------------
// // // Admin: Get pending verifications
// // // -------------------------
// // export const getPendingVerifications = async (req, res) => {
// //   try {
// //     const users = await User.find({
// //       verified: false,
// //       documentFile: { $exists: true, $ne: "" },
// //     }).select("name email documentType documentFile");
// //     res.json({ success: true, users });
// //   } catch (err) {
// //     console.error("getPendingVerifications error:", err);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // // -------------------------
// // // Admin: Verify user
// // // -------------------------
// // export const verifyUser = async (req, res) => {
// //   try {
// //     const userId = req.params.id;

// //     const user = await User.findByIdAndUpdate(userId, { verified: true }, { new: true }).select("-password");
// //     if (!user) return res.status(404).json({ success: false, message: "User not found" });

// //     // Live update for all clients
// //     req.app.get("io")?.emit("userVerified", { userId: user._id, verified: true, name: user.name });

// //     res.json({ success: true, message: "User verified successfully!", user });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// import User from "../models/userModel.js";
// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import { getSocketIO } from "../config/socketUtils.js";

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // -------------------------
// // Submit verification by user
// // -------------------------
// export const submitVerification = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const userId = req.user.id;
//     const { documentType } = req.body;
//     const documentFile = req.file?.path;

//     if (!documentType || !documentFile) {
//       return res.status(400).json({ success: false, message: "Document type and file required" });
//     }

//     // Check if user already has pending verification
//     const existingUser = await User.findById(userId);
//     if (existingUser.documentFile && !existingUser.verified) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Verification already pending approval" 
//       });
//     }

//     // Upload to Cloudinary
//     const uploadedFile = await cloudinary.uploader.upload(documentFile, {
//       folder: "user_verifications",
//       resource_type: "auto",
//     });

//     // Remove local file
//     if (fs.existsSync(documentFile)) {
//       fs.unlinkSync(documentFile);
//     }

//     // Update user
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { 
//         documentType, 
//         documentFile: uploadedFile.secure_url, 
//         verified: false,
//         verificationSubmittedAt: new Date()
//       },
//       { new: true }
//     ).select("-password");

//     // Emit socket event for admin dashboard
//     const io = getSocketIO();
//     if (io) {
//       io.emit("newVerification", { 
//         userId: updatedUser._id, 
//         name: updatedUser.name,
//         email: updatedUser.email,
//         documentType: updatedUser.documentType,
//         documentFile: updatedUser.documentFile,
//         submittedAt: updatedUser.verificationSubmittedAt
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Verification submitted! Waiting for admin approval.",
//       user: updatedUser,
//     });
//   } catch (err) {
//     console.error("submitVerification error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // -------------------------
// // Get user by ID
// // -------------------------
// export const getUserById = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId).select("-password");
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });
//     res.json({ success: true, user });
//   } catch (err) {
//     console.error("getUserById error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // -------------------------
// // Admin: Get pending verifications
// // -------------------------
// export const getPendingVerifications = async (req, res) => {
//   try {
//     const users = await User.find({
//       verified: false,
//       documentFile: { $exists: true, $ne: "" },
//     }).select("name email documentType documentFile verificationSubmittedAt");
//     res.json({ success: true, users });
//   } catch (err) {
//     console.error("getPendingVerifications error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // -------------------------
// // Admin: Verify user
// // -------------------------
// export const verifyUser = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     // Optional: check if requester is admin
//     // if (!req.user || req.user.role !== "admin") {
//     //   return res.status(403).json({ success: false, message: "Admins only" });
//     // }

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { verified: true, verifiedAt: new Date() },
//       { new: true }
//     ).select("-password");

//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     // Emit socket event so frontend updates automatically
//     const io = getSocketIO();
//     if (io) {
//       io.emit("userVerified", { 
//         userId: user._id, 
//         verified: true,
//         verifiedAt: user.verifiedAt
//       });
      
//       // Also emit to user's specific room
//       io.to(`user_${user._id}`).emit("userVerified", {
//         userId: user._id,
//         verified: true,
//         verifiedAt: user.verifiedAt
//       });
//     }

//     res.json({ 
//       success: true, 
//       message: "User verified successfully!", 
//       user 
//     });
//   } catch (err) {
//     console.error("verifyUser error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // -------------------------
// // Admin: Reject verification
// // -------------------------
// export const rejectVerification = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const { reason } = req.body;

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { 
//         documentFile: null,
//         documentType: null,
//         verificationSubmittedAt: null,
//         verificationRejected: true,
//         rejectionReason: reason
//       },
//       { new: true }
//     ).select("-password");

//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     // Emit socket event
//     const io = getSocketIO();
//     if (io) {
//       io.to(`user_${user._id}`).emit("verificationRejected", {
//         userId: user._id,
//         reason: reason
//       });
//     }

//     res.json({ 
//       success: true, 
//       message: "Verification rejected!", 
//       user 
//     });
//   } catch (err) {
//     console.error("rejectVerification error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// import User from "../models/userModel.js";
// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import { getSocketIO } from "../config/socketUtils.js";

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // -------------------------
// // Submit verification by user
// // -------------------------
// export const submitVerification = async (req, res) => {
//   try {
//     console.log("📥 Verification submission request received");
    
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const userId = req.user.id;
//     const { documentType } = req.body;
//     const documentFile = req.file?.path;

//     console.log("User ID:", userId);
//     console.log("Document Type:", documentType);
//     console.log("File path:", documentFile);

//     if (!documentType || !documentFile) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Document type and file are required" 
//       });
//     }

//     // Check if user already has pending verification
//     const existingUser = await User.findById(userId);
//     if (existingUser.documentFile && !existingUser.verified) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Verification already pending approval" 
//       });
//     }

//     // Upload to Cloudinary
//     console.log("📤 Uploading to Cloudinary...");
//     const uploadedFile = await cloudinary.uploader.upload(documentFile, {
//       folder: "user_verifications",
//       resource_type: "auto",
//     });

//     console.log("✅ Cloudinary upload successful:", uploadedFile.secure_url);

//     // Remove local file
//     if (fs.existsSync(documentFile)) {
//       fs.unlinkSync(documentFile);
//       console.log("🗑️ Local file removed");
//     }

//     // Update user with verification data
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { 
//         documentType, 
//         documentFile: uploadedFile.secure_url, 
//         verified: false,
//         verificationSubmittedAt: new Date(),
//         verificationRejected: false,
//         rejectionReason: null
//       },
//       { new: true }
//     ).select("-password");

//     console.log("✅ User updated in database");

//     // Emit socket event for admin dashboard
//     const io = getSocketIO();
//     if (io) {
//       io.emit("newVerification", { 
//         userId: updatedUser._id, 
//         name: updatedUser.name,
//         email: updatedUser.email,
//         documentType: updatedUser.documentType,
//         documentFile: updatedUser.documentFile,
//         submittedAt: updatedUser.verificationSubmittedAt
//       });
//       console.log("📢 Socket event emitted for new verification");
//     }

//     res.status(200).json({
//       success: true,
//       message: "Verification submitted successfully! Waiting for admin approval.",
//       user: updatedUser,
//     });

//   } catch (err) {
//     console.error("❌ submitVerification error:", err);
    
//     // Clean up file if upload failed
//     if (req.file?.path && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
    
//     res.status(500).json({ 
//       success: false, 
//       message: err.message || "Internal server error" 
//     });
//   }
// };

// // -------------------------
// // Get user by ID
// // -------------------------
// export const getUserById = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     console.log("🔍 Fetching user:", userId);
    
//     const user = await User.findById(userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "User not found" 
//       });
//     }
    
//     console.log("✅ User found:", user.email, "Verified:", user.verified);
//     res.json({ 
//       success: true, 
//       user 
//     });
    
//   } catch (err) {
//     console.error("❌ getUserById error:", err);
//     res.status(500).json({ 
//       success: false, 
//       message: err.message 
//     });
//   }
// };

// // -------------------------
// // Admin: Get pending verifications
// // -------------------------
// export const getPendingVerifications = async (req, res) => {
//   try {
//     console.log("🔍 Fetching pending verifications...");
    
//     const users = await User.find({
//       verified: false,
//       documentFile: { $exists: true, $ne: null, $ne: "" }
//     }).select("name email documentType documentFile verificationSubmittedAt verifiedAt");
    
//     console.log(`✅ Found ${users.length} pending verifications`);
    
//     res.json({ 
//       success: true, 
//       users 
//     });
    
//   } catch (err) {
//     console.error("❌ getPendingVerifications error:", err);
//     res.status(500).json({ 
//       success: false, 
//       message: err.message 
//     });
//   }
// };

// // -------------------------
// // Admin: Verify user
// // -------------------------
// export const verifyUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findByIdAndUpdate(userId,
//        { verified: true }, 
//        { new: true }
//       );
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     // Emit real-time event
//     const io = getSocketIO();
//     io.to(`user_${userId}`).emit("userVerified", { userId, 
//       verified: true ,
//       verifiedAt: new Date(),
//     });

//     res.json({ success: true, message: "User verified!", user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// // -------------------------
// // Admin: Reject verification
// // -------------------------
// export const rejectVerification = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const { reason } = req.body;

//     console.log("❌ Admin rejecting verification for user:", userId, "Reason:", reason);

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { 
//         documentFile: null,
//         documentType: null,
//         verificationSubmittedAt: null,
//         verificationRejected: true,
//         rejectionReason: reason,
//         verified: false
//       },
//       { new: true }
//     ).select("-password");

//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "User not found" 
//       });
//     }

//     // Emit socket event
//     const io = getSocketIO();
//     if (io) {
//       io.to(`user_${user._id}`).emit("verificationRejected", {
//         userId: user._id.toString(),
//         reason: reason
//       });
//       console.log("📢 Socket event emitted for verification rejection");
//     }

//     res.json({ 
//       success: true, 
//       message: "Verification rejected!", 
//       user 
//     });
    
//   } catch (err) {
//     console.error("❌ rejectVerification error:", err);
//     res.status(500).json({ 
//       success: false, 
//       message: err.message 
//     });
//   }
// };

// // -------------------------
// // Check verification status
// // -------------------------
// export const checkVerificationStatus = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const user = await User.findById(userId).select("verified documentFile documentType verificationSubmittedAt verifiedAt");
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "User not found" 
//       });
//     }

//     res.json({
//       success: true,
//       verified: user.verified,
//       documentSubmitted: !!user.documentFile,
//       documentType: user.documentType,
//       submittedAt: user.verificationSubmittedAt,
//       verifiedAt: user.verifiedAt
//     });
    
//   } catch (err) {
//     console.error("❌ checkVerificationStatus error:", err);
//     res.status(500).json({ 
//       success: false, 
//       message: err.message 
//     });
//   }
// };

import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------------
// Submit verification by user
// -------------------------
export const submitVerification = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { documentType } = req.body;
    const documentFile = req.file?.path;

    if (!documentType || !documentFile) return res.status(400).json({ success: false, message: "Document type and file required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.documentFile && !user.verified) return res.status(400).json({ success: false, message: "Verification already pending" });

    // Upload to Cloudinary
    const uploaded = await cloudinary.uploader.upload(documentFile, { folder: "user_verifications" });

    if (fs.existsSync(documentFile)) fs.unlinkSync(documentFile);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        documentType,
        documentFile: uploaded.secure_url,
        verified: false,
        verificationSubmittedAt: new Date(),
        verificationRejected: false,
        rejectionReason: null
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({ success: true, message: "Verification submitted successfully!", user: updatedUser });

  } catch (err) {
    console.error("submitVerification error:", err);
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
};

// -------------------------
// Get user by ID
// -------------------------
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// Admin: Get pending verifications
// -------------------------
export const getPendingVerifications = async (req, res) => {
  try {
    const users = await User.find({ verified: false, documentFile: { $ne: null } })
      .select("name email documentType documentFile verificationSubmittedAt verifiedAt");
    res.json({ success: true, users });
  } catch (err) {
    console.error("getPendingVerifications error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// Admin: Verify user
// -------------------------
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { verified: true, verifiedAt: new Date() }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User verified successfully!", user });
  } catch (err) {
    console.error("verifyUser error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// Admin: Reject verification
// -------------------------
export const rejectVerification = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        documentFile: null,
        documentType: null,
        verificationSubmittedAt: null,
        verificationRejected: true,
        rejectionReason: reason,
        verified: false
      },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Verification rejected successfully!", user });
  } catch (err) {
    console.error("rejectVerification error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// Check verification status
// -------------------------
export const checkVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("verified documentFile documentType verificationSubmittedAt verifiedAt");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      verified: user.verified,
      documentSubmitted: !!user.documentFile,
      documentType: user.documentType,
      submittedAt: user.verificationSubmittedAt,
      verifiedAt: user.verifiedAt
    });
  } catch (err) {
    console.error("checkVerificationStatus error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
