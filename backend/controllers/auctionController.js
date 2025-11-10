// // // controllers/auction.controller.js
// // // ES module style (type: "module")
// // // Auction admin + user controllers including a HTTP fallback for placing bids.
// // // Expects:
// // //  - req.user set by auth middleware
// // //  - models: ../models/auction.model.js, ../models/bid.model.js, ../models/user.model.js
// // //  - optional Socket.IO server attached as req.app.get('io') to broadcast events
// // //
// // // Important: real-time placeBid should be done via Socket.IO (see sockets/auction.socket.js).
// // // This file provides an HTTP fallback endpoint `placeBid` that performs atomic update
// // // and emits the same events if an `io` instance exists on req.app.
// // //
// // // Anti-sniping extension uses process.env.ANTI_SNIPING_SECONDS or defaults to 15 seconds.

// // import Auction from '../models/auctionModel.js';
// // import Bid from '../models/bidModel.js';
// // import mongoose from 'mongoose';
// // import fs from "fs";
// // import { v2 as cloudinary } from "cloudinary";
// // import dotenv from "dotenv";
// // import schedule from "node-schedule"; // <== Add this for scheduled jobs

// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// //   secure: true,
// // });


// // function emitEvent(req, event, payload) {
// //   try {
// //     const io = req?.app?.get?.('io');
// //     if (io) {
// //       const nsp = io.of('/auction');
// //       nsp.emit(event, payload);
// //       if (payload && payload.auctionId) nsp.to(payload.auctionId).emit(event, payload);
// //     }
// //   } catch (err) {
// //     console.error('emitEvent error', err);
// //   }
// // }




// // export const createAuction = async (req, res) => {
// //   try {
// //     if (!req.file)
// //       return res.status(400).json({ message: "Product image is required" });

// //     // Upload image to Cloudinary
// //     const result = await cloudinary.uploader.upload(req.file.path, {
// //       folder: "auctions",
// //       resource_type: "image",
// //     });

// //     const {
// //       productName,
// //       productDescription,
// //       startingPrice,
// //       durationMinutes,
// //       minIncrement,
// //       startAt,
// //     } = req.body;

// //     if (!productName || !startingPrice)
// //       return res
// //         .status(400)
// //         .json({ message: "productName and startingPrice required" });

// //     const duration = Number(durationMinutes ?? 5);
// //     const minInc = Number(minIncrement ?? 1);

// //     // Convert to Date
// //     const now = new Date();
// //     const start = startAt ? new Date(startAt) : now;
// //     const end = new Date(start.getTime() + duration * 60 * 1000);

// //     // Determine status (live or upcoming)
// //     const status = start > now ? "upcoming" : "live";

// //     const auction = await Auction.create({
// //       productName,
// //       productDescription,
// //       productImage: result.secure_url,
// //       startingPrice,
// //       currentPrice: startingPrice,
// //       highestBidder: null,
// //       duration,
// //       startTime: start,
// //       endTime: end,
// //       createdBy: req.user?._id || null,
// //       status,
// //       minIncrement: minInc,
// //     });

// //     // Send live update (if immediately live)
// //     if (status === "live") {
// //       emitEvent(req, "auctionStarted", { auction });
// //     }

// //     // ✅ Schedule automatic start
// //     if (status === "upcoming") {
// //       schedule.scheduleJob(start, async () => {
// //         await Auction.findByIdAndUpdate(auction._id, { status: "live" });
// //         emitEvent(req, "auctionStarted", { auctionId: auction._id });
// //         console.log(`⏰ Auction started: ${auction.productName}`);
// //       });
// //     }

// //     // ✅ Schedule automatic end
// //     schedule.scheduleJob(end, async () => {
// //       await Auction.findByIdAndUpdate(auction._id, { status: "ended" });
// //       emitEvent(req, "auctionEnded", { auctionId: auction._id });
// //       console.log(`✅ Auction ended: ${auction.productName}`);
// //     });

// //     return res.status(201).json({
// //       success: true,
// //       message:
// //         status === "upcoming"
// //           ? `Auction scheduled to start at ${start.toLocaleString()}`
// //           : "Auction started immediately",
// //       data: auction,
// //     });
// //   } catch (err) {
// //     console.error("createAuction err:", err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };








// // /**
// //  * Admin: update auction
// //  * params: id
// //  * body: any updatable fields: productName, productDescription, productImage, startingPrice, durationMinutes, minIncrement, startAt, startNow (bool), status
// //  */
// // export const updateAuction = async (req, res) => {
// //   try {
// //     // if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid auction id' });

// //     const auction = await Auction.findById(id);
// //     if (!auction) return res.status(404).json({ message: 'Auction not found' });

// //     const {
// //       productName,
// //       productDescription,
// //       productImage,
// //       startingPrice,
// //       durationMinutes,
// //       minIncrement,
// //       startAt,
// //       startNow,
// //       status
// //     } = req.body;

// //     if (productName) auction.productName = productName;
// //     if (productDescription) auction.productDescription = productDescription;
// //     if (productImage) auction.productImage = productImage;
// //     if (typeof startingPrice === 'number') {
// //       auction.startingPrice = startingPrice;
// //       // if currentPrice lower than startingPrice, bump it (careful in production)
// //       if (!auction.currentPrice || auction.currentPrice < startingPrice) auction.currentPrice = startingPrice;
// //     }
// //     if (typeof minIncrement !== 'undefined') auction.minIncrement = Number(minIncrement);

// //     // update startAt/duration/endTime logic
// //     if (startAt) {
// //       const start = new Date(startAt);
// //       auction.startAt = start;
// //       const dur = Number(durationMinutes ?? auction.duration ?? process.env.DEFAULT_AUCTION_MINUTES ?? 5);
// //       auction.duration = dur;
// //       auction.endTime = new Date(start.getTime() + dur * 60 * 1000);
// //     } else if (durationMinutes) {
// //       auction.duration = Number(durationMinutes);
// //       // recalc endTime based on current startAt or now if startNow
// //       const startBase = auction.startAt ? new Date(auction.startAt) : new Date();
// //       auction.endTime = new Date(startBase.getTime() + auction.duration * 60 * 1000);
// //     }

// //     if (startNow === true) {
// //       auction.startAt = new Date();
// //       auction.endTime = new Date(Date.now() + (auction.duration ?? Number(process.env.DEFAULT_AUCTION_MINUTES ?? 5)) * 60 * 1000);
// //       auction.status = 'live';
// //     }

// //     if (status) auction.status = status;

// //     await auction.save();

// //     emitEvent(req, 'auctionUpdated', { auction, auctionId: auction._id.toString() });

// //     return res.json(auction);
// //   } catch (err) {
// //     console.error('updateAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // /**
// //  * Admin: delete auction
// //  */
// // export const deleteAuction = async (req, res) => {
// //   try {
// //     // if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

// //     const deleted = await Auction.findByIdAndDelete(id);
// //     if (!deleted) return res.status(404).json({ message: 'Not found' });

// //     // optionally delete bids
// //     await Bid.deleteMany({ auction: id }).catch(() => {});

// //     emitEvent(req, 'auctionDeleted', { auctionId: id });

// //     return res.json({ message: 'Deleted' });
// //   } catch (err) {
// //     console.error('deleteAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // /**
// //  * Public: get auction by id
// //  */
// // export const getAuction = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

// //     const auction = await Auction.findById(id)
// //       .populate('highestBidder', 'name email photo')
// //       .populate('createdBy', 'name email');

// //     if (!auction) return res.status(404).json({ message: 'Not found' });

// //     return res.json(auction);
// //   } catch (err) {
// //     console.error('getAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // /**
// //  * Public: list auctions with optional query filters
// //  * query: status (live/upcoming/ended), page, limit
// //  */
// // export const listAuctions = async (req, res) => {
// //   try {
// //     const { status, page = 1, limit = 20 } = req.query;

// //     // Build query object dynamically
// //     const query = {};
// //     if (status) query.status = status;

// //     // Parse pagination safely
// //     const currentPage = Math.max(1, parseInt(page, 10));
// //     const perPage = Math.min(200, Math.max(1, parseInt(limit, 10)));

// //     // Fetch auctions with pagination
// //     const auctions = await Auction.find(query)
// //       .sort({ startAt: 1 })
// //       .skip((currentPage - 1) * perPage)
// //       .limit(perPage)
// //       .populate("highestBidder", "name email") // include relevant bidder fields
// //       .lean();

