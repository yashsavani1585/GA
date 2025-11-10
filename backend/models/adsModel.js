import mongoose from "mongoose";

const AdsSchema = new mongoose.Schema({
  leftAd: { type: String, default: "" },   // stores Cloudinary URL
  rightAd: { type: String, default: "" },  // stores Cloudinary URL
}, { timestamps: true });

export default mongoose.model("Ads", AdsSchema);
