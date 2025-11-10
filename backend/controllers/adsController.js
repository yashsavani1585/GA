import Ads from "../models/adsModel.js";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get Ads
export const getAds = async (req, res) => {
  try {
    const ads = await Ads.findOne({});
    res.json({
      leftAd: ads?.leftAd || "",
      rightAd: ads?.rightAd || "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Ads with optional Cloudinary upload
export const updateAds = async (req, res) => {
  try {
    let { leftAd, rightAd } = req.body;

    // Upload leftAd if file exists
    if (req.files?.leftAd) {
      const result = await cloudinary.uploader.upload(req.files.leftAd[0].path, { folder: "ads" });
      leftAd = result.secure_url;
    }

    // Upload rightAd if file exists
    if (req.files?.rightAd) {
      const result = await cloudinary.uploader.upload(req.files.rightAd[0].path, { folder: "ads" });
      rightAd = result.secure_url;
    }

    const ads = await Ads.findOneAndUpdate(
      {},
      { leftAd, rightAd },
      { upsert: true, new: true }
    );

    res.json({ success: true, ads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