// //     // Count total documents for pagination meta
// //     const total = await Auction.countDocuments(query);

// //     // ✅ Uniform API response structure for frontend
// //     return res.status(200).json({
// //       success: true,
// //       meta: {
// //         page: currentPage,
// //         limit: perPage,
// //         total,
// //       },
// //       data: auctions,
// //     });
// //   } catch (err) {
// //     console.error("listAuctions error:", err);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Failed to fetch auctions",
// //       error: err.message,
// //     });
// //   }
// // };

// // /**
// //  * Public/Admin: list bids for an auction
// //  */
// // export const listBids = async (req, res) => {
// //   try {
// //     const { id } = req.params; // auction id
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

// //     const auction = await Auction.findById(id);
// //     if (!auction) return res.status(404).json({ message: 'Auction not found' });

// //     // we store bids embedded in auction.bids or separately - support both
// //     if (Array.isArray(auction.bids) && auction.bids.length > 0) {
// //       // return embedded bids most recent first
// //       const bids = auction.bids.slice().sort((a, b) => b.time - a.time);
// //       return res.json(bids);
// //     }

// //     // fallback: separate Bid collection
// //     const bids = await Bid.find({ auction: id }).sort({ placedAt: -1 }).limit(1000).populate('bidder', 'name email');
// //     return res.json(bids);
// //   } catch (err) {
// //     console.error('listBids err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // /**
// //  * Admin action: force start an auction (makes status 'live' and schedules endTime)
// //  */
// // export const startAuction = async (req, res) => {
// //   try {
// //     // if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

// //     const auction = await Auction.findById(id);
// //     if (!auction) return res.status(404).json({ message: 'Not found' });

// //     if (auction.status === 'live') return res.status(400).json({ message: 'Already live' });

// //     auction.status = 'live';
// //     auction.startAt = new Date();
// //     auction.endTime = new Date(Date.now() + (auction.duration ?? Number(process.env.DEFAULT_AUCTION_MINUTES ?? 5)) * 60 * 1000);

// //     await auction.save();

// //     emitEvent(req, 'auctionStarted', { auctionId: auction._id.toString(), auction });

// //     return res.json(auction);
// //   } catch (err) {
// //     console.error('startAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // /**
// //  * Admin action: force end an auction (finalize winner)
// //  */
// // export const endAuction = async (req, res) => {
// //   try {
// //     // if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

// //     const auction = await Auction.findById(id);
// //     if (!auction) return res.status(404).json({ message: 'Not found' });

// //     if (auction.status === 'ended') return res.status(400).json({ message: 'Already ended' });

// //     auction.status = 'ended';
// //     await auction.save();

// //     // Optionally, you may want to create a Bid record for highestBidder or persist sale metadata.
// //     emitEvent(req, 'auctionEnded', { auctionId: auction._id.toString(), finalPrice: auction.currentPrice, winner: auction.highestBidder });

// //     return res.json({ message: 'Auction ended', auction });
// //   } catch (err) {
// //     console.error('endAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // /**
// //  * HTTP fallback: place bid (primary should be via Socket.IO)
// //  * body: { auctionId, amount }
// //  *
// //  * This uses findOneAndUpdate with condition currentPrice < amount to reduce race conditions.
// //  * It updates currentPrice, highestBidder, increments bidsCount and saves a Bid document.
// //  * It also applies anti-sniping extension using process.env.ANTI_SNIPING_SECONDS (default 15).
// //  */
// // export const placeBid = async (req, res) => {
// //   try {
// //     // require authenticated user
// //     if (!req.user) return res.status(401).json({ message: 'Authentication required to bid' });

// //     const { auctionId, amount } = req.body;
// //     if (!auctionId || typeof amount !== 'number') return res.status(400).json({ message: 'auctionId and numeric amount required' });
// //     if (!mongoose.isValidObjectId(auctionId)) return res.status(400).json({ message: 'Invalid auction id' });

// //     const auction = await Auction.findById(auctionId);
// //     if (!auction) return res.status(404).json({ message: 'Auction not found' });

// //     if (auction.status !== 'live') return res.status(400).json({ message: 'Auction not live' });

// //     const base = auction.currentPrice ?? auction.startingPrice ?? 0;
// //     const minAllowed = base + (auction.minIncrement ?? 1);
// //     if (amount < minAllowed) return res.status(400).json({ message: 'Amount too low', minAllowed });

// //     // Atomic update: set new currentPrice only if currentPrice < amount and status is live
// //     const now = new Date();
// //     const updated = await Auction.findOneAndUpdate(
// //       { _id: auctionId, currentPrice: { $lt: amount }, status: 'live' },
// //       {
// //         $set: {
// //           currentPrice: amount,
// //           highestBidder: req.user._id,
// //           updatedAt: now
// //         },
// //         $inc: { bidsCount: 1 },
// //         $push: { bids: { user: req.user._id, amount, time: now } } // maintain embedded history too
// //       },
// //       { new: true, useFindAndModify: false }
// //     );

// //     if (!updated) {
// //       // currentPrice was already >= amount or auction no longer live
// //       const fresh = await Auction.findById(auctionId);
// //       return res.status(409).json({ message: 'Outbid or invalid', minAllowed: (fresh.currentPrice ?? fresh.startingPrice) + (fresh.minIncrement ?? 1) });
// //     }

// //     // persist bid in separate collection too
// //     const bid = await Bid.create({ auction: auctionId, bidder: req.user._id, amount });

// //     // broadcast new highest bid
// //     const payload = { auctionId, amount, bidder: req.user._id.toString(), placedAt: bid.placedAt || bid.createdAt || now };
// //     emitEvent(req, 'newHighestBid', payload);

// //     // Anti-sniping: extend auction endTime if remaining <= antiSeconds
// //     const antiSeconds = Number(process.env.ANTI_SNIPING_SECONDS ?? 15);
// //     const remainingMs = new Date(updated.endTime) - new Date();
// //     if (remainingMs <= antiSeconds * 1000) {
// //       updated.endTime = new Date(Date.now() + antiSeconds * 1000);
// //       await updated.save();

// //       emitEvent(req, 'auctionExtended', { auctionId, newEndAt: updated.endTime });
// //     }

// //     return res.json({ message: 'Bid accepted', bid, auction: updated });
// //   } catch (err) {
// //     console.error('placeBid err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // controllers/auctionController.js
// // import Auction from '../models/auctionModel.js';
// // import Bid from '../models/bidModel.js';
// // import mongoose from 'mongoose';
// // import { v2 as cloudinary } from "cloudinary";
// // import schedule from "node-schedule";
// // import dotenv from "dotenv";
// // dotenv.config();

// // // Cloudinary config
// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// //   secure: true,
// // });

// // // Socket.IO emit helper
// // function emitEvent(req, event, payload) {
// //   try {
// //     const io = req?.app?.get?.('io');
// //     if (!io) return;

// //     const nsp = io.of('/auction');
// //     nsp.emit(event, payload);

// //     if (payload?.auctionId) nsp.to(payload.auctionId).emit(event, payload);
// //   } catch (err) {
// //     console.error('emitEvent error', err);
// //   }
// // }

// // // ------------------- CONTROLLERS -------------------

// // // CREATE AUCTION
// // export const createAuction = async (req, res) => {
// //   try {
// //     if (!req.file) return res.status(400).json({ message: "Product image required" });

// //     const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "auctions" });

// //     const {
// //       productName, productDescription, startingPrice,
// //       durationMinutes, minIncrement, startAt
// //     } = req.body;

// //     if (!productName || !startingPrice) return res.status(400).json({ message: "productName & startingPrice required" });

// //     const duration = Number(durationMinutes ?? 5);
// //     const minInc = Number(minIncrement ?? 1);
// //     const now = new Date();
// //     const start = startAt ? new Date(startAt) : now;
// //     const end = new Date(start.getTime() + duration * 60 * 1000);
// //     const status = start > now ? "upcoming" : "live";

// //     const auction = await Auction.create({
// //       productName,
// //       productDescription,
// //       productImage: uploadResult.secure_url,
// //       startingPrice,
// //       currentPrice: startingPrice,
// //       highestBidder: null,
// //       duration,
// //       startAt: start,
// //       endTime: end,
// //       createdBy: req.user?._id || null,
// //       status,
// //       minIncrement: minInc,
// //     });

