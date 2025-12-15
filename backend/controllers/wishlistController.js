

import userModel from "../models/userModel.js";
import connectRedis from "../config/redis.js";

// TTL for cached wishlist in seconds
const WISHLIST_CACHE_TTL = Number(process.env.WISHLIST_CACHE_TTL || 60);

// -------------------- Helpers --------------------
const normColorKey = (c) => {
  const k = String(c || "").trim().toLowerCase();
  if (!k || k === "-" || k === "null" || k === "undefined") return "-";
  if (k === "rosegold" || k === "rose-gold" || k === "rose") return "rose-gold";
  if (k === "whitegold" || k === "white-gold" || k === "white") return "white-gold";
  if (k === "yellow" || k === "gold") return "gold";
  return k;
};

const getUID = (req) => req.user?.id || req.body.userId;

async function cacheWishlist(userId, wishlist) {
  try {
    const redisClient = await connectRedis();
    await redisClient.setEx(`wishlist_${userId}`, WISHLIST_CACHE_TTL, JSON.stringify(wishlist));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }
}

async function getCachedWishlist(userId) {
  try {
    const redisClient = await connectRedis();
    const cached = await redisClient.get(`wishlist_${userId}`);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.error("Redis get error:", err);
  }
  return null;
}

// -------------------- Controllers --------------------

// Add item to wishlist
export const addWishlist = async (req, res) => {
  try {
    const userId = getUID(req);
    const { itemId, color = null } = req.body;
    if (!userId || !itemId) return res.json({ success: false, message: "Missing fields" });

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const key = `${itemId}:${normColorKey(color)}`;
    if (!user.wishlist.includes(key)) user.wishlist.push(key);

    await user.save();

    // Update Redis cache
    await cacheWishlist(userId, user.wishlist);

    res.json({ success: true, message: "Added to wishlist" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// Remove item from wishlist
export const removeWishlist = async (req, res) => {
  try {
    const userId = getUID(req);
    const { itemId, color = null } = req.body;
    if (!userId || !itemId) return res.json({ success: false, message: "Missing fields" });

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const key = `${itemId}:${normColorKey(color)}`;
    user.wishlist = (user.wishlist || []).filter((k) => k !== key);

    await user.save();

    // Update Redis cache
    await cacheWishlist(userId, user.wishlist);

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = getUID(req);
    if (!userId) return res.json({ success: false, message: "Missing userId" });

    // Try Redis cache first
    let wishlist = await getCachedWishlist(userId);

    if (!wishlist) {
      const user = await userModel.findById(userId);
      if (!user) return res.json({ success: false, message: "User not found" });

      wishlist = user.wishlist || [];
      // Cache the result in Redis
      await cacheWishlist(userId, wishlist);
    }

    res.json({ success: true, wishlist });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};
