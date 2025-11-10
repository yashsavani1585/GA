// // controllers/forms.controller.js
// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import PersonalizedRequest from "../models/PersonalizedRequest.js";

// export const createPersonalized = async (req, res) => {
//   const { name, phone, email, type, metal, notes, userId } = req.body;
//   let fileUrl = null;

//   try {
//     if (req.file) {
//       const up = await cloudinary.uploader.upload(req.file.path, {
//         folder: "everglow/forms",
//         resource_type: "auto", // <-- important for pdf/docx
//       });
//       fileUrl = up.secure_url;
//     }

//     const doc = await PersonalizedRequest.create({
//       userId: userId || null,
//       name, phone, email, type, metal, notes, fileUrl,
//     });

//     res.json({ success: true, data: doc });
//   } catch (e) {
//     res.status(400).json({ success: false, message: e.message });
//   } finally {
//     // clean temp file if present
//     if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//   }
// };


// controllers/forms.controller.js
// controllers/formController.js
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import PersonalizedRequest from "../models/PersonalizedRequest.js";
import Inquiry from "../models/Inquiry.js";
import connectRedis from "../config/redis.js"; // Redis connection

// 🔹 Redis client
const redisClient = await connectRedis();

// ------------------- Helpers -------------------
const normalizeDiamond = (diamond) => {
  if (!diamond || typeof diamond !== "object") return null;
  const name = String(diamond.name || "").trim();
  const photo = String(diamond.photo || "").trim();
  if (!name) return null;
  return { name, photo };
};

const cacheKey = (type, filter = "") => `forms:${type}:${filter}`;

// ------------------- PUBLIC -------------------

// submit personalized request
export const createPersonalized = async (req, res) => {
  let fileUrl = null;

  try {
    const { name, phone, email, type, metal, notes, userId } = req.body;
    if (!name || !phone || !email || !type || !metal)
      return res.status(400).json({ success: false, message: "Missing required fields." });

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "everglow/forms",
        resource_type: "auto",
      });
      fileUrl = uploaded.secure_url || null;
    }

    const doc = await PersonalizedRequest.create({
      userId: userId || null,
      name,
      phone,
      email,
      type,
      metal,
      notes: notes || "",
      fileUrl,
    });

    // 🔹 Invalidate Redis cache for listing
    await redisClient.del(cacheKey("personalized"));

    return res.json({ success: true, data: doc });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  } finally {
    try {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    } catch {}
  }
};

// submit inquiry
export const createInquiry = async (req, res) => {
  try {
    const { name, phone, email, message, topic, userId, diamond, diamondQuantity } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: "Missing required fields." });

    const Diamond = normalizeDiamond(diamond);
    const qty = Number.isFinite(Number(diamondQuantity)) ? Math.max(1, Math.min(50, Number(diamondQuantity))) : 1;

    const doc = await Inquiry.create({
      userId: userId || null,
      name,
      phone: phone || "",
      email,
      message,
      topic: (topic || (Diamond ? "diamond-inquiry" : "general")).trim(),
      diamond: Diamond,
      diamondQuantity: Diamond ? qty : 1,
    });

    // 🔹 Invalidate Redis cache
    await redisClient.del(cacheKey("inquiry"));

    return res.json({ success: true, data: doc });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

// ------------------- ADMIN -------------------

// list personalized requests (with Redis cache)
export const listPersonalized = async (req, res) => {
  try {
    const { status = "" } = req.query;
    const key = cacheKey("personalized", status);

    const cached = await redisClient.get(key);
    if (cached) {
      return res.json({ success: true, data: JSON.parse(cached) });
    }

    const q = status ? { status } : {};
    const data = await PersonalizedRequest.find(q).sort({ createdAt: -1 });

    await redisClient.setEx(key, 60 * 5, JSON.stringify(data)); // cache 5 mins
    return res.json({ success: true, data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

// update personalized request
export const updatePersonalized = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const doc = await PersonalizedRequest.findByIdAndUpdate(
      id,
      { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
      { new: true }
    );

    // 🔹 Invalidate Redis cache
    await redisClient.del(cacheKey("personalized"));

    return res.json({ success: true, data: doc });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

// list inquiries (with Redis cache)
export const listInquiries = async (_req, res) => {
  try {
    const key = cacheKey("inquiry");
    const cached = await redisClient.get(key);
    if (cached) return res.json({ success: true, data: JSON.parse(cached) });

    const data = await Inquiry.find().sort({ createdAt: -1 });
    await redisClient.setEx(key, 60 * 5, JSON.stringify(data)); // cache 5 mins

    return res.json({ success: true, data });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

// update inquiry
export const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const doc = await Inquiry.findByIdAndUpdate(
      id,
      { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
      { new: true }
    );

    // 🔹 Invalidate Redis cache
    await redisClient.del(cacheKey("inquiry"));

    return res.json({ success: true, data: doc });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};