// //     if (status === "live") emitEvent(req, "auctionStarted", { auction });

// //     if (status === "upcoming") {
// //       schedule.scheduleJob(start, async () => {
// //         await Auction.findByIdAndUpdate(auction._id, { status: "live" });
// //         emitEvent(req, "auctionStarted", { auctionId: auction._id.toString() });
// //       });
// //     }

// //     schedule.scheduleJob(end, async () => {
// //       await Auction.findByIdAndUpdate(auction._id, { status: "ended" });
// //       emitEvent(req, "auctionEnded", { auctionId: auction._id.toString() });
// //     });

// //     return res.status(201).json({
// //       success: true,
// //       message: status === "upcoming" ? `Auction scheduled at ${start.toLocaleString()}` : "Auction started immediately",
// //       data: auction,
// //     });
// //   } catch (err) {
// //     console.error("createAuction err:", err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // // UPDATE AUCTION
// // export const updateAuction = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid auction id' });

// //     const auction = await Auction.findById(id);
// //     if (!auction) return res.status(404).json({ message: 'Auction not found' });

// //     const {
// //       productName, productDescription, productImage, startingPrice,
// //       durationMinutes, minIncrement, startAt, startNow, status
// //     } = req.body;

// //     if (productName) auction.productName = productName;
// //     if (productDescription) auction.productDescription = productDescription;
// //     if (productImage) auction.productImage = productImage;
// //     if (startingPrice) {
// //       auction.startingPrice = startingPrice;
// //       if (!auction.currentPrice || auction.currentPrice < startingPrice) auction.currentPrice = startingPrice;
// //     }
// //     if (minIncrement) auction.minIncrement = Number(minIncrement);

// //     if (startAt) {
// //       const start = new Date(startAt);
// //       auction.startAt = start;
// //       const dur = Number(durationMinutes ?? auction.duration ?? 5);
// //       auction.duration = dur;
// //       auction.endTime = new Date(start.getTime() + dur * 60 * 1000);
// //     } else if (durationMinutes) {
// //       auction.duration = Number(durationMinutes);
// //       const startBase = auction.startAt ?? new Date();
// //       auction.endTime = new Date(startBase.getTime() + auction.duration * 60 * 1000);
// //     }

// //     if (startNow) {
// //       auction.startAt = new Date();
// //       auction.endTime = new Date(Date.now() + (auction.duration ?? 5) * 60 * 1000);
// //       auction.status = 'live';
// //     }

// //     if (status) auction.status = status;

// //     await auction.save();
// //     emitEvent(req, 'auctionUpdated', { auction, auctionId: auction._id.toString() });

// //     return res.json(auction);
// //   } catch (err) {
// //     console.error('updateAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // // DELETE AUCTION
// // export const deleteAuction = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

// //     const deleted = await Auction.findByIdAndDelete(id);
// //     if (!deleted) return res.status(404).json({ message: 'Not found' });

// //     await Bid.deleteMany({ auction: id }).catch(() => {});
// //     emitEvent(req, 'auctionDeleted', { auctionId: id });
// //     return res.json({ message: 'Deleted' });
// //   } catch (err) {
// //     console.error('deleteAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // // GET AUCTION
// // export const getAuction = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

// //     const auction = await Auction.findById(id)
// //       .populate('highestBidder', 'name email photo')
// //       .populate('createdBy', 'name email');

// //     if (!auction) return res.status(404).json({ message: 'Not found' });
// //     return res.json(auction);
// //   } catch (err) {
// //     console.error('getAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // // LIST AUCTIONS
// // export const listAuctions = async (req, res) => {
// //   try {
// //     const { status, page = 1, limit = 20 } = req.query;

// //     const query = {};
// //     if (status) query.status = status;

// //     const currentPage = Math.max(1, parseInt(page, 10));
// //     const perPage = Math.min(200, Math.max(1, parseInt(limit, 10)));

// //     const auctions = await Auction.find(query)
// //       .sort({ startAt: 1 })
// //       .skip((currentPage - 1) * perPage)
// //       .limit(perPage)
// //       .populate('highestBidder', 'name email')
// //       .lean();

// //     const total = await Auction.countDocuments(query);

// //     return res.status(200).json({ success: true, meta: { page: currentPage, limit: perPage, total }, data: auctions });
// //   } catch (err) {
// //     console.error("listAuctions error:", err);
// //     return res.status(500).json({ success: false, message: "Failed to fetch auctions", error: err.message });
// //   }
// // };

// // // LIST BIDS
// // export const listBids = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

// //     const auction = await Auction.findById(id);
// //     if (!auction) return res.status(404).json({ message: 'Auction not found' });

// //     const bids = await Bid.find({ auction: id }).sort({ placedAt: -1 }).populate('bidder', 'name email');
// //     return res.json(bids);
// //   } catch (err) {
// //     console.error('listBids err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // // START AUCTION
// // export const startAuction = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

// //     const auction = await Auction.findById(id);
// //     if (!auction) return res.status(404).json({ message: 'Not found' });
// //     if (auction.status === 'live') return res.status(400).json({ message: 'Already live' });

// //     auction.status = 'live';
// //     auction.startAt = new Date();
// //     auction.endTime = new Date(Date.now() + (auction.duration ?? 5) * 60 * 1000);
// //     await auction.save();

// //     emitEvent(req, 'auctionStarted', { auctionId: id });
// //     return res.json({ message: 'Auction started', auction });
// //   } catch (err) {
// //     console.error('startAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // // END AUCTION
// // export const endAuction = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

// //     const auction = await Auction.findById(id);
// //     if (!auction) return res.status(404).json({ message: 'Not found' });

// //     auction.status = 'ended';
// //     await auction.save();

// //     emitEvent(req, 'auctionEnded', { auctionId: id });
// //     return res.json({ message: 'Auction ended', auction });
// //   } catch (err) {
// //     console.error('endAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // // PLACE BID (fallback HTTP route)
// // export const placeBid = async (req, res) => {
// //   try {
// //     if (!req.user) return res.status(401).json({ message: 'Authentication required' });

// //     const { auctionId, amount } = req.body;
// //     if (!auctionId || typeof amount !== 'number') return res.status(400).json({ message: 'auctionId & numeric amount required' });
// //     if (!mongoose.isValidObjectId(auctionId)) return res.status(400).json({ message: 'Invalid auction id' });

// //     const auction = await Auction.findById(auctionId);
// //     if (!auction) return res.status(404).json({ message: 'Auction not found' });
// //     if (auction.status !== 'live') return res.status(400).json({ message: 'Auction not live' });

// //     const minAllowed = (auction.currentPrice ?? auction.startingPrice) + (auction.minIncrement ?? 1);
// //     if (amount < minAllowed) return res.status(400).json({ message: 'Amount too low', minAllowed });

// //     const now = new Date();
// //     const updated = await Auction.findOneAndUpdate(
// //       { _id: auctionId, currentPrice: { $lt: amount }, status: 'live' },
// //       { $set: { currentPrice: amount, highestBidder: req.user._id, updatedAt: now }, $inc: { bidsCount: 1 }, $push: { bids: { user: req.user._id, amount, time: now } } },
// //       { new: true, useFindAndModify: false }
// //     );

// //     if (!updated) return res.status(409).json({ message: 'Outbid or invalid', minAllowed: minAllowed });

// //     const bid = await Bid.create({ auction: auctionId, bidder: req.user._id, amount });
// //     emitEvent(req, 'newHighestBid', { auctionId, amount, bidder: req.user._id.toString(), placedAt: bid.placedAt || now });

// //     const antiSeconds = Number(process.env.ANTI_SNIPING_SECONDS ?? 15);
// //     const remainingMs = new Date(updated.endTime) - new Date();
// //     if (remainingMs <= antiSeconds * 1000) {
// //       updated.endTime = new Date(Date.now() + antiSeconds * 1000);
// //       await updated.save();
// //       emitEvent(req, 'auctionExtended', { auctionId, newEndAt: updated.endTime });
// //     }

