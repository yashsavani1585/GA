import Auction from '../models/auctionModel.js';
import Bid from '../models/bidModel.js';
import Order from '../models/orderModel.js';
// import User from '../models/userModel.js';
import fs from "fs"; // ✅ ADD THIS LINE
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { sendAuctionWinEmail, sendPaymentReminderEmail, buildFrontendCheckoutUrl, sendAuctionLostRefundEmail, sendSecondBidderEmail } from '../config/emailService.js';
import { generatePaymentLink } from '../config/paymentService.js';
import { scheduleAuctionEnd } from '../config/Schedule.js';
import Deposit from "../models/Deposit.js";


dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function deriveStatus(startAt, endAt) {
  const now = Date.now();
  const s = startAt ? new Date(startAt).getTime() : null;
  const e = endAt ? new Date(endAt).getTime() : null;

  if (s && now < s) return "upcoming";
  if (e && now >= e) return "ended";
  if ((!s || now >= s) && (!e || now < e)) return "live";
  return "upcoming";
}

function msToHMS(ms) {
  if (ms <= 0) return "Ended";
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) return `${hrs}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
  return `${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
}

// CREATE AUCTION
// export const createAuction = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'Product image required' });

//     const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'auctions' });

//     const { productName, productDescription, startingPrice, durationHours, minIncrement } = req.body;

//     if (!productName || !startingPrice || !durationHours)
//       return res.status(400).json({ message: 'productName, startingPrice & durationHours required' });

//     const duration = Number(durationHours);
//     const minInc = Number(minIncrement) || 100;
//     const now = new Date();
//     const endTime = new Date(now.getTime() + duration * 60 * 60 * 1000); // Convert hours to milliseconds

//     const auction = await Auction.create({
//       productName,
//       productDescription,
//       productImage: uploadResult.secure_url,
//       startingPrice: Number(startingPrice),
//       currentPrice: Number(startingPrice),
//       highestBidder: null,
//       duration,
//       startAt: now,
//       endTime: endTime,
//       createdBy: req.user?._id || null,
//       status: 'live',
//       minIncrement: minInc,
//       bidsCount: 0,
//       bids: [],
//     });

//     // Schedule auction end
//     scheduleAuctionEnd(auction._id, endTime);

//     return res.status(201).json({
//       success: true,
//       message: `Auction started for ${duration} hour(s)`,
//       data: auction,
//     });
//   } catch (err) {
//     console.error('createAuction err:', err);
//     return res.status(500).json({ message: err.message });
//   }
// };
// export const createAuction = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "Product image required" });

//     // Upload image to Cloudinary
//     const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "auctions" });

//     const { productName, productDescription, startingPrice, durationMinutes, minIncrement } = req.body;

//     // Validate required fields
//     if (!productName || !startingPrice || !durationMinutes) {
//       return res.status(400).json({ message: "productName, startingPrice & durationMinutes required" });
//     }

//     // Convert minutes → hours, ensure min 1 hour
//     let duration = Number(durationMinutes) / 60;
//     if (duration < 1) duration = 1;

//     const minInc = Number(minIncrement) || 1; // default 1
//     const now = new Date();
//     const endTime = new Date(now.getTime() + duration * 60 * 60 * 1000); // convert hours → ms

//     const auction = await Auction.create({
//       productName,
//       productDescription,
//       productImage: uploadResult.secure_url,
//       startingPrice: Number(startingPrice),
//       currentPrice: Number(startingPrice),
//       highestBidder: null,
//       duration,
//       startAt: now,
//       endTime,
//       createdBy: req.user?._id || null,
//       status: "live",
//       minIncrement: minInc,
//       bidsCount: 0,
//       bids: [],
//     });

//     // Schedule auction end
//     scheduleAuctionEnd(auction._id, endTime);

//     return res.status(201).json({
//       success: true,
//       message: `Auction started for ${duration.toFixed(2)} hour(s)`,
//       data: auction,
//     });
//   } catch (err) {
//     console.error("createAuction err:", err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// export const createAuction = async (req, res) => {
//   try {
//     // 1️⃣ Check for uploaded image
//     if (!req.file)
//       return res.status(400).json({ message: "Product image required" });

//     // 2️⃣ Upload to Cloudinary
//     const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//       folder: "auctions",
//     });

//     // 3️⃣ Extract fields
//     const {
//       productName,
//       productDescription,
//       startingPrice,
//       durationMinutes,
//       minIncrement,
//     } = req.body;

//     // 4️⃣ Validate input
//     if (!productName || !startingPrice || !durationMinutes) {
//       return res
//         .status(400)
//         .json({ message: "productName, startingPrice & durationMinutes required" });
//     }

//     // 5️⃣ Convert duration (minutes → hours)
//     let duration = Number(durationMinutes) / 60;
//     if (duration < 1) duration = 1; // Minimum 1 hour

//     const minInc = Number(minIncrement) || 1;
//     const now = new Date();
//     const endTime = new Date(now.getTime() + duration * 10 * 10 * 1000); // Convert hours → ms

//     // 6️⃣ Create auction document in DB
//     const auction = await Auction.create({
//       productName,
//       productDescription,
//       productImage: uploadResult.secure_url,
//       startingPrice: Number(startingPrice),
//       currentPrice: Number(startingPrice),
//       highestBidder: null,
//       duration,
//       startAt: now,
//       endTime,
//       createdBy: req.user?._id || null,
//       status: "live",
//       minIncrement: minInc,
//       bidsCount: 0,
//       bids: [],
//       isActive: true,
//     });

