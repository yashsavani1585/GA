

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