// //     return res.json({ message: 'Bid accepted', bid, auction: updated });
// //   } catch (err) {
// //     console.error('placeBid err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // import Auction from '../models/auctionModel.js';
// // import Bid from '../models/bidModel.js';
// // import mongoose from 'mongoose';
// // import { v2 as cloudinary } from 'cloudinary';
// // import schedule from 'node-schedule';
// // import dotenv from 'dotenv';
// // dotenv.config();

// // // Cloudinary config
// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// //   secure: true,
// // });

// // // ------------------- AUCTION CONTROLLERS -------------------

// // // CREATE AUCTION
// // export const createAuction = async (req, res) => {
// //   try {
// //     if (!req.file) return res.status(400).json({ message: 'Product image required' });

// //     const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'auctions' });

// //     const { productName, productDescription, startingPrice, durationMinutes, minIncrement, startAt } = req.body;

// //     if (!productName || !startingPrice)
// //       return res.status(400).json({ message: 'productName & startingPrice required' });

// //     const duration = Number(durationMinutes ?? 5);
// //     const minInc = Number(minIncrement ?? 1);
// //     const now = new Date();
// //     const start = startAt ? new Date(startAt) : now;
// //     const end = new Date(start.getTime() + duration * 60 * 1000);
// //     const status = start > now ? 'upcoming' : 'live';

// //     const auction = await Auction.create({
// //       productName,
// //       productDescription,
// //       productImage: uploadResult.secure_url,
// //       startingPrice,
// //       currentPrice: startingPrice,
// //       highestBidder: null,
// //       duration,
// //       startAt: start,
// //       endTime: end,
// //       createdBy: req.user?._id || null,
// //       status,
// //       minIncrement: minInc,
// //       bidsCount: 0,
// //       bids: [],
// //     });

// //     // Schedule auction start
// //     if (status === 'upcoming') {
// //       schedule.scheduleJob(start, async () => {
// //         await Auction.findByIdAndUpdate(auction._id, { status: 'live' });
// //       });
// //     }

// //     // Schedule auction end
// //     schedule.scheduleJob(end, async () => {
// //       await Auction.findByIdAndUpdate(auction._id, { status: 'ended' });
// //     });

// //     return res.status(201).json({
// //       success: true,
// //       message: status === 'upcoming' ? `Auction scheduled at ${start.toLocaleString()}` : 'Auction started immediately',
// //       data: auction,
// //     });
// //   } catch (err) {
// //     console.error('createAuction err:', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // // UPDATE AUCTION
// // export const updateAuction = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid auction id' });

// //     const auction = await Auction.findById(id);
// //     if (!auction) return res.status(404).json({ message: 'Auction not found' });

// //     const { productName, productDescription, productImage, startingPrice, durationMinutes, minIncrement, startAt, startNow, status } = req.body;

// //     if (productName) auction.productName = productName;
// //     if (productDescription) auction.productDescription = productDescription;
// //     if (productImage) auction.productImage = productImage;
// //     if (startingPrice) {
// //       auction.startingPrice = startingPrice;
// //       if (!auction.currentPrice || auction.currentPrice < startingPrice) auction.currentPrice = startingPrice;
// //     }
// //     if (minIncrement) auction.minIncrement = Number(minIncrement);

// //     if (startAt) {
// //       const start = new Date(startAt);
// //       auction.startAt = start;
// //       const dur = Number(durationMinutes ?? auction.duration ?? 5);
// //       auction.duration = dur;
// //       auction.endTime = new Date(start.getTime() + dur * 60 * 1000);
// //     } else if (durationMinutes) {
// //       auction.duration = Number(durationMinutes);
// //       const startBase = auction.startAt ?? new Date();
// //       auction.endTime = new Date(startBase.getTime() + auction.duration * 60 * 1000);
// //     }

// //     if (startNow) {
// //       auction.startAt = new Date();
// //       auction.endTime = new Date(Date.now() + (auction.duration ?? 5) * 60 * 1000);
// //       auction.status = 'live';
// //     }

// //     if (status) auction.status = status;

// //     await auction.save();
// //     return res.json({ success: true, data: auction });
// //   } catch (err) {
// //     console.error('updateAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // // DELETE AUCTION
// // export const deleteAuction = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

// //     const deleted = await Auction.findByIdAndDelete(id);
// //     if (!deleted) return res.status(404).json({ message: 'Auction not found' });

// //     await Bid.deleteMany({ auction: id }).catch(() => {});
// //     return res.json({ success: true, message: 'Auction deleted' });
// //   } catch (err) {
// //     console.error('deleteAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // // GET AUCTION
// // export const getAuction = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

// //     const auction = await Auction.findById(id).populate('highestBidder', 'name email').populate('createdBy', 'name email');
// //     if (!auction) return res.status(404).json({ message: 'Auction not found' });

// //     return res.json({ success: true, data: auction });
// //   } catch (err) {
// //     console.error('getAuction err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // // LIST AUCTIONS
// // export const listAuctions = async (req, res) => {
// //   try {
// //     const { status, page = 1, limit = 20 } = req.query;
// //     const query = {};
// //     if (status) query.status = status;

// //     const currentPage = Math.max(1, parseInt(page, 10));
// //     const perPage = Math.min(200, Math.max(1, parseInt(limit, 10)));

// //     const auctions = await Auction.find(query)
// //       .sort({ startAt: 1 })
// //       .skip((currentPage - 1) * perPage)
// //       .limit(perPage)
// //       .populate('highestBidder', 'name email')
// //       .lean();

// //     const total = await Auction.countDocuments(query);

// //     return res.status(200).json({ success: true, meta: { page: currentPage, limit: perPage, total }, data: auctions });
// //   } catch (err) {
// //     console.error('listAuctions err:', err);
// //     return res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // // PLACE BID
// // export const placeBid = async (req, res) => {
// //   try {
// //     if (!req.user) return res.status(401).json({ message: 'Authentication required' });

// //     const { auctionId, amount } = req.body;
// //     if (!auctionId || typeof amount !== 'number') return res.status(400).json({ message: 'auctionId & numeric amount required' });
// //     if (!mongoose.isValidObjectId(auctionId)) return res.status(400).json({ message: 'Invalid auction id' });

// //     const auction = await Auction.findById(auctionId);
// //     if (!auction) return res.status(404).json({ message: 'Auction not found' });
// //     if (auction.status !== 'live') return res.status(400).json({ message: 'Auction not live' });

// //     const minAllowed = (auction.currentPrice ?? auction.startingPrice) + (auction.minIncrement ?? 1);
// //     if (amount < minAllowed) return res.status(400).json({ message: 'Amount too low', minAllowed });

// //     const now = new Date();
// //     auction.currentPrice = amount;
// //     auction.highestBidder = req.user._id;
// //     auction.bidsCount = (auction.bidsCount || 0) + 1;
// //     auction.bids.push({ user: req.user._id, amount, time: now });

// //     // Anti-sniping extension
// //     const antiSeconds = Number(process.env.ANTI_SNIPING_SECONDS ?? 15);
// //     const remainingMs = new Date(auction.endTime) - now;
// //     if (remainingMs <= antiSeconds * 1000) auction.endTime = new Date(Date.now() + antiSeconds * 1000);

// //     await auction.save();
// //     await Bid.create({ auction: auctionId, bidder: req.user._id, amount });

// //     return res.json({ success: true, message: 'Bid accepted', auction });
// //   } catch (err) {
// //     console.error('placeBid err', err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// import Auction from '../models/auctionModel.js';
// import Bid from '../models/bidModel.js';
// import mongoose from 'mongoose';
// import { v2 as cloudinary } from 'cloudinary';
// import schedule from 'node-schedule';
// import dotenv from 'dotenv';
// dotenv.config();

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

// // ------------------- AUCTION CONTROLLERS -------------------

// // CREATE AUCTION
// export const createAuction = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'Product image required' });

//     const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'auctions' });

//     const { productName, productDescription, startingPrice, durationMinutes, minIncrement, startAt } = req.body;

//     if (!productName || !startingPrice)
//       return res.status(400).json({ message: 'productName & startingPrice required' });

//     const duration = Number(durationMinutes ?? 5);
//     const minInc = Number(minIncrement ?? 1);
//     const now = new Date();
//     const start = startAt ? new Date(startAt) : now;
//     const end = new Date(start.getTime() + duration * 60 * 1000);
//     const status = start > now ? 'upcoming' : 'live';