//     // 7️⃣ Delete temporary file after upload
//     fs.unlinkSync(req.file.path);

//     // 8️⃣ Schedule auction end (auto close)
//     scheduleAuctionEnd(auction._id, endTime);

//     // 9️⃣ Respond to client
//     return res.status(201).json({
//       success: true,
//       message: `Auction started for ${duration.toFixed(2)} hour(s)`,
//       data: auction,
//     });
//   } catch (err) {
//     console.error("❌ createAuction error:", err);
//     return res.status(500).json({ message: err.message });
//   }
// };

export const createAuction = async (req, res) => {
  const tmpFilePath = req.file?.path; // multer should populate this
  try {
    // 1) require image
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Product image required (upload file)." });
    }

    // 2) extract fields
    const {
      productName,
      productDescription = "",
      startingPrice,
      durationMinutes,
      minIncrement,
      depositPercent,
      startAt: startAtRaw,
    } = req.body;

    // 3) validations
    if (!productName || productName.toString().trim().length === 0) {
      await tmpFilePath && fs.unlink(tmpFilePath).catch(() => { });
      return res.status(400).json({ success: false, message: "productName is required" });
    }

    if (startingPrice === undefined || startingPrice === null || startingPrice === "") {
      await tmpFilePath && fs.unlink(tmpFilePath).catch(() => { });
      return res.status(400).json({ success: false, message: "startingPrice (in rupees) is required" });
    }
    const startingPriceNum = Number(startingPrice);
    if (isNaN(startingPriceNum) || startingPriceNum < 0) {
      await tmpFilePath && fs.unlink(tmpFilePath).catch(() => { });
      return res.status(400).json({ success: false, message: "startingPrice must be a valid non-negative number (in rupees)." });
    }

    // 4) durationMinutes validation & normalize (default 1 minute)
    let durationMin = 1;
    if (durationMinutes !== undefined && durationMinutes !== null && durationMinutes !== "") {
      const dm = Number(durationMinutes);
      if (isNaN(dm) || dm <= 0) {
        await tmpFilePath && fs.unlink(tmpFilePath).catch(() => { });
        return res.status(400).json({ success: false, message: "durationMinutes must be a positive number (minutes)." });
      }
      durationMin = Math.max(1, Math.ceil(dm)); // at least 1 minute, round up
    }

    // 5) other numeric normalizations
    const startingPricePaise = Math.round(startingPriceNum * 100);
    const currentPricePaise = startingPricePaise;
    const minIncrementRupees = (minIncrement !== undefined && minIncrement !== null && minIncrement !== "") ? Number(minIncrement) : 1;
    const minIncrementPaise = Math.max(0, Math.round(minIncrementRupees * 100));
    const depositPct = (depositPercent !== undefined && depositPercent !== null && depositPercent !== "") ? Number(depositPercent) : 25;

    // 6) upload image to Cloudinary
    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(tmpFilePath, {
        folder: "auctions",
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });
    } catch (uploadErr) {
      await tmpFilePath && fs.unlink(tmpFilePath).catch(() => { });
      console.error("Cloudinary upload failed:", uploadErr);
      return res.status(500).json({ success: false, message: "Image upload failed", error: uploadErr.message || String(uploadErr) });
    }

    // 7) compute startAt / endAt using minutes
    const now = new Date();
    // if startAt provided and valid, schedule from that, else start now
    let startAt = now;
    if (startAtRaw) {
      const parsed = new Date(startAtRaw);
      if (isNaN(parsed.getTime())) {
        // invalid startAt
        await tmpFilePath && fs.unlink(tmpFilePath).catch(() => { });
        return res.status(400).json({ success: false, message: "Invalid startAt datetime" });
      }
      startAt = parsed;
    }
    const endAt = new Date(startAt.getTime() + durationMin * 60 * 1000);

    // 8) compute durationHours for backwards compatibility
    // use a decimal (e.g., 1 minute => 0.016667 hours). Round to 6 decimals.
    const durationHoursDecimal = Number((durationMin / 60).toFixed(6));

    // 9) create auction payload (include both minutes & hours fields)
    const auctionPayload = {
      productName: productName.toString(),
      productDescription: (productDescription || "").toString(),
      productImage: uploadResult.secure_url || uploadResult.url || null,
      startingPricePaise,
      currentPricePaise,
      highestBidder: null,
      durationMinutes: durationMin,      // new minute field
      durationHours: durationHoursDecimal, // keep for schema that requires it
      startAt,
      endAt,
      createdBy: req.user?._id || null,
      status: startAt > new Date() ? "scheduled" : "live",
      minIncrementPaise,
      bidsCount: 0,
      bids: [],
      isActive: startAt > new Date() ? false : true, // scheduled auctions not active yet
      depositPercent: depositPct,
    };

    const auction = await Auction.create(auctionPayload);

    // 10) cleanup temp file
    try { if (tmpFilePath) await fs.unlink(tmpFilePath).catch(() => { }); } catch (e) { console.warn("tmp unlink warning:", e?.message || e); }

    // 11) schedule start & end
    try {
      // If you have a persistent scheduler (recommended), call it here:
      // scheduleAuctionStart(auction._id, startAt) and 
      scheduleAuctionEnd(auction._id, endAt)
      // Fallback: in-process timers (not durable across restarts)
      const nowTs = Date.now();
      const msUntilStart = startAt.getTime() - nowTs;
      const msUntilEnd = endAt.getTime() - nowTs;

      if (msUntilStart > 0) {
        // schedule activation at startAt
        setTimeout(async () => {
          try {
            await Auction.findByIdAndUpdate(auction._id, { status: "live", isActive: true }).catch(() => { });
            // optionally notify users
          } catch (e) {
            console.error("Error activating scheduled auction:", e);
          }
        }, msUntilStart);
      }

      if (msUntilEnd > 0) {
        setTimeout(async () => {
          try {
            // finalize auction: mark ended, set isActive false (you should also compute winner etc.)
            await Auction.findByIdAndUpdate(auction._id, { status: "ended", isActive: false }).catch(() => { });
            // run end-of-auction logic: determine winner, create order, notify users...
          } catch (e) {
            console.error("Error ending auction (in-process):", e);
          }
        }, msUntilEnd);
      }
    } catch (schedErr) {
      console.warn("Warning: scheduling auction start/end failed:", schedErr?.message || schedErr);
    }

    // 12) respond
    return res.status(201).json({
      success: true,
      message: `Auction created. Starts at ${startAt.toISOString()} and ends at ${endAt.toISOString()}.`,
      data: auction,
    });
  } catch (err) {
    // ensure temp file cleanup on errors
    try { if (req.file?.path) await fs.unlink(req.file.path).catch(() => { }); } catch (_) { }
    console.error("❌ createAuction error:", err);

    if (err.name === "ValidationError") {
      const errors = {};
      for (const k in err.errors) errors[k] = err.errors[k].message;
      return res.status(400).json({ success: false, message: "Auction validation failed", errors });
    }
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};







