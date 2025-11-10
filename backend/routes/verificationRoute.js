import express from "express";
import { upload } from "../middleware/multer.js";
import { authUser } from "../middleware/auth.js";
import { submitVerification, getPendingVerifications, verifyUser, getUserById } from "../controllers/verificationController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// ✅ User submit verification → auth required
router.post("/submit", authUser, upload.single("documentFile"), submitVerification);

// ✅ Get user info
router.get("/user/:id", authUser, getUserById);

// ✅ Admin routes
router.get("/pending", adminAuth, getPendingVerifications);
router.post("/verify/:id", adminAuth, verifyUser);


router.get("/debug-status", authUser, async (req, res) => {
  const io = getSocketIO();
  res.json({
    socketConnected: !!io,
    userId: req.user.id,
    timestamp: new Date().toISOString()
  });
});

export default router;