//     const auction = await Auction.create({
//       productName,
//       productDescription,
//       productImage: uploadResult.secure_url,
//       startingPrice,
//       currentPrice: startingPrice,
//       highestBidder: null,
//       duration,
//       startAt: start,
//       endTime: end,
//       createdBy: req.user?._id || null,
//       status,
//       minIncrement: minInc,
//       bidsCount: 0,
//       bids: [],
//     });

//     // Schedule auction start
//     if (status === 'upcoming') {
//       schedule.scheduleJob(start, async () => {
//         await Auction.findByIdAndUpdate(auction._id, { status: 'live' });
//       });
//     }

//     // Schedule auction end
//     schedule.scheduleJob(end, async () => {
//       await Auction.findByIdAndUpdate(auction._id, { status: 'ended' });
//     });

//     return res.status(201).json({
//       success: true,
//       message: status === 'upcoming' ? `Auction scheduled at ${start.toLocaleString()}` : 'Auction started immediately',
//       data: auction,
//     });
//   } catch (err) {
//     console.error('createAuction err:', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // UPDATE AUCTION
// export const updateAuction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid auction id' });

//     const auction = await Auction.findById(id);
//     if (!auction) return res.status(404).json({ message: 'Auction not found' });

//     const { productName, productDescription, productImage, startingPrice, durationMinutes, minIncrement, startAt, startNow, status } = req.body;

//     if (productName) auction.productName = productName;
//     if (productDescription) auction.productDescription = productDescription;
//     if (productImage) auction.productImage = productImage;
//     if (startingPrice) {
//       auction.startingPrice = startingPrice;
//       if (!auction.currentPrice || auction.currentPrice < startingPrice) auction.currentPrice = startingPrice;
//     }
//     if (minIncrement) auction.minIncrement = Number(minIncrement);

//     if (startAt) {
//       const start = new Date(startAt);
//       auction.startAt = start;
//       const dur = Number(durationMinutes ?? auction.duration ?? 5);
//       auction.duration = dur;
//       auction.endTime = new Date(start.getTime() + dur * 60 * 1000);
//     } else if (durationMinutes) {
//       auction.duration = Number(durationMinutes);
//       const startBase = auction.startAt ?? new Date();
//       auction.endTime = new Date(startBase.getTime() + auction.duration * 60 * 1000);
//     }

//     if (startNow) {
//       auction.startAt = new Date();
//       auction.endTime = new Date(Date.now() + (auction.duration ?? 5) * 60 * 1000);
//       auction.status = 'live';
//     }

//     if (status) auction.status = status;

//     await auction.save();
//     return res.json({ success: true, data: auction });
//   } catch (err) {
//     console.error('updateAuction err', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // DELETE AUCTION
// export const deleteAuction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

//     const deleted = await Auction.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json({ message: 'Auction not found' });

//     await Bid.deleteMany({ auction: id }).catch(() => {});
//     return res.json({ success: true, message: 'Auction deleted' });
//   } catch (err) {
//     console.error('deleteAuction err', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // GET AUCTION
// export const getAuction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

//     const auction = await Auction.findById(id)
//       .populate('highestBidder', 'name email')
//       .populate('createdBy', 'name email');

//     if (!auction) return res.status(404).json({ message: 'Auction not found' });

//     return res.json({ success: true, data: auction });
//   } catch (err) {
//     console.error('getAuction err', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // LIST AUCTIONS
// export const listAuctions = async (req, res) => {
//   try {
//     const { status, page = 1, limit = 20 } = req.query;
//     const query = {};
//     if (status) query.status = status;

//     const currentPage = Math.max(1, parseInt(page, 10));
//     const perPage = Math.min(200, Math.max(1, parseInt(limit, 10)));

//     const auctions = await Auction.find(query)
//       .sort({ startAt: 1 })
//       .skip((currentPage - 1) * perPage)
//       .limit(perPage)
//       .populate('highestBidder', 'name email')
//       .lean();

//     const total = await Auction.countDocuments(query);

//     return res.status(200).json({ success: true, meta: { page: currentPage, limit: perPage, total }, data: auctions });
//   } catch (err) {
//     console.error('listAuctions err:', err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// // LIST BIDS
// export const listBids = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

//     const auction = await Auction.findById(id);
//     if (!auction) return res.status(404).json({ message: 'Auction not found' });

//     const bids = await Bid.find({ auction: req.params.id }).sort({ createdAt: -1 }).populate('bidder', 'name');
//     return res.json({ success: true, data: bids });
//   } catch (err) {
//     console.error('listBids err', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // START AUCTION
// export const startAuction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid auction id' });

//     const auction = await Auction.findById(id);
//     if (!auction) return res.status(404).json({ message: 'Auction not found' });
//     if (auction.status === 'live') return res.status(400).json({ message: 'Auction already live' });

//     auction.status = 'live';
//     auction.startAt = new Date();
//     auction.endTime = new Date(Date.now() + (auction.duration ?? 5) * 60 * 1000);
//     await auction.save();

//     return res.json({ success: true, message: 'Auction started', data: auction });
//   } catch (err) {
//     console.error('startAuction err', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // END AUCTION
// export const endAuction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid auction id' });

//     const auction = await Auction.findById(id);
//     if (!auction) return res.status(404).json({ message: 'Auction not found' });

//     auction.status = 'ended';
//     await auction.save();

//     return res.json({ success: true, message: 'Auction ended', data: auction });
//   } catch (err) {
//     console.error('endAuction err', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // PLACE BID
// // export const placeBid = async (req, res) => {
// //   try {
// //     // ✅ Authentication check
// //     if (!req.user) return res.status(401).json({ message: "Authentication required" });

// //     const { auctionId, amount } = req.body;

// //     // ✅ Input validation
// //     if (!auctionId || typeof amount !== "number") {
// //       return res.status(400).json({ message: "auctionId & numeric amount required" });
// //     }
// //     if (!mongoose.isValidObjectId(auctionId)) return res.status(400).json({ message: "Invalid auction id" });

// //     // ✅ Fetch auction
// //     const auction = await Auction.findById(auctionId);
// //     if (!auction) return res.status(404).json({ message: "Auction not found" });
// //     if (auction.status !== "live") return res.status(400).json({ message: "Auction not live" });

// //     // ✅ Minimum bid calculation
// //     const currentBase = typeof auction.currentPrice === "number" && auction.currentPrice > 0
// //       ? auction.currentPrice
// //       : Number(auction.startingPrice);
// //     const minAllowed = currentBase + (auction.minIncrement ?? 1);

// //     if (amount < minAllowed) return res.status(400).json({ message: "Amount too low", minAllowed });

// //     const now = new Date();

// //     // ✅ Update auction
// //     auction.currentPrice = amount;
// //     auction.highestBidder = req.user._id;
// //     auction.bidsCount = (auction.bidsCount || 0) + 1;
// //     auction.bids.push({ user: req.user._id, amount, time: now });

// //     // ✅ Anti-sniping: extend auction if bid placed near end
// //     const antiSeconds = Number(process.env.ANTI_SNIPING_SECONDS ?? 15);
// //     const remainingMs = new Date(auction.endTime).getTime() - now.getTime();
// //     if (remainingMs <= antiSeconds * 1000) {
// //       auction.endTime = new Date(Date.now() + antiSeconds * 1000);
// //     }

// //     await auction.save();

// //     // ✅ Save bid record
// //     const bidRecord = await Bid.create({
// //       auction: auction._id,
// //       bidder: req.user._id,
// //       amount,
// //       bidType: "manual",
// //     });

// //     // ✅ Emit live update via socket.io if available
// //     const io = req.app.get("io");
// //     if (io) {
// //       const updatedAuction = await Auction.findById(auctionId)
// //         .populate("highestBidder", "name email")
// //         .lean();
// //       io.emit("auctionUpdated", updatedAuction);
// //     }

// //     return res.json({ success: true, message: "Bid accepted", auction });
// //   } catch (err) {
// //     console.error("placeBid err", err);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };


// // export const placeBid = async (req, res) => {
// //   try {
// //     const { auctionId, amount } = req.body;
// //     const userId = req.user._id; // Now works because authUser sets req.user properly

// //     if (!auctionId || !amount)
// //       return res.status(400).json({ success: false, message: "AuctionId & amount required" });