// Schedule auction end


// End auction and notify winner
// export const endAuctionAndNotifyWinner = async (auctionId) => {
//   try {
//     const auction = await Auction.findById(auctionId)
//       .populate("highestBidder", "name email")
//       .populate("createdBy", "name email");

//     if (!auction) return;

//     auction.status = "ended";
//     await auction.save();

//     if (auction.highestBidder) {
//       await Bid.findOneAndUpdate(
//         { auction: auctionId, bidder: auction.highestBidder._id, amount: auction.currentPrice },
//         { isWinningBid: true }
//       );

//       const paymentLink = await generatePaymentLink({
//         amount: auction.currentPrice,
//         auctionId: auction._id,
//         userId: auction.highestBidder._id,
//         productName: auction.productName,
//       });

//       // Send winner email immediately
//       await sendAuctionWinEmail(
//         auction.highestBidder.email,
//         auction.highestBidder.name,
//         auction.productName,
//         auction.currentPrice,
//         paymentLink
//       );

//       // Schedule payment reminder in 12 hours (or any time you want)
//       setTimeout(async () => {
//         await sendPaymentReminderEmail(
//           auction.highestBidder.email,
//           auction.highestBidder.name,
//           auction.productName,
//           auction.currentPrice,
//           paymentLink
//         );
//       }, 12 * 60 * 60 * 1000); // 12 hours

//       console.log(`🎉 Auction ended: ${auction.productName} - Winner: ${auction.highestBidder.name}`);
//     }

//     if (global.io) {
//       global.io.emit("auctionEnded", {
//         auctionId: auction._id,
//         winner: auction.highestBidder,
//         finalPrice: auction.currentPrice,
//       });
//     }
//   } catch (error) {
//     console.error("Error in endAuctionAndNotifyWinner:", error);
//   }
// };

// export const endAuctionAndNotifyWinner = async (auctionId) => {
//   try {
//     const auction = await Auction.findById(auctionId)
//       .populate("highestBidder", "name email")
//       .populate("createdBy", "name email");

//     if (!auction || auction.status === "ended") return;

//     auction.status = "ended";
//     await auction.save();

//     if (auction.highestBidder) {
//       const paymentLink = await generatePaymentLink({
//         amount: auction.currentPrice,
//         auctionId: auction._id,
//         userId: auction.highestBidder._id,
//         productName: auction.productName,
//       });

//       await sendAuctionWinEmail(
//         auction.highestBidder.email,
//         auction.highestBidder.name,
//         auction.productName,
//         auction.currentPrice,
//         paymentLink
//       );

//       setTimeout(async () => {
//         await sendPaymentReminderEmail(
//           auction.highestBidder.email,
//           auction.highestBidder.name,
//           auction.productName,
//           auction.currentPrice,
//           paymentLink
//         );
//       }, 12 * 60 * 60 * 1000); // 12-hour reminder

//       console.log(`✅ Auction ended: ${auction.productName}, Winner: ${auction.highestBidder.name}`);
//     } else {
//       console.log(`❌ Auction ${auction.productName} ended with no bids.`);
//     }

//     if (global.io) {
//       global.io.emit("auctionEnded", {
//         auctionId: auction._id,
//         winner: auction.highestBidder,
//         finalPrice: auction.currentPrice,
//       });
//     }
//   } catch (err) {
//     console.error("endAuctionAndNotifyWinner error:", err);
//   }
// };

