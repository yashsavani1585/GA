

import metalsAxios from "../config/metalsClient.js";
import connectRedis from "../config/redis.js";

const METALS = process.env.METALS_METALS || "XAU";
const BASE   = process.env.METALS_BASE_CURRENCY || "INR";
const CURRS  = process.env.METALS_CURRENCIES || "INR";
const UNIT   = process.env.METALS_WEIGHT_UNIT || "gram";
const TTL    = Number(process.env.METALS_CACHE_TTL || 60);

let cache = { ts: 0, payload: null }; // fallback in-memory cache

function purityMultiplier(carat) {
  const n = Number(String(carat).replace(/[^0-9]/g, "")) || 24;
  return Math.max(0.3, Math.min(n / 24, 1));
}

async function fetchLatestMetals() {
  const redisClient = await connectRedis();
  const cacheKey = "latest_metals";

  // 1️⃣ Redis Cache
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.error("[Redis] get error:", err);
  }

  // 2️⃣ In-memory fallback
  const now = Date.now();
  if (cache.payload && now - cache.ts < TTL * 1000) return cache.payload;

  // 3️⃣ API Call
  const { data } = await metalsAxios.get("", {
    params: {
      metals: METALS,
      base_currency: BASE,
      currencies: CURRS,
      weight_unit: UNIT,
    },
  });

  if (data?.status !== "success") {
    throw new Error(`Metals API error: ${data?.message || "unknown"}`);
  }

  const payload = data.data;

  // 4️⃣ Save to Redis
  try {
    await redisClient.setEx(cacheKey, TTL, JSON.stringify(payload));
  } catch (err) {
    console.error("[Redis] setEx error:", err);
  }

  // 5️⃣ Update memory cache
  cache = { ts: now, payload };

  return payload;
}

// -------------------- Controllers --------------------
export async function getGoldRate(req, res) {
  try {
    const carat = req.query.carat || "14";
    const payload = await fetchLatestMetals();
    const xau = payload?.metal_prices?.XAU;

    if (!xau) {
      return res.status(502).json({ success: false, message: "XAU price not found" });
    }

    const want = String(carat).toUpperCase().replace("K", "");
    const ladderKey = {
      "24": "price_24k", "22": "price_22k", "21": "price_21k",
      "20": "price_20k", "18": "price_18k", "14": "price_14k",
      "10": "price_10k", "9":  "price_9k",
    }[want];

    let perGram;
    if (ladderKey && typeof xau[ladderKey] === "number") {
      perGram = xau[ladderKey];
    } else if (typeof xau.price_24k === "number") {
      perGram = xau.price_24k * purityMultiplier(want);
    } else if (typeof xau.price === "number") {
      perGram = xau.price * purityMultiplier(want);
    } else {
      return res.status(502).json({ success: false, message: "No usable price for XAU" });
    }

    res.json({
      success: true,
      carat: String(carat),
      ratePerGram: Math.round(perGram),
      currency: payload.base_currency,
      weight_unit: payload.weight_unit,
      ts: payload.timestamp,
    });
  } catch (e) {
    console.error("[getGoldRate] error:", e);
    res.status(500).json({ success: false, message: e.message || "Failed to fetch gold rate" });
  }
}

export async function getMetalsRaw(req, res) {
  try {
    const payload = await fetchLatestMetals();
    res.json({ success: true, data: payload });
  } catch (e) {
    console.error("[getMetalsRaw] error:", e);
    res.status(500).json({ success: false, message: e.message || "Failed to fetch metals" });
  }
}