// //     const auction = await Auction.findById(auctionId).populate("bids.bidder highestBidder");
// //     if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });

// //     if (amount <= (auction.currentPrice || auction.startingPrice))
// //       return res.status(400).json({ success: false, message: "Bid must be higher than current price" });

// //     const bid = { bidder: userId, amount, time: new Date() };
// //     auction.bids.push(bid);
// //     auction.currentPrice = amount;
// //     auction.highestBidder = userId;
// //     auction.bidsCount = auction.bids.length;

// //     await auction.save();
// //     await auction.populate("bids.bidder highestBidder");

// //     // Emit live update
// //     const io = req.app.get("io");
// //     if (io) io.emit("auctionUpdated", auction);

// //     res.json({ success: true, message: "Bid placed", data: auction });
// //   } catch (err) {
// //     console.error("placeBid err", err);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };


// // export const placeBid = async (req, res) => {
// //   try {
// //     const { auctionId, amount } = req.body;
// //     const userId = req.user._id; // ✅ Make sure this exists

// //     if (!auctionId || !amount)
// //       return res.status(400).json({ success: false, message: "AuctionId & amount required" });

// //     const auction = await Auction.findById(auctionId).populate("bids.bidder highestBidder");
// //     if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });

// //     if (amount <= (auction.currentPrice || auction.startingPrice))
// //       return res.status(400).json({ success: false, message: "Bid must be higher than current price" });

// //     const bid = { bidder: userId, amount, time: new Date() };
// //     auction.bids.push(bid);
// //     auction.currentPrice = amount;
// //     auction.highestBidder = userId;
// //     auction.bidsCount = auction.bids.length;

// //     await auction.save();
// //     await auction.populate("bids.bidder highestBidder");

// //     // Emit live update via Socket.IO
// //     const io = req.app.get("io");
// //     if (io) io.emit("auctionUpdated", auction);

// //     res.json({ success: true, message: "Bid placed", data: auction });
// //   } catch (err) {
// //     console.error("placeBid err", err);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// // export const placeBid = async (req, res) => {
// //   try {
// //     if (!req.user || !req.user._id)
// //       return res.status(401).json({ success: false, message: "User not authenticated" });

// //     const { auctionId, amount } = req.body;
// //     const userId = req.user._id;

// //     if (!auctionId || !amount)
// //       return res.status(400).json({ success: false, message: "AuctionId & amount required" });

// //     const auction = await Auction.findById(auctionId).populate("bids.bidder highestBidder");
// //     if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });

// //     if (amount <= (auction.currentPrice || auction.startingPrice))
// //       return res.status(400).json({ success: false, message: "Bid must be higher than current price" });

// //     const bid = { bidder: userId, amount, time: new Date() };
// //     auction.bids.push(bid);
// //     auction.currentPrice = amount;
// //     auction.highestBidder = userId;
// //     auction.bidsCount = auction.bids.length;

// //     await auction.save();
// //     await auction.populate("bids.bidder highestBidder");

// //     // Emit via socket.io
// //     const io = req.app.get("io");
// //     if (io) io.emit("auctionUpdated", auction);

// //     res.json({ success: true, message: "Bid placed", data: auction });
// //   } catch (err) {
// //     console.error("placeBid err", err);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // };

// export const placeBid = async (req, res) => {
//   try {
//     const { auctionId, amount } = req.body;
//     const userId  = req.user._id;

//     if (!auctionId || !amount)
//       return res.status(400).json({ success: false, message: "AuctionId & amount required" });

//     // Fetch auction with currentPrice
//     const auction = await Auction.findById(auctionId).populate("bids.bidder highestBidder");
//     if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });

//     if (auction.status !== "live")
//       return res.status(400).json({ success: false, message: "Auction not active" });

//     // Ensure bid is higher than currentPrice
//     if (amount <= auction.currentPrice)
//       return res.status(400).json({ success: false, message: "Bid must be higher than current price" });

//     // Create new bid
//     const bid = await Bid.create({ auction: auction._id, bidder: userId, amount });

//     // Update auction atomically
//     auction.currentPrice = amount;
//     auction.highestBidder = userId;
//     auction.bids.push(bid._id);
//     auction.bidsCount = auction.bids.length;
//     await auction.save();

//     // Populate bids and highestBidder for response
//     await auction.populate({
//       path: "bids",
//       populate: { path: "bidder", select: "name email" },
//     }).execPopulate();
//     await auction.populate("highestBidder", "name email").execPopulate();

//     // Emit update via Socket.IO
//     const io = req.app.get("io");
//     if (io) io.emit("auctionUpdated", auction);

//     res.json({ success: true, message: "Bid placed successfully", data: auction });
//   } catch (err) {
//     console.error("placeBid error:", err);
//     res.status(500).json({ success: false, message: "Server error placing bid" });
//   }
// };


// import Auction from '../models/auctionModel.js';
// import Bid from '../models/bidModel.js';
// import mongoose from 'mongoose';
// import { v2 as cloudinary } from 'cloudinary';
// import schedule from 'node-schedule';
// import dotenv from 'dotenv';
// dotenv.config();

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

// // CREATE AUCTION
// export const createAuction = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'Product image required' });

//     const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'auctions' });

//     const { productName, productDescription, startingPrice, durationMinutes, minIncrement, startAt } = req.body;

//     if (!productName || !startingPrice)
//       return res.status(400).json({ message: 'productName & startingPrice required' });

//     const duration = Number(durationMinutes ?? 5);
//     const minInc = Number(minIncrement ?? 1);
//     const now = new Date();
//     const start = startAt ? new Date(startAt) : now;
//     const end = new Date(start.getTime() + duration * 60 * 1000);
//     const status = start > now ? 'upcoming' : 'live';

//     const auction = await Auction.create({
//       productName,
//       productDescription,
//       productImage: uploadResult.secure_url,
//       startingPrice,
//       currentPrice: startingPrice,
//       highestBidder: null,
//       duration,
//       startAt: start,
//       endTime: end,
//       createdBy: req.user?._id || null,
//       status,
//       minIncrement: minInc,
//       bidsCount: 0,
//       bids: [],
//     });

//     // Schedule auction start
//     if (status === 'upcoming') {
//       schedule.scheduleJob(start, async () => {
//         await Auction.findByIdAndUpdate(auction._id, { status: 'live' });
//       });
//     }

//     // Schedule auction end
//     schedule.scheduleJob(end, async () => {
//       await Auction.findByIdAndUpdate(auction._id, { status: 'ended' });
//     });

//     return res.status(201).json({
//       success: true,
//       message: status === 'upcoming' ? `Auction scheduled at ${start.toLocaleString()}` : 'Auction started immediately',
//       data: auction,
//     });
//   } catch (err) {
//     console.error('createAuction err:', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // UPDATE AUCTION
// export const updateAuction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid auction id' });

//     const auction = await Auction.findById(id);
//     if (!auction) return res.status(404).json({ message: 'Auction not found' });

//     const { productName, productDescription, productImage, startingPrice, durationMinutes, minIncrement, startAt, startNow, status } = req.body;

//     if (productName) auction.productName = productName;
//     if (productDescription) auction.productDescription = productDescription;
//     if (productImage) auction.productImage = productImage;
//     if (startingPrice) {
//       auction.startingPrice = startingPrice;
//       if (!auction.currentPrice || auction.currentPrice < startingPrice) auction.currentPrice = startingPrice;
//     }
//     if (minIncrement) auction.minIncrement = Number(minIncrement);

//     if (startAt) {
//       const start = new Date(startAt);
//       auction.startAt = start;
//       const dur = Number(durationMinutes ?? auction.duration ?? 5);
//       auction.duration = dur;
//       auction.endTime = new Date(start.getTime() + dur * 60 * 1000);
//     } else if (durationMinutes) {
//       auction.duration = Number(durationMinutes);
//       const startBase = auction.startAt ?? new Date();
//       auction.endTime = new Date(startBase.getTime() + auction.duration * 60 * 1000);
//     }

//     if (startNow) {
//       auction.startAt = new Date();
//       auction.endTime = new Date(Date.now() + (auction.duration ?? 5) * 60 * 1000);
//       auction.status = 'live';
//     }

//     if (status) auction.status = status;

//     await auction.save();
//     return res.json({ success: true, data: auction });
//   } catch (err) {
//     console.error('updateAuction err', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // DELETE AUCTION
// export const deleteAuction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