// export const endAuctionAndNotifyWinner = async (auctionIdOrReq, res = null) => {
//   try {
//     let auctionId;

//     // Determine if called via HTTP request or cron/timeout
//     if (auctionIdOrReq?.params) {
//       auctionId = auctionIdOrReq.params.auctionId;
//     } else {
//       auctionId = auctionIdOrReq;
//     }

//     if (!auctionId) {
//       const msg = "Auction ID is required";
//       if (res) return res.status(400).json({ success: false, message: msg });
//       return console.log(msg);
//     }

//     // Fetch auction with populated users
//     const auction = await Auction.findById(auctionId)
//       .populate("highestBidder", "name email")
//       .populate("createdBy", "name email");

//     if (!auction) {
//       const msg = `Auction ${auctionId} not found`;
//       if (res) return res.status(404).json({ success: false, message: msg });
//       return console.log(msg);
//     }

//     if (auction.status === "ended") {
//       const msg = `Auction ${auction.productName} already ended`;
//       if (res) return res.status(400).json({ success: false, message: msg });
//       return console.log(msg);
//     }

//     // Mark auction as ended
//     auction.status = "ended";
//     await auction.save();

//     // If there is a highest bidder
//     if (auction.highestBidder) {
//       // Generate Razorpay payment link (or fallback)
//       const paymentLink = await generatePaymentLink({
//         amount: auction.currentPrice,
//         auctionId: auction._id,
//         userId: auction.highestBidder._id,
//         productName: auction.productName,
//       });

//       // Send winner email
//       await sendAuctionWinEmail(
//         auction.highestBidder.email,
//         auction.highestBidder.name,
//         auction.productName,
//         auction.currentPrice,
//         paymentLink
//       );

//       // Send reminder after 12 hours
//       setTimeout(async () => {
//         await sendPaymentReminderEmail(
//           auction.highestBidder.email,
//           auction.highestBidder.name,
//           auction.productName,
//           auction.currentPrice,
//           paymentLink
//         );
//       }, 12 * 60 * 60 * 1000); // 12 hours

//       // Socket broadcast
//       if (global.io) {
//         global.io.emit("auctionEnded", {
//           auctionId: auction._id,
//           winner: auction.highestBidder,
//           finalPrice: auction.currentPrice,
//         });
//       }

//       console.log(`✅ Auction ended: ${auction.productName}, Winner: ${auction.highestBidder.name}`);

//       if (res) {
//         return res.status(200).json({
//           success: true,
//           message: "Auction ended successfully and winner notified.",
//           winner: {
//             name: auction.highestBidder.name,
//             email: auction.highestBidder.email,
//             price: auction.currentPrice,
//             paymentLink,
//           },
//         });
//       }
//     } else {
//       console.log(`❌ Auction ${auction.productName} ended with no bids.`);

//       if (res) {
//         return res.status(200).json({
//           success: true,
//           message: "Auction ended. No bids were placed.",
//         });
//       }
//     }
//   } catch (err) {
//     console.error("endAuctionAndNotifyWinner error:", err);
//     if (res) {
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error while ending auction",
//         error: err.message,
//       });
//     }
//   }
// };

function toIntegerPaise(value) {
  // value may be paise (integer string/number) or rupees (string/number, maybe float)
  if (value == null) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  // Heuristics:
  // if it's a whole integer and > 1000, it is likely paise; but safer: treat as rupees if it's a float or < 1e6
  // Simpler: if value has decimal point or value < 100000 (i.e. < 1,000 rupees in paise?), assume rupees.
  // Safer approach: if n > 1e6 treat as paise; but we will decide:
  // If n > 100000 (₹1000 in paise) and is integer => could be paise, but we can't be 100% sure.
  // We'll use this rule:
  // - If n >= 1000 and Number.isInteger(n) -> treat as paise (some apps store paise big)
  // - Else treat as rupees -> paise = Math.round(n * 100)
  if (Number.isInteger(n) && n >= 1000) {
    // likely paise already
    return Math.round(n);
  }
  // else treat as rupees
  return Math.round(n * 100);
}

async function tryGeneratePaymentLinkWithRetries(payload, { attempts = 2, delayMs = 800 } = {}) {
  let lastErr = null;
  for (let i = 0; i < attempts; ++i) {
    try {
      const gp = await generatePaymentLink(payload);
      if (gp && gp.success) return gp;
      lastErr = gp?.error || new Error("Unknown generatePaymentLink failure");
      console.warn(`generatePaymentLink attempt ${i + 1} failed:`, lastErr);
    } catch (err) {
      lastErr = err;
      console.warn(`generatePaymentLink attempt ${i + 1} threw:`, err && (err.message || err));
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs));
  }
  return { success: false, error: lastErr && (lastErr.message || lastErr) || "generatePaymentLink failed" };
}



// export const endAuctionAndNotifyWinner = async (auctionIdOrReq, res = null) => {
//   try {
//     console.log("🟢 Auction End Started");

//     const auctionId =
//       auctionIdOrReq?.params?.auctionId ?? auctionIdOrReq;
//     if (!auctionId) throw new Error("Auction ID required");

