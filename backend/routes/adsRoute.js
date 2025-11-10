import express from "express";
import { getAds, updateAds } from "../controllers/adsController.js";
import { upload } from "../middleware/multer.js";
// import { authUser } from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// GET current ads
router.get("/", getAds);

// POST update ads (admin only) with file uploads
router.post(
  "/",
  adminAuth,
  upload.fields([
    { name: "leftAd", maxCount: 1 },
    { name: "rightAd", maxCount: 1 },
  ]),
  updateAds
);

export default router;