//     const deleted = await Auction.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json({ message: 'Auction not found' });

//     await Bid.deleteMany({ auction: id }).catch(() => {});
//     return res.json({ success: true, message: 'Auction deleted' });
//   } catch (err) {
//     console.error('deleteAuction err', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // GET AUCTION
// export const getAuction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

//     const auction = await Auction.findById(id)
//       .populate('highestBidder', 'name email')
//       .populate('createdBy', 'name email')
//       .populate({
//         path: 'bids',
//         populate: { path: 'bidder', select: 'name email' },
//         options: { sort: { createdAt: -1 } }
//       });

//     if (!auction) return res.status(404).json({ message: 'Auction not found' });

//     return res.json({ success: true, data: auction });
//   } catch (err) {
//     console.error('getAuction err', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // LIST AUCTIONS
// export const listAuctions = async (req, res) => {
//   try {
//     const { status, page = 1, limit = 20 } = req.query;
//     const query = {};
//     if (status) query.status = status;

//     const currentPage = Math.max(1, parseInt(page, 10));
//     const perPage = Math.min(200, Math.max(1, parseInt(limit, 10)));

//     const auctions = await Auction.find(query)
//       .sort({ startAt: 1 })
//       .skip((currentPage - 1) * perPage)
//       .limit(perPage)
//       .populate('highestBidder', 'name email')
//       .populate({
//         path: 'bids',
//         populate: { path: 'bidder', select: 'name email' },
//         options: { sort: { createdAt: -1 }, limit: 5 }
//       })
//       .lean();

//     const total = await Auction.countDocuments(query);

//     return res.status(200).json({ success: true, meta: { page: currentPage, limit: perPage, total }, data: auctions });
//   } catch (err) {
//     console.error('listAuctions err:', err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// // LIST BIDS
// export const listBids = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

//     const auction = await Auction.findById(id);
//     if (!auction) return res.status(404).json({ message: 'Auction not found' });

//     const bids = await Bid.find({ auction: req.params.id })
//       .sort({ createdAt: -1 })
//       .populate('bidder', 'name email');

//     return res.json({ success: true, data: bids });
//   } catch (err) {
//     console.error('listBids err', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // START AUCTION
// export const startAuction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid auction id' });

//     const auction = await Auction.findById(id);
//     if (!auction) return res.status(404).json({ message: 'Auction not found' });
//     if (auction.status === 'live') return res.status(400).json({ message: 'Auction already live' });

//     auction.status = 'live';
//     auction.startAt = new Date();
//     auction.endTime = new Date(Date.now() + (auction.duration ?? 5) * 60 * 1000);
//     await auction.save();

//     return res.json({ success: true, message: 'Auction started', data: auction });
//   } catch (err) {
//     console.error('startAuction err', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // END AUCTION
// export const endAuction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid auction id' });

//     const auction = await Auction.findById(id);
//     if (!auction) return res.status(404).json({ message: 'Auction not found' });

//     auction.status = 'ended';
//     await auction.save();

//     return res.json({ success: true, message: 'Auction ended', data: auction });
//   } catch (err) {
//     console.error('endAuction err', err);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // PLACE BID - FIXED VERSION
// export const placeBid = async (req, res) => {
//   try {
//     const { auctionId, amount } = req.body;
//     const userId = req.user._id;

//     if (!auctionId || !amount) {
//       return res.status(400).json({ success: false, message: "Auction ID and amount are required" });
//     }

//     // Validate amount
//     const bidAmount = Number(amount);
//     if (isNaN(bidAmount) || bidAmount <= 0) {
//       return res.status(400).json({ success: false, message: "Invalid bid amount" });
//     }

//     // Fetch auction with current price
//     const auction = await Auction.findById(auctionId);
//     if (!auction) {
//       return res.status(404).json({ success: false, message: "Auction not found" });
//     }

//     if (auction.status !== "live") {
//       return res.status(400).json({ success: false, message: "Auction is not active" });
//     }

//     // Calculate minimum acceptable bid
//     const minBid = auction.currentPrice > 0 ? auction.currentPrice + (auction.minIncrement || 1) : auction.startingPrice;

//     if (bidAmount < minBid) {
//       return res.status(400).json({ 
//         success: false, 
//         message: `Bid must be at least ₹${minBid.toLocaleString()}` 
//       });
//     }

//     // Create new bid
//     const bid = await Bid.create({ 
//       auction: auctionId, 
//       bidder: userId, 
//       amount: bidAmount 
//     });

//     // Update auction
//     auction.currentPrice = bidAmount;
//     auction.highestBidder = userId;
//     auction.bids.push(bid._id);
//     auction.bidsCount = auction.bids.length;
//     await auction.save();

//     // Populate the updated auction for response
//     const updatedAuction = await Auction.findById(auctionId)
//       .populate('highestBidder', 'name email')
//       .populate({
//         path: 'bids',
//         populate: { path: 'bidder', select: 'name email' },
//         options: { sort: { createdAt: -1 } }
//       });

//     // Emit update via Socket.IO
//     const io = req.app.get("io");
//     if (io) {
//       io.emit("auctionUpdated", updatedAuction);
//     }

//     res.json({ 
//       success: true, 
//       message: "Bid placed successfully", 
//       data: updatedAuction 
//     });

//   } catch (err) {
//     console.error("placeBid error:", err);
//     res.status(500).json({ 
//       success: false, 
//       message: "Server error placing bid: " + err.message 
//     });
//   }
// };

import Auction from '../models/auctionModel.js';
import Bid from '../models/bidModel.js';
import Order from '../models/orderModel.js';
// import User from '../models/userModel.js';
import fs from "fs"; // ✅ ADD THIS LINE
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { sendAuctionWinEmail, sendPaymentReminderEmail } from '../config/emailService.js';
import { generatePaymentLink } from '../config/paymentService.js';
import { scheduleAuctionEnd } from '../config/Schedule.js';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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