//     const auction = await Auction.findById(auctionId)
//       .populate("highestBidder", "name email")
//       .populate({
//         path: "bids",
//         populate: { path: "bidder", select: "name email" },
//       });

//     if (!auction) throw new Error("Auction not found");
//     if (!auction.highestBidder?.email)
//       throw new Error("Winner email missing");

//     /* ---------------- FINAL PRICE ---------------- */
//     const bids = [...auction.bids].sort(
//       (a, b) => b.amountPaise - a.amountPaise
//     );

//     const finalPaise = auction.finalPricePaise ?? bids[0].amountPaise;

//     /* ---------------- SET PAYMENT WINDOW ---------------- */
//     const paymentDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000);

//     auction.status = "ended";
//     auction.pendingPaymentUntil = paymentDeadline;
//     await auction.save();

//     /* ---------------- PAYMENT LINK (WINNER) ---------------- */
//     const gp = await generatePaymentLink({
//       auctionId: auction._id.toString(),
//       userId: auction.highestBidder._id.toString(),
//       amountPaise: finalPaise,
//       productName: auction.productName,
//       depositPercent: auction.depositPercent,
//     });

//     /* ---------------- WINNER EMAIL ---------------- */
//     await sendAuctionWinEmail(
//       auction.highestBidder.email,
//       auction.highestBidder.name,
//       auction.productName,
//       finalPaise,
//       gp.depositPaise,
//       auction.depositPercent,
//       gp.amountDuePaise,
//       gp.frontendCheckoutUrl
//     );

//     console.log("✅ Winner email sent");

//     /* ---------------- LOST BIDDERS ---------------- */
//     const winnerId = auction.highestBidder._id.toString();
//     const notified = new Set([winnerId]);

//     for (const bid of bids) {
//       const bidder = bid.bidder;
//       if (!bidder) continue;

//       const id = bidder._id.toString();
//       if (notified.has(id)) continue;

//       notified.add(id);

//       await sendAuctionLostRefundEmail({
//         userEmail: bidder.email,
//         userName: bidder.name,
//         productName: auction.productName,
//         depositPaise: gp.depositPaise,
//       });

//       console.log("❌ Lost mail sent:", bidder.email);
//     }

//     console.log("🎉 Auction End Flow Complete");

//     res?.json({ success: true });
//   } catch (err) {
//     console.error("🔥 endAuction error:", err.message);
//     res?.status(500).json({ success: false, message: err.message });
//   }
// };

export const endAuctionAndNotifyWinner = async (auctionIdOrReq, res = null) => {
  try {
    console.log("🟢 Auction End Started");

    const auctionId =
      auctionIdOrReq?.params?.auctionId ?? auctionIdOrReq;
    if (!auctionId) throw new Error("Auction ID required");

    const auction = await Auction.findById(auctionId)
      .populate("highestBidder", "name email")
      .populate({
        path: "bids",
        populate: { path: "bidder", select: "name email" },
      });

    if (!auction) throw new Error("Auction not found");

    /* ---------------- SORT BIDS ---------------- */
    const bids = [...auction.bids].sort(
      (a, b) => b.amountPaise - a.amountPaise
    );

    if (!bids.length) throw new Error("No bids found");

    const winnerBid = bids[0];
    const secondBid = bids[1] || null;

    const finalPaise = winnerBid.amountPaise;

    /* ---------------- UPDATE AUCTION ---------------- */
    auction.status = "ended";
    auction.finalPricePaise = finalPaise;
    auction.pendingPaymentUntil = new Date(
      Date.now() + 48 * 60 * 60 * 1000
    );
    await auction.save();

    /* ---------------- PAYMENT LINK (WINNER) ---------------- */
    const gp = await generatePaymentLink({
      auctionId: auction._id.toString(),
      userId: winnerBid.bidder._id.toString(),
      amountPaise: finalPaise,
      productName: auction.productName,
      depositPercent: auction.depositPercent,
    });

    /* ---------------- WINNER EMAIL ---------------- */
    await sendAuctionWinEmail(
      winnerBid.bidder.email,
      winnerBid.bidder.name,
      auction.productName,
      finalPaise,
      gp.depositPaise,
      auction.depositPercent,
      gp.amountDuePaise,
      gp.frontendCheckoutUrl
    );

    console.log("✅ Winner mail sent");

    /* ---------------- LOST BIDDERS MAIL ---------------- */
    const notified = new Set([winnerBid.bidder._id.toString()]);

    for (const bid of bids.slice(1)) {
      const bidder = bid.bidder;
      if (!bidder) continue;

      const id = bidder._id.toString();
      if (notified.has(id)) continue;

      notified.add(id);

      await sendAuctionLostRefundEmail({
        userEmail: bidder.email,
        userName: bidder.name,
        productName: auction.productName,
        depositPaise: gp.depositPaise,
      });
    }

    console.log("❌ Lost bidder mails sent");

    /* ---------------- SECOND BIDDER MAIL ---------------- */
    if (secondBid?.bidder?.email) {
      await sendSecondBidderEmail({
        userEmail: secondBid.bidder.email,
        userName: secondBid.bidder.name,
        productName: auction.productName,
        finalPaise: secondBid.amountPaise,
        depositPaise: gp.depositPaise,
        depositPercent: auction.depositPercent,
        frontendCheckoutUrl: gp.frontendCheckoutUrl,
      });

      console.log("⭐ Second bidder mail sent");
    }

    res?.json({ success: true, message: "Auction ended successfully" });
  } catch (err) {
    console.error("🔥 Auction End Error:", err.message);
    res?.status(500).json({ success: false, message: err.message });
  }
};



export const placeBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1) Authentication check
    const user = req.user;
    if (!user) {
      await session.abortTransaction();
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // 2) Validate input
    const { auctionId } = req.body;
    if (!auctionId) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "auctionId required" });
    }

    // Normalize amount -> paise
    let amountPaise = null;
    if (req.body.amountPaise !== undefined && req.body.amountPaise !== null) {
      amountPaise = Number(req.body.amountPaise);
    } else if (req.body.amount !== undefined && req.body.amount !== null) {
      const rupees = Number(req.body.amount);
      if (Number.isNaN(rupees)) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: "Invalid amount (rupees)" });
      }
      amountPaise = Math.round(rupees * 100);
    } else {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "amount or amountPaise required" });
    }

    if (!Number.isInteger(amountPaise) || amountPaise <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid amountPaise" });
    }

    // 3) Load auction under session lock
    const auction = await Auction.findById(auctionId).session(session);
    if (!auction) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    // 4) Auction state validations
    if (auction.status && auction.status !== "live") {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: `Auction not live (status=${auction.status})` });
    }
    if (auction.endTime && new Date() > new Date(auction.endTime)) {
      auction.status = "ended";
      await auction.save({ session });
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Auction has ended" });
    }

    // 5) REQUIRE deposit paid before allowing bid (business rule)
    //    If you want bids without deposit, remove or change this check.
    const depositDoc = await Deposit.findOne({ user: user._id, auction: auctionId, status: "paid" }).session(session);
    if (!depositDoc) {
      await session.abortTransaction();
      return res.status(403).json({ success: false, message: "Security deposit required before bidding" });
    }

    // 6) Compute current price and increments in PAISE
    const currentPricePaise = auction.currentPricePaise ??
      (auction.currentPrice ? Math.round(Number(auction.currentPrice) * 100) : null) ??
      (auction.startingPricePaise ?? (auction.startingPrice ? Math.round(Number(auction.startingPrice) * 100) : 0));

    const minIncrementPaise = auction.minIncrementPaise ??
      (auction.minIncrement ? Math.round(Number(auction.minIncrement) * 100) : 100);

    const minAllowedPaise = (currentPricePaise || 0) + (minIncrementPaise || 0);

    if (amountPaise < minAllowedPaise) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Bid too low. Minimum next bid is ₹${(minAllowedPaise / 100).toLocaleString()}`,
        minNextBidPaise: minAllowedPaise
      });
    }

    // 7) Prevent same user from re-bidding as highest
    if (auction.highestBidder && auction.highestBidder.toString() === user._id.toString()) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "You are already the highest bidder" });
    }

    // 8) Create Bid document (includes amountPaise)
    const [bidDoc] = await Bid.create([{
      auction: auction._id,
      bidder: user._id,
      amountPaise,
      amount: amountPaise / 100, // convenience rupees
      placedAt: new Date()
    }], { session });

    // 9) Update Auction
    auction.currentPricePaise = amountPaise;
    auction.currentPrice = amountPaise / 100;
    auction.highestBidder = user._id;
    auction.bids = auction.bids || [];
    auction.bids.push(bidDoc._id);
    auction.bidsCount = auction.bids.length;
    auction.lastBidAt = new Date();
    await auction.save({ session });

    // 10) Commit and release session
    await session.commitTransaction();

    // 11) Populate auction to return to client
    const updatedAuction = await Auction.findById(auctionId)
      .populate("highestBidder", "name email")
      .populate({
        path: "bids",
        populate: { path: "bidder", select: "name email" },
        options: { sort: { placedAt: -1 } }
      });

    // 12) Socket emission if available
    const io = req.app?.get("io");
    if (io) {
      io.emit("auctionUpdated", updatedAuction);
      io.emit("newBid", {
        auctionId,
        bidder: { id: user._id, name: user.name || "Bidder" },
        amountPaise,
        time: new Date()
      });
    }

    return res.json({ success: true, message: "Bid placed successfully", data: updatedAuction });
  } catch (err) {
    await session.abortTransaction();
    console.error("placeBid error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Bid validation failed", error: err.message, details: err.errors });
    }
    return res.status(500).json({ success: false, message: "Server error placing bid", error: err.message });
  } finally {
    session.endSession();
  }
};



// GET AUCTION WITH PROPER BIDDING LOGIC
export const getAuction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid id" });

    const auction = await Auction.findById(id)
      .populate("highestBidder", "name email")
      .populate("createdBy", "name email")
      .populate({
        path: "bids",
        populate: { path: "bidder", select: "name email" },
        options: { sort: { placedAt: -1 } },
      });

    if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });

    // normalize various field name possibilities
    const endAt = auction.endAt ?? auction.endTime ?? null;
    const startAt = auction.startAt ?? auction.startTime ?? null;

    // current price: support paise and rupees naming
    const currentPricePaise = (auction.currentPricePaise ?? (auction.currentPrice != null ? Math.round(Number(auction.currentPrice) * 100) : null)) ?? 0;
    const minIncrementPaise = (auction.minIncrementPaise ?? (auction.minIncrement != null ? Math.round(Number(auction.minIncrement) * 100) : null)) ?? 100; // default ₹1 => 100 paise

    const now = new Date();
    const endDate = endAt ? new Date(endAt) : null;
    const timeRemainingMs = endDate ? Math.max(0, endDate.getTime() - now.getTime()) : null;

    const derivedStatus = deriveStatus(startAt, endAt);

    // next minimum bid in paise
    const minNextBidPaise = currentPricePaise + minIncrementPaise;

    const auctionData = {
      ...auction.toObject(),
      startAt: startAt,
      endAt: endAt,
      derivedStatus,
      timeRemaining: timeRemainingMs, // milliseconds (nullable)
      timeRemainingStr: timeRemainingMs != null ? msToHMS(timeRemainingMs) : null,
      currentPricePaise,
      minIncrementPaise,
      minNextBidPaise,
    };

    return res.json({ success: true, data: auctionData });
  } catch (err) {
    console.error("getAuction err", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * GET /api/auction/all
 * Returns list of auctions with computed fields.
 * Query params:
 *  - page (default 1)
 *  - limit (default 20)
 *  - status (optional) -> live|upcoming|ended
 */
export const getAllAuctions = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const statusFilter = req.query.status; // optional

    // Base find — no filters (we'll compute status per doc). But if user requested a status, we can filter by time ranges.
    const now = Date.now();
    const findQuery = {};

    if (statusFilter === "live") {
      // startAt <= now < endAt OR startAt null and endAt > now
      findQuery.$and = [
        { $or: [{ startAt: { $lte: new Date(now) } }, { startAt: { $exists: false } }, { startAt: null }] },
        { $or: [{ endAt: { $gt: new Date(now) } }, { endAt: { $exists: false } }, { endAt: null }] },
      ];
    } else if (statusFilter === "upcoming") {
      findQuery.startAt = { $gt: new Date(now) };
    } else if (statusFilter === "ended") {
      findQuery.endAt = { $lte: new Date(now) };
    }

    const [total, docs] = await Promise.all([
      Auction.countDocuments(findQuery),
      Auction.find(findQuery)
        .sort({ startAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("highestBidder", "name email")
        .populate("createdBy", "name email")
        .populate({
          path: "bids",
          populate: { path: "bidder", select: "name email" },
          options: { sort: { placedAt: -1 } },
        }),
    ]);

    const results = docs.map((auction) => {
      const endAt = auction.endAt ?? auction.endTime ?? null;
      const startAt = auction.startAt ?? auction.startTime ?? null;

      const currentPricePaise = (auction.currentPricePaise ?? (auction.currentPrice != null ? Math.round(Number(auction.currentPrice) * 100) : null)) ?? 0;
      const minIncrementPaise = (auction.minIncrementPaise ?? (auction.minIncrement != null ? Math.round(Number(auction.minIncrement) * 100) : null)) ?? 100;

      const timeRemainingMs = endAt ? Math.max(0, new Date(endAt).getTime() - Date.now()) : null;
      const derivedStatus = deriveStatus(startAt, endAt);
      const minNextBidPaise = currentPricePaise + minIncrementPaise;

      return {
        ...auction.toObject(),
        startAt,
        endAt,
        derivedStatus,
        timeRemaining: timeRemainingMs,
        timeRemainingStr: timeRemainingMs != null ? msToHMS(timeRemainingMs) : null,
        currentPricePaise,
        minIncrementPaise,
        minNextBidPaise,
      };
    });

    return res.json({
      success: true,
      meta: { total, page, limit },
      data: results,
    });
  } catch (err) {
    console.error("getAllAuctions err", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


// LIST AUCTIONS WITH TIME REMAINING
export const listAuctions = async (req, res) => {
  try {
    const { status = "all", page = 1, limit = 20 } = req.query;

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.min(200, Math.max(1, parseInt(limit, 10) || 20));

    // Build time-based query if a specific status requested.
    // Otherwise fetch all auctions (no isActive filter) to show "sare auction".
    const findQuery = {};

    const now = new Date();

    if (status && status !== "all") {
      if (status === "live") {
        // startAt <= now (or missing) AND endAt > now (or missing)
        findQuery.$and = [
          { $or: [{ startAt: { $lte: now } }, { startAt: { $exists: false } }, { startAt: null }] },
          { $or: [{ endAt: { $gt: now } }, { endAt: { $exists: false } }, { endAt: null }] },
        ];
      } else if (status === "upcoming") {
        findQuery.startAt = { $gt: now };
      } else if (status === "ended") {
        findQuery.endAt = { $lte: now };
      }
    }

    // Fetch documents with pagination and required populates
    const [total, auctions] = await Promise.all([
      Auction.countDocuments(findQuery),
      Auction.find(findQuery)
        .sort({ startAt: -1, createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .populate("highestBidder", "name email")
        .populate("createdBy", "name email")
        .populate({
          path: "bids",
          populate: { path: "bidder", select: "name email" },
          options: { sort: { placedAt: -1 }, limit: 5 }
        })
        .lean()
    ]);

    // Map and compute derived fields (handle various naming possibilities)
    const auctionsWithTime = auctions.map((auction) => {
      // tolerate alternate field names
      const endAt = auction.endAt ?? auction.endTime ?? null;
      const startAt = auction.startAt ?? auction.startTime ?? null;

      // current price: prefer paise naming; if rupees present convert to paise
      let currentPricePaise = 0;
      if (auction.currentPricePaise != null) {
        currentPricePaise = Number(auction.currentPricePaise);
      } else if (auction.currentPrice != null) {
        // convert rupees -> paise
        const rupees = Number(auction.currentPrice);
        currentPricePaise = Number.isFinite(rupees) ? Math.round(rupees * 100) : 0;
      } else if (auction.startingPricePaise != null) {
        currentPricePaise = Number(auction.startingPricePaise);
      } else if (auction.startingPrice != null) {
        const rupees = Number(auction.startingPrice);
        currentPricePaise = Number.isFinite(rupees) ? Math.round(rupees * 100) : 0;
      }

      // min increment: prefer paise naming else rupees -> paise, default ₹1 => 100 paise
      let minIncrementPaise = 100;
      if (auction.minIncrementPaise != null) {
        minIncrementPaise = Number(auction.minIncrementPaise);
      } else if (auction.minIncrement != null) {
        const mr = Number(auction.minIncrement);
        minIncrementPaise = Number.isFinite(mr) ? Math.max(0, Math.round(mr * 100)) : 100;
      }

      // time remaining (ms)
      const timeRemaining = endAt ? Math.max(0, new Date(endAt).getTime() - Date.now()) : null;
      const timeRemainingStr = timeRemaining != null ? msToHMS(timeRemaining) : null;

      // derived status
      const derivedStatus = deriveStatus(startAt, endAt);

      // next minimum bid in paise
      const minNextBidPaise = currentPricePaise + minIncrementPaise;

      return {
        ...auction,
        startAt,
        endAt,
        timeRemaining,
        timeRemainingStr,
        derivedStatus,
        currentPricePaise,
        minIncrementPaise,
        minNextBidPaise,
      };
    });

    return res.status(200).json({
      success: true,
      meta: { page: currentPage, limit: perPage, total },
      data: auctionsWithTime,
    });
  } catch (err) {
    console.error("listAuctions err:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};



// UPDATE AUCTION
export const updateAuction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid auction id' });

    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    const { productName, productDescription, productImage, startingPrice, durationHours, minIncrement } = req.body;

    if (productName) auction.productName = productName;
    if (productDescription) auction.productDescription = productDescription;
    if (productImage) auction.productImage = productImage;
    if (startingPrice) {
      auction.startingPrice = startingPrice;
      if (!auction.currentPrice || auction.currentPrice < startingPrice) auction.currentPrice = startingPrice;
    }
    if (minIncrement) auction.minIncrement = Number(minIncrement);

    if (durationHours) {
      auction.duration = Number(durationHours);
      auction.endTime = new Date(auction.startAt.getTime() + auction.duration * 60 * 60 * 1000);
    }

    await auction.save();
    return res.json({ success: true, data: auction });
  } catch (err) {
    console.error('updateAuction err', err);
    return res.status(500).json({ message: err.message });
  }
};

// DELETE AUCTION
export const deleteAuction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const deleted = await Auction.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!deleted) return res.status(404).json({ message: 'Auction not found' });

    return res.json({ success: true, message: 'Auction deleted' });
  } catch (err) {
    console.error('deleteAuction err', err);
    return res.status(500).json({ message: err.message });
  }
};

// LIST BIDS
export const listBids = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    const bids = await Bid.find({ auction: id })
      .sort({ placedAt: -1 })
      .populate('bidder', 'name email');

    return res.json({ success: true, data: bids });
  } catch (err) {
    console.error('listBids err', err);
    return res.status(500).json({ message: err.message });
  }
};

// MANUALLY END AUCTION
export const endAuction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid auction id' });

    await endAuctionAndNotifyWinner(id);

    return res.json({ success: true, message: 'Auction ended successfully' });
  } catch (err) {
    console.error('endAuction err', err);
    return res.status(500).json({ message: err.message });
  }
};

// GET WINNER DETAILS
export const getAuctionWinner = async (req, res) => {
  try {
    const { id } = req.params;

    const auction = await Auction.findById(id)
      .populate('highestBidder', 'name email phone')
      .populate({
        path: 'bids',
        match: { isWinningBid: true },
        populate: { path: 'bidder', select: 'name email' }
      });

    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }

    if (!auction.highestBidder) {
      return res.json({ success: true, data: null, message: 'No winner for this auction' });
    }

    res.json({
      success: true,
      data: {
        winner: auction.highestBidder,
        winningBid: auction.currentPrice,
        product: auction.productName,
        auctionEnded: auction.endTime
      }
    });

  } catch (error) {
    console.error('Get winner error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const startAuction = async (req, res) => {
  try {
    const { itemId, startTime, endTime } = req.body;

    // You can replace this with your actual Auction model logic
    // Example: creating a new auction or updating an item status
    // const auction = await Auction.create({ itemId, startTime, endTime, status: "active" });

    console.log("Auction started for item:", itemId);
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);

    res.status(200).json({
      success: true,
      message: "Auction started successfully",
      auction: {
        itemId,
        startTime,
        endTime,
        status: "active",
      },
    });
  } catch (error) {
    console.error("Error starting auction:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start auction",
      error: error.message,
    });
  }
};