export const createAuction = async (req, res) => {
  try {
    // 1️⃣ Check for uploaded image
    if (!req.file)
      return res.status(400).json({ message: "Product image required" });

    // 2️⃣ Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "auctions",
    });

    // 3️⃣ Extract fields
    const {
      productName,
      productDescription,
      startingPrice,
      durationMinutes,
      minIncrement,
    } = req.body;

    // 4️⃣ Validate input
    if (!productName || !startingPrice || !durationMinutes) {
      return res
        .status(400)
        .json({ message: "productName, startingPrice & durationMinutes required" });
    }

    // 5️⃣ Convert duration (minutes → hours)
    let duration = Number(durationMinutes) / 60;
    if (duration < 1) duration = 1; // Minimum 1 hour

    const minInc = Number(minIncrement) || 1;
    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 10 * 10 * 1000); // Convert hours → ms

    // 6️⃣ Create auction document in DB
    const auction = await Auction.create({
      productName,
      productDescription,
      productImage: uploadResult.secure_url,
      startingPrice: Number(startingPrice),
      currentPrice: Number(startingPrice),
      highestBidder: null,
      duration,
      startAt: now,
      endTime,
      createdBy: req.user?._id || null,
      status: "live",
      minIncrement: minInc,
      bidsCount: 0,
      bids: [],
      isActive: true,
    });

    // 7️⃣ Delete temporary file after upload
    fs.unlinkSync(req.file.path);

    // 8️⃣ Schedule auction end (auto close)
    scheduleAuctionEnd(auction._id, endTime);

    // 9️⃣ Respond to client
    return res.status(201).json({
      success: true,
      message: `Auction started for ${duration.toFixed(2)} hour(s)`,
      data: auction,
    });
  } catch (err) {
    console.error("❌ createAuction error:", err);
    return res.status(500).json({ message: err.message });
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

export const endAuctionAndNotifyWinner = async (auctionIdOrReq, res = null) => {
  try {
    let auctionId;

    // 🧩 Determine auctionId
    if (auctionIdOrReq?.params?.auctionId) {
      auctionId = auctionIdOrReq.params.auctionId;
    } else {
      auctionId = auctionIdOrReq;
    }

    if (!auctionId) {
      const msg = "Auction ID is required.";
      if (res) return res.status(400).json({ success: false, message: msg });
      console.warn(msg);
      return;
    }

    // 🧩 Find the auction and include bidder + creator info
    const auction = await Auction.findById(auctionId)
      .populate("highestBidder", "name email _id")
      .populate("createdBy", "name email");

    if (!auction) {
      const msg = `Auction with ID ${auctionId} not found.`;
      if (res) return res.status(404).json({ success: false, message: msg });
      console.warn(msg);
      return;
    }

    if (auction.status === "ended") {
      const msg = `Auction "${auction.productName}" already ended.`;
      if (res) return res.status(400).json({ success: false, message: msg });
      console.warn(msg);
      return;
    }

    // ✅ End the auction
    auction.status = "ended";
    await auction.save();

    // ❌ No winner case
    if (!auction.highestBidder) {
      console.log(`❌ Auction "${auction.productName}" ended with no bids.`);
      if (res) {
        return res.status(200).json({
          success: true,
          message: `Auction "${auction.productName}" ended — no bids were placed.`,
        });
      }
      return;
    }

    // ✅ Determine the final bid amount
    const amount = Number(auction.currentPrice);
    if (isNaN(amount) || amount <= 0) {
      throw new Error(`Invalid winning bid amount: ${auction.currentPrice}`);
    }

    // ✅ Generate Razorpay Payment Link (and create order)
    const { success, checkoutUrl, orderDb, error } = await generatePaymentLink({
      amount: parseFloat(amount.toFixed(2)),
      auctionId: auction._id.toString(),
      userId: auction.highestBidder._id.toString(),
      productName: auction.productName,
    });

    if (!success) {
      throw new Error(error || "Failed to create payment link/order");
    }

    // ✅ Send winner email
    await sendAuctionWinEmail(
      auction.highestBidder.email,
      auction.highestBidder.name,
      auction.productName,
      amount,
      checkoutUrl
    );

    // ✅ Schedule 12-hour payment reminder
    setTimeout(async () => {
      try {
        await sendPaymentReminderEmail(
          auction.highestBidder.email,
          auction.highestBidder.name,
          auction.productName,
          amount,
          checkoutUrl
        );
        console.log(`📩 Reminder email sent to ${auction.highestBidder.email}`);
      } catch (err) {
        console.error("⚠️ Reminder email failed:", err.message);
      }
    }, 12 * 60 * 60 * 1000); // 12 hours later

    // ✅ Emit socket event (if socket.io running)
    if (global.io) {
      global.io.emit("auctionEnded", {
        auctionId: auction._id,
        winner: {
          name: auction.highestBidder.name,
          email: auction.highestBidder.email,
          id: auction.highestBidder._id,
        },
        finalPrice: amount,
        orderId: orderDb?._id || null,
        paymentLink: checkoutUrl,
      });
    }

    console.log(
      `✅ Auction ended: ${auction.productName}, Winner: ${auction.highestBidder.name}, ₹${amount}`
    );

    // ✅ Send response
    if (res) {
      return res.status(200).json({
        success: true,
        message: "Auction ended successfully — winner notified.",
        auction: {
          id: auction._id,
          productName: auction.productName,
          finalPrice: amount,
        },
        winner: {
          id: auction.highestBidder._id,
          name: auction.highestBidder.name,
          email: auction.highestBidder.email,
        },
        payment: {
          orderId: orderDb?._id,
          checkoutUrl,
          method: orderDb?.paymentMethod || "Razorpay",
        },
      });
    }

    return {
      success: true,
      message: "Auction ended successfully — winner notified.",
      auctionId: auction._id,
      winner: auction.highestBidder,
      paymentLink: checkoutUrl,
      orderId: orderDb?._id,
    };
  } catch (err) {
    console.error("❌ endAuctionAndNotifyWinner error:", err);

    if (res) {
      return res.status(500).json({
        success: false,
        message: "Internal server error while ending auction",
        error: err.message,
      });
    } else {
      return { success: false, error: err.message };
    }
  }
};


// PLACE BID - FIXED VERSION WITH PROPER BIDDING LOGIC
export const placeBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { auctionId, amount } = req.body;
    const userId = req.user._id;

    if (!auctionId || !amount) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Auction ID and amount are required" });
    }

    // Validate amount
    const bidAmount = Number(amount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Invalid bid amount" });
    }

    // Fetch auction with current price (with transaction)
    const auction = await Auction.findById(auctionId).session(session);
    if (!auction) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    if (auction.status !== "live") {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Auction is not active" });
    }

    // Check if auction has ended
    if (new Date() > new Date(auction.endTime)) {
      auction.status = 'ended';
      await auction.save({ session });
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Auction has ended" });
    }

    // Calculate minimum acceptable bid
    const currentPrice = auction.currentPrice || auction.startingPrice;
    const minBid = currentPrice + (auction.minIncrement || 100);

    if (bidAmount < minBid) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Bid must be at least ₹${minBid.toLocaleString()}`
      });
    }

    // Check if user is already the highest bidder
    if (auction.highestBidder && auction.highestBidder.toString() === userId.toString()) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "You are already the highest bidder"
      });
    }

    // Create new bid
    const bid = await Bid.create([{
      auction: auctionId,
      bidder: userId,
      amount: bidAmount,
      placedAt: new Date()
    }], { session });

    // Update auction
    auction.currentPrice = bidAmount;
    auction.highestBidder = userId;
    auction.bids.push(bid[0]._id);
    auction.bidsCount = auction.bids.length;
    auction.lastBidAt = new Date();
    await auction.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // Populate the updated auction for response
    const updatedAuction = await Auction.findById(auctionId)
      .populate('highestBidder', 'name email')
      .populate({
        path: 'bids',
        populate: { path: 'bidder', select: 'name email' },
        options: { sort: { placedAt: -1 } }
      });

    // Emit update via Socket.IO
    const io = req.app.get("io");
    if (io) {
      io.emit("auctionUpdated", updatedAuction);
      io.emit("newBid", {
        bidder: req.user.name,
        amount: bidAmount,
        time: new Date()
      });
    }

    res.json({
      success: true,
      message: "Bid placed successfully",
      data: updatedAuction
    });

  } catch (err) {
    await session.abortTransaction();
    console.error("placeBid error:", err);
    res.status(500).json({
      success: false,
      message: "Server error placing bid: " + err.message
    });
  } finally {
    session.endSession();
  }
};

// GET AUCTION WITH PROPER BIDDING LOGIC
export const getAuction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

    const auction = await Auction.findById(id)
      .populate('highestBidder', 'name email')
      .populate('createdBy', 'name email')
      .populate({
        path: 'bids',
        populate: { path: 'bidder', select: 'name email' },
        options: { sort: { placedAt: -1 } }
      });

    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    // Calculate time remaining
    const now = new Date();
    const endTime = new Date(auction.endTime);
    const timeRemaining = Math.max(0, endTime - now);

    const auctionData = {
      ...auction.toObject(),
      timeRemaining,
      minNextBid: auction.currentPrice + (auction.minIncrement || 100)
    };

    return res.json({ success: true, data: auctionData });
  } catch (err) {
    console.error('getAuction err', err);
    return res.status(500).json({ message: err.message });
  }
};

// LIST AUCTIONS WITH TIME REMAINING
export const listAuctions = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };
    if (status && status !== 'all') query.status = status;

    const currentPage = Math.max(1, parseInt(page, 10));
    const perPage = Math.min(200, Math.max(1, parseInt(limit, 10)));

    const auctions = await Auction.find(query)
      .sort({ startAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate('highestBidder', 'name email')
      .populate({
        path: 'bids',
        populate: { path: 'bidder', select: 'name email' },
        options: { sort: { placedAt: -1 }, limit: 5 }
      })
      .lean();

    // Add time remaining to each auction
    const now = new Date();
    const auctionsWithTime = auctions.map(auction => {
      const endTime = new Date(auction.endTime);
      const timeRemaining = Math.max(0, endTime - now);
      return {
        ...auction,
        timeRemaining,
        minNextBid: auction.currentPrice + (auction.minIncrement || 100)
      };
    });

    const total = await Auction.countDocuments(query);

    return res.status(200).json({
      success: true,
      meta: { page: currentPage, limit: perPage, total },
      data: auctionsWithTime
    });
  } catch (err) {
    console.error('listAuctions err:', err);
    return res.status(500).json({ success: false, message: err.message });
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

// 📁 backend/controllers/auctionController.js

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
