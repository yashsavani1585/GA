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
//     let auctionId;

//     // Accept either (req,res) or auctionId string
//     if (auctionIdOrReq?.params?.auctionId) auctionId = auctionIdOrReq.params.auctionId;
//     else auctionId = auctionIdOrReq;

//     if (!auctionId) {
//       const msg = "Auction ID is required.";
//       if (res) return res.status(400).json({ success: false, message: msg });
//       console.warn(msg);
//       return { success: false, error: msg };
//     }

//     // load auction with winner and creator
//     const auction = await Auction.findById(auctionId)
//       .populate("highestBidder", "name email _id")
//       .populate("createdBy", "name email");

//     if (!auction) {
//       const msg = `Auction with ID ${auctionId} not found.`;
//       if (res) return res.status(404).json({ success: false, message: msg });
//       console.warn(msg);
//       return { success: false, error: msg };
//     }

//     if (auction.status === "ended") {
//       const msg = `Auction "${auction.productName}" already ended.`;
//       if (res) return res.status(400).json({ success: false, message: msg });
//       console.warn(msg);
//       return { success: false, error: msg };
//     }

//     // Mark auction ended (persist)
//     auction.status = "ended";
//     auction.isActive = false;
//     auction.endedAt = new Date();
//     await auction.save();

//     // No winner case
//     if (!auction.highestBidder) {
//       console.log(`❌ Auction "${auction.productName}" ended with no bids.`);
//       if (res) return res.status(200).json({ success: true, message: `Auction "${auction.productName}" ended — no bids were placed.` });
//       return { success: true, message: "No bids placed" };
//     }

//     // Resolve amount paise robustly
//     let amountPaise = null;

//     // Preferred numeric paise fields
//     if (auction.finalPricePaise != null) amountPaise = toIntegerPaise(auction.finalPricePaise);
//     else if (auction.currentPricePaise != null) amountPaise = toIntegerPaise(auction.currentPricePaise);
//     else if (auction.currentPrice != null) amountPaise = toIntegerPaise(auction.currentPrice); // currentPrice may be rupees
//     // fallback to latest bid in bids array
//     if ((!amountPaise || amountPaise <= 0) && Array.isArray(auction.bids) && auction.bids.length > 0) {
//       const latest = auction.bids[0];
//       if (latest?.amountPaise != null) amountPaise = toIntegerPaise(latest.amountPaise);
//       else if (latest?.amount != null) amountPaise = toIntegerPaise(latest.amount);
//     }
//     // fallback to starting price
//     if ((!amountPaise || amountPaise <= 0) && (auction.startingPricePaise != null || auction.startingPrice != null)) {
//       amountPaise = auction.startingPricePaise != null ? toIntegerPaise(auction.startingPricePaise) : toIntegerPaise(auction.startingPrice);
//     }

//     if (!amountPaise || !Number.isFinite(amountPaise) || amountPaise <= 0) {
//       const errMsg = `Invalid winning bid amount for auction ${auctionId} (resolved amountPaise=${amountPaise})`;
//       console.error(errMsg);
//       if (res) return res.status(500).json({ success: false, message: errMsg });
//       return { success: false, error: errMsg };
//     }

//     console.log(`🔔 Auction "${auction.productName}" ended — Winner: ${auction.highestBidder.name} <${auction.highestBidder.email}> — amountPaise=${amountPaise} (₹${(amountPaise / 100).toFixed(2)})`);

//     // Try to generate payment link — with retries for transient errors
//     const gpPayload = {
//       auctionId: auction._id.toString(),
//       userId: auction.highestBidder._id.toString(),
//       amountPaise,
//       productName: auction.productName,
//       address: auction.shippingAddress || {},
//     };
//     const gpResult = await tryGeneratePaymentLinkWithRetries(gpPayload, { attempts: 2, delayMs: 1000 });

//     if (!gpResult.success) {
//       // log detailed error and respond accordingly
//       console.error("❌ Payment link generation ultimately failed:", gpResult.error);
//       // you can keep auction ended but inform admin or retry later
//       if (res) return res.status(500).json({ success: false, message: "Payment link creation failed", error: gpResult.error });
//       return { success: false, error: gpResult.error };
//     }

//     const { checkoutUrl, orderDb } = gpResult;
//     console.log(`🔗 Payment link created: ${checkoutUrl} (paymentRecord=${orderDb?._id})`);

//     // Send winner email (non-blocking but wait for result to log)
//     try {
//       const mailRes = await sendAuctionWinEmail(auction.highestBidder.email, auction.highestBidder.name, auction.productName, amountPaise, checkoutUrl);
//       if (mailRes?.success) console.log(`✅ Winner email sent to ${auction.highestBidder.email}`);
//       else console.warn(`⚠️ Winner email may have failed for ${auction.highestBidder.email}`, mailRes?.error || mailRes);
//     } catch (err) {
//       console.error("❌ sendAuctionWinEmail threw:", err && (err.message || err));
//     }

//     // Schedule reminder (12 hours). For testing use a smaller delay.
//     const REMINDER_DELAY_MS = 12 * 60 * 60 * 1000;
//     setTimeout(async () => {
//       try {
//         const rem = await sendPaymentReminderEmail(auction.highestBidder.email, auction.highestBidder.name, auction.productName, amountPaise, checkoutUrl);
//         if (rem?.success) console.log(`📩 Reminder email sent to ${auction.highestBidder.email}`);
//         else console.warn(`⚠️ Reminder email may have failed for ${auction.highestBidder.email}`, rem?.error || rem);
//       } catch (err) {
//         console.error("⚠️ Reminder send threw:", err && (err.message || err));
//       }
//     }, REMINDER_DELAY_MS);

//     // Emit socket event if available
//     if (global.io && typeof global.io.emit === "function") {
//       global.io.emit("auctionEnded", {
//         auctionId: auction._id.toString(),
//         winner: {
//           id: auction.highestBidder._id.toString(),
//           name: auction.highestBidder.name,
//           email: auction.highestBidder.email,
//         },
//         finalPricePaise: amountPaise,
//         finalPriceRupees: (amountPaise / 100).toFixed(2),
//         orderId: orderDb?._id || null,
//         paymentLink: checkoutUrl,
//       });
//       console.log("🔔 socket event emitted: auctionEnded");
//     }

//     // Return / respond
//     if (res) {
//       return res.status(200).json({
//         success: true,
//         message: "Auction ended and winner notified. Payment link created.",
//         data: {
//           auction: { id: auction._id, productName: auction.productName, finalPricePaise: amountPaise },
//           winner: { id: auction.highestBidder._id, name: auction.highestBidder.name, email: auction.highestBidder.email },
//           payment: { orderId: orderDb?._id, checkoutUrl },
//         },
//       });
//     }

//     return { success: true, checkoutUrl, orderId: orderDb?._id };
//   } catch (err) {
//     console.error("❌ endAuctionAndNotifyWinner error:", err && (err.message || err));
//     if (res) return res.status(500).json({ success: false, message: "Internal server error", error: err.message || String(err) });
//     return { success: false, error: err.message || String(err) };
//   }
// };




// PLACE BID - FIXED VERSION WITH PROPER BIDDING LOGIC
// export const placeBid = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { auctionId, amount } = req.body;
//     const userId = req.user._id;

//     if (!auctionId || !amount) {
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: "Auction ID and amount are required" });
//     }

//     // Validate amount
//     const bidAmount = Number(amount);
//     if (isNaN(bidAmount) || bidAmount <= 0) {
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: "Invalid bid amount" });
//     }

//     // Fetch auction with current price (with transaction)
//     const auction = await Auction.findById(auctionId).session(session);
//     if (!auction) {
//       await session.abortTransaction();
//       return res.status(404).json({ success: false, message: "Auction not found" });
//     }

//     if (auction.status !== "live") {
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: "Auction is not active" });
//     }

//     // Check if auction has ended
//     if (new Date() > new Date(auction.endTime)) {
//       auction.status = 'ended';
//       await auction.save({ session });
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: "Auction has ended" });
//     }

//     // Calculate minimum acceptable bid
//     const currentPrice = auction.currentPrice || auction.startingPrice;
//     const minBid = currentPrice + (auction.minIncrement || 100);

//     if (bidAmount < minBid) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: `Bid must be at least ₹${minBid.toLocaleString()}`
//       });
//     }

//     // Check if user is already the highest bidder
//     if (auction.highestBidder && auction.highestBidder.toString() === userId.toString()) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: "You are already the highest bidder"
//       });
//     }

//     // Create new bid
//     const bid = await Bid.create([{
//       auction: auctionId,
//       bidder: userId,
//       amount: bidAmount,
//       placedAt: new Date()
//     }], { session });

//     // Update auction
//     auction.currentPrice = bidAmount;
//     auction.highestBidder = userId;
//     auction.bids.push(bid[0]._id);
//     auction.bidsCount = auction.bids.length;
//     auction.lastBidAt = new Date();
//     await auction.save({ session });

//     // Commit transaction
//     await session.commitTransaction();

//     // Populate the updated auction for response
//     const updatedAuction = await Auction.findById(auctionId)
//       .populate('highestBidder', 'name email')
//       .populate({
//         path: 'bids',
//         populate: { path: 'bidder', select: 'name email' },
//         options: { sort: { placedAt: -1 } }
//       });

//     // Emit update via Socket.IO
//     const io = req.app.get("io");
//     if (io) {
//       io.emit("auctionUpdated", updatedAuction);
//       io.emit("newBid", {
//         bidder: req.user.name,
//         amount: bidAmount,
//         time: new Date()
//       });
//     }

//     res.json({
//       success: true,
//       message: "Bid placed successfully",
//       data: updatedAuction
//     });

//   } catch (err) {
//     await session.abortTransaction();
//     console.error("placeBid error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error placing bid: " + err.message
//     });
//   } finally {
//     session.endSession();
//   }
// };

// export const endAuctionAndNotifyWinner = async (auctionIdOrReq, res = null) => {
//   try {
//     let auctionId = auctionIdOrReq?.params?.auctionId ? auctionIdOrReq.params.auctionId : auctionIdOrReq;
//     if (!auctionId) {
//       const msg = "Auction ID is required.";
//       if (res) return res.status(400).json({ success: false, message: msg });
//       return { success: false, error: msg };
//     }

//     const auction = await Auction.findById(auctionId)
//       .populate("highestBidder", "name email _id")
//       .populate("createdBy", "name email");

//     if (!auction) {
//       const msg = `Auction ${auctionId} not found.`;
//       if (res) return res.status(404).json({ success: false, message: msg });
//       return { success: false, error: msg };
//     }

//     if (auction.status === "ended") {
//       const msg = `Auction "${auction.productName}" already ended.`;
//       if (res) return res.status(400).json({ success: false, message: msg });
//       return { success: false, error: msg };
//     }

//     // End auction
//     auction.status = "ended";
//     auction.isActive = false;
//     auction.endedAt = new Date();
//     await auction.save();

//     if (!auction.highestBidder) {
//       const msg = `Auction "${auction.productName}" ended — no bids were placed.`;
//       if (res) return res.status(200).json({ success: true, message: msg });
//       return { success: true, message: msg };
//     }

//     // Determine finalPaise (robust)
//     let finalPaise = auction.finalPricePaise ?? auction.currentPricePaise ?? (auction.currentPrice != null ? Math.round(Number(auction.currentPrice) * 100) : null);
//     if ((!finalPaise || finalPaise <= 0) && Array.isArray(auction.bids) && auction.bids.length > 0) {
//       const latest = auction.bids[0];
//       finalPaise = latest?.amountPaise ?? (latest?.amount != null ? Math.round(Number(latest.amount) * 100) : null);
//     }
//     if (!finalPaise || finalPaise <= 0) {
//       finalPaise = auction.startingPricePaise ?? (auction.startingPrice != null ? Math.round(Number(auction.startingPrice) * 100) : null);
//     }
//     if (!finalPaise || finalPaise <= 0) {
//       const errMsg = "Invalid final price for auction";
//       if (res) return res.status(500).json({ success: false, message: errMsg });
//       return { success: false, error: errMsg };
//     }

//     // Prepare deposit override values (if any) — if you accept depositPercent or amount in req body you can read them
//     // Example: const depositPercentOverride = auction.depositPercent; // or use req body
//     const depositPercentOverride = auction.depositPercent ?? null;
//     const depositAmountPaiseOverride = auction.depositAmountPaise ?? null;

//     // Generate payment link, which will deduct deposit and create PaymentRecord for amountDue
//     const gp = await generatePaymentLink({
//       auctionId: auction._id.toString(),
//       userId: auction.highestBidder._id.toString(),
//       amountPaise: finalPaise,
//       productName: auction.productName,
//       address: auction.shippingAddress || {},
//       depositPercent: depositPercentOverride,
//       depositAmountPaise: depositAmountPaiseOverride,
//     });

//     if (!gp.success) {
//       console.error("Payment link generation failed:", gp.error);
//       if (res) return res.status(500).json({ success: false, message: "Payment link creation failed", error: gp.error });
//       return { success: false, error: gp.error };
//     }

//     // gp contains amountPaise (final), depositPaise, depositPercent, amountDuePaise, checkoutUrl, orderDb
//     const { checkoutUrl, orderDb, depositPaise, depositPercent, amountDuePaise, amountPaise } = gp;

//     console.log(`Auction ended: ${auction.productName}. Final (₹${(amountPaise/100).toFixed(2)}). Deposit: ₹${(depositPaise/100).toFixed(2)} (${depositPercent ?? "fixed"}). Due: ₹${(amountDuePaise/100).toFixed(2)}. Link: ${checkoutUrl}`);

//     // Notify winner via email (show full breakdown)
//     try {
//       await sendAuctionWinEmail(
//         auction.highestBidder.email,
//         auction.highestBidder.name,
//         auction.productName,
//         amountPaise,      // final total (paise)
//         depositPaise,     // deposit paise
//         depositPercent,   // may be null if fixed
//         amountDuePaise,   // paise to pay now
//         checkoutUrl
//       );
//     } catch (err) {
//       console.error("sendAuctionWinEmail failed:", err);
//       // continue
//     }

//     // schedule reminder if amountDue > 0
//     if (amountDuePaise > 0) {
//       const REMINDER_DELAY_MS = 12 * 60 * 60 * 1000;
//       setTimeout(async () => {
//         try {
//           await sendPaymentReminderEmail(
//             auction.highestBidder.email,
//             auction.highestBidder.name,
//             auction.productName,
//             amountPaise,
//             depositPaise,
//             depositPercent,
//             amountDuePaise,
//             checkoutUrl
//           );
//           console.log(`Reminder sent to ${auction.highestBidder.email}`);
//         } catch (remErr) {
//           console.error("Reminder send failed:", remErr);
//         }
//       }, REMINDER_DELAY_MS);
//     } else {
//       console.log("No reminder scheduled because amountDuePaise is 0 (deposit covers full amount).");
//     }

//     // emit socket
//     if (global.io && typeof global.io.emit === "function") {
//       global.io.emit("auctionEnded", {
//         auctionId: auction._id.toString(),
//         winner: { id: auction.highestBidder._id.toString(), name: auction.highestBidder.name, email: auction.highestBidder.email },
//         finalPricePaise: amountPaise,
//         finalPriceRupees: (amountPaise/100).toFixed(2),
//         depositPaise,
//         amountDuePaise,
//         orderId: orderDb?._id || null,
//         paymentLink: checkoutUrl,
//       });
//     }

//     if (res) {
//       return res.status(200).json({
//         success: true,
//         message: "Auction ended and winner notified.",
//         data: {
//           auction: { id: auction._id, productName: auction.productName, finalPricePaise: amountPaise },
//           payment: { orderId: orderDb?._id, checkoutUrl, depositPaise, depositPercent, amountDuePaise }
//         }
//       });
//     }

//     return { success: true, checkoutUrl, orderId: orderDb?._id, amountPaise, depositPaise, amountDuePaise };
//   } catch (err) {
//     console.error("endAuctionAndNotifyWinner error:", err && (err.message || err));
//     if (res) return res.status(500).json({ success: false, message: "Internal server error", error: err.message || String(err) });
//     return { success: false, error: err.message || String(err) };
//   }
// };

// export const endAuctionAndNotifyWinner = async (auctionIdOrReq, res = null) => {
//   try {
//     // resolve auction id if first arg is req
//     const auctionId =
//       auctionIdOrReq?.params?.auctionId ? auctionIdOrReq.params.auctionId : auctionIdOrReq;

//     if (!auctionId) {
//       const msg = "Auction ID is required";
//       if (res) return res.status(400).json({ success: false, message: msg });
//       return { success: false, error: msg };
//     }

//     // fetch auction with bidder info
//     const auction = await Auction.findById(auctionId)
//       .populate("highestBidder", "name email _id")
//       .populate("createdBy", "name email _id")
//       .lean();

//     if (!auction) {
//       const msg = `Auction ${auctionId} not found`;
//       if (res) return res.status(404).json({ success: false, message: msg });
//       return { success: false, error: msg };
//     }

//     if (auction.status === "ended") {
//       const msg = `Auction "${auction.productName}" already ended`;
//       if (res) return res.status(400).json({ success: false, message: msg });
//       return { success: false, error: msg };
//     }

//     // compute finalPaise in a robust way (paise integer)
//     let finalPaise =
//       Number(auction.finalPricePaise ?? auction.currentPricePaise ?? 0) ||
//       (auction.currentPrice ? Math.round(Number(auction.currentPrice) * 100) : 0);

//     // try fallback to last bid in array if still missing
//     if ((!finalPaise || finalPaise <= 0) && Array.isArray(auction.bids) && auction.bids.length > 0) {
//       const latest = auction.bids[0] || auction.bids[auction.bids.length - 1];
//       finalPaise = Number(latest?.amountPaise ?? (latest?.amount ? Math.round(Number(latest.amount) * 100) : 0));
//     }

//     // final fallback to starting price
//     if ((!finalPaise || finalPaise <= 0) && (auction.startingPricePaise || auction.startingPrice)) {
//       finalPaise = Number(auction.startingPricePaise ?? Math.round(Number(auction.startingPrice) * 100));
//     }

//     if (!finalPaise || finalPaise <= 0) {
//       const msg = `Invalid final price for auction ${auctionId}`;
//       if (res) return res.status(500).json({ success: false, message: msg });
//       return { success: false, error: msg };
//     }

//     // mark auction ended (use findByIdAndUpdate so this function is idempotent if called twice)
//     const endedAt = new Date();
//     await Auction.findByIdAndUpdate(
//       auctionId,
//       { status: "ended", isActive: false, endedAt },
//       { new: true, runValidators: true }
//     );

//     // If there's no highest bidder, return success but nothing to notify
//     if (!auction.highestBidder || !auction.highestBidder._id) {
//       const msg = `Auction "${auction.productName}" ended — no bids placed`;
//       if (res) return res.status(200).json({ success: true, message: msg });
//       return { success: true, message: msg };
//     }

//     // prepare deposit overrides (if you want to allow overriding via auction fields or request body)
//     const depositPercent = auction.depositPercent ?? null;
//     const depositAmountPaise = auction.depositAmountPaise ?? null;

//     // generate payment link (this persist PaymentRecord inside your generatePaymentLink)
//     const gp = await generatePaymentLink({
//       auctionId: auction._id.toString(),
//       userId: auction.highestBidder._id.toString(),
//       amountPaise: finalPaise,
//       productName: auction.productName,
//       address: auction.shippingAddress || (auction.address ? auction.address : {}),
//       depositPercent,
//       depositAmountPaise,
//     });

//     // gp may vary depending on your implementation. support both shapes:
//     // { success, frontendCheckoutUrl, paymentRecord, paymentLink, razorpayUrl, amountPaise, depositPaise, amountDuePaise, error }
//     // or older: { success, checkoutUrl, orderDb, ... }
//     if (!gp || gp.success === false) {
//       // log, but continue — we'll still notify winner with fallback checkout url if possible
//       console.error("generatePaymentLink failed:", gp?.error || gp);
//     }

//     // normalize values from gp with fallbacks
//     const paymentRecord = gp?.paymentRecord || gp?.orderDb || null;
//     const paymentLink = gp?.paymentLink || null;
//     const razorpayShortUrl = gp?.razorpayUrl || (paymentLink && (paymentLink.short_url || paymentLink.long_url)) || null;
//     const amountDuePaise = gp?.amountDuePaise ?? gp?.amountDue ?? (gp?.amountDuePaise === 0 ? 0 : null) ?? Math.max(0, (gp?.amountPaise ?? finalPaise) - (gp?.depositPaise ?? 0));
//     const depositPaise = gp?.depositPaise ?? (paymentRecord?.depositPaise ?? 0);
//     const checkoutUrlFromGp = gp?.frontendCheckoutUrl || gp?.checkoutUrl || razorpayShortUrl || null;

//     // build a robust frontend checkout url (prefer razorpay short url; else use your frontend route with order_id)
//     let frontendCheckoutUrl = checkoutUrlFromGp;
//     if (!frontendCheckoutUrl) {
//       // prefer razorpay order id if present on gp or paymentRecord
//       const rOrderId = gp?.razorpayOrderId || paymentRecord?.razorpayOrderId || null;
//       const paymentLinkId = paymentRecord?.paymentRef || gp?.paymentRef || null;
//       frontendCheckoutUrl = buildFrontendCheckoutUrl({
//         razorpayOrderId: rOrderId || "",
//         paymentLinkId: paymentLinkId || "",
//         auctionId: auction._id.toString(),
//         productName: auction.productName || "",
//         amountPaise: amountDuePaise ?? finalPaise,
//       });
//     }

//     // debug console
//     console.log("==== Auction ended summary ====");
//     console.log("auctionId:", auctionId);
//     console.log("product:", auction.productName);
//     console.log("winner:", `${auction.highestBidder.name} <${auction.highestBidder.email}>`);
//     console.log("finalPaise:", finalPaise, "depositPaise:", depositPaise, "amountDuePaise:", amountDuePaise);
//     console.log("paymentRecordId:", paymentRecord?._id ?? null);
//     console.log("razorpayShortUrl:", razorpayShortUrl);
//     console.log("frontendCheckoutUrl:", frontendCheckoutUrl);
//     console.log("================================");

//     // send winner email (non-fatal)
//     try {
//       await sendAuctionWinEmail(
//         auction.highestBidder.email,
//         auction.highestBidder.name,
//         auction.productName,
//         finalPaise,
//         depositPaise,
//         depositPercent,
//         amountDuePaise,
//         frontendCheckoutUrl
//       );
//     } catch (mailErr) {
//       console.error("sendAuctionWinEmail error:", mailErr);
//       // continue
//     }

//     // schedule a reminder only when there's an outstanding due > 0
//     if (Number(amountDuePaise) > 0) {
//       // default reminder delay (12 hours). allow override by env var (ms)
//       const REMINDER_DELAY_MS = process.env.AUCTION_REMINDER_MS ? Number(process.env.AUCTION_REMINDER_MS) : 12 * 60 * 60 * 1000;

//       // send reminder later
//       setTimeout(async () => {
//         try {
//           // try to send reminder using paymentRecordId first (preferred)
//           if (paymentRecord && paymentRecord._id) {
//             await sendPaymentReminderEmail({ paymentRecordId: paymentRecord._id });
//           } else {
//             // fallback: call with explicit fields
//             await sendPaymentReminderEmail({
//               userEmail: auction.highestBidder.email,
//               userName: auction.highestBidder.name,
//               productName: auction.productName,
//               finalPaise,
//               depositPaise,
//               depositPercent,
//               amountDuePaise,
//             });
//           }
//           console.log("Payment reminder sent to", auction.highestBidder.email);
//         } catch (remErr) {
//           console.error("Reminder send failed:", remErr);
//         }
//       }, REMINDER_DELAY_MS);
//     }

//     // emit socket event if available
//     try {
//       if (global.io && typeof global.io.emit === "function") {
//         global.io.emit("auctionEnded", {
//           auctionId: auction._id.toString(),
//           productName: auction.productName,
//           winner: {
//             id: auction.highestBidder._id.toString(),
//             name: auction.highestBidder.name,
//             email: auction.highestBidder.email,
//           },
//           finalPricePaise: finalPaise,
//           depositPaise,
//           amountDuePaise,
//           paymentRecordId: paymentRecord?._id ?? null,
//           paymentLink: razorpayShortUrl ?? frontendCheckoutUrl,
//         });
//       }
//     } catch (emitErr) {
//       console.warn("socket emit error:", emitErr);
//     }

//     // respond
//     const responsePayload = {
//       success: true,
//       message: "Auction ended and winner notified.",
//       data: {
//         auction: { id: auction._id, productName: auction.productName, finalPricePaise: finalPaise },
//         payment: {
//           paymentRecordId: paymentRecord?._id ?? null,
//           frontendCheckoutUrl,
//           razorpayShortUrl,
//           depositPaise,
//           amountDuePaise,
//         },
//       },
//     };

//     if (res) return res.status(200).json(responsePayload);
//     return responsePayload;
//   } catch (err) {
//     console.error("endAuctionAndNotifyWinner error:", err && (err.message || err));
//     if (res) return res.status(500).json({ success: false, message: "Internal server error", error: err?.message || String(err) });
//     return { success: false, error: err?.message || String(err) };
//   }
// };

// export const endAuctionAndNotifyWinner = async (auctionIdOrReq, res = null) => {
//   try {
//     const auctionId =
//       auctionIdOrReq?.params?.auctionId
//         ? auctionIdOrReq.params.auctionId
//         : auctionIdOrReq;

//     if (!auctionId) {
//       const msg = "Auction ID is required";
//       if (res) return res.status(400).json({ success: false, message: msg });
//       return { success: false, error: msg };
//     }

//     /* ----------------------------------
//        Fetch Auction with Bids
//     ---------------------------------- */
//     const auction = await Auction.findById(auctionId)
//       .populate("highestBidder", "name email _id")
//       .populate("createdBy", "name email _id")
//       .populate("bids.user", "name email _id") // ⭐ IMPORTANT
//       .lean();

//     if (!auction) {
//       const msg = "Auction not found";
//       if (res) return res.status(404).json({ success: false, message: msg });
//       return { success: false, error: msg };
//     }

//     if (auction.status === "ended") {
//       const msg = "Auction already ended";
//       if (res) return res.status(400).json({ success: false, message: msg });
//       return { success: false, error: msg };
//     }

//     /* ----------------------------------
//        Calculate Final Price
//     ---------------------------------- */
//     let finalPaise =
//       Number(auction.finalPricePaise ?? auction.currentPricePaise ?? 0) ||
//       (auction.currentPrice ? Math.round(Number(auction.currentPrice) * 100) : 0);

//     if ((!finalPaise || finalPaise <= 0) && auction.bids?.length) {
//       const topBid = auction.bids[0];
//       finalPaise = Number(topBid.amountPaise ?? Math.round(topBid.amount * 100));
//     }

//     if (!finalPaise || finalPaise <= 0) {
//       const msg = "Invalid final price";
//       if (res) return res.status(500).json({ success: false, message: msg });
//       return { success: false, error: msg };
//     }

//     /* ----------------------------------
//        Mark Auction Ended
//     ---------------------------------- */
//     await Auction.findByIdAndUpdate(
//       auctionId,
//       { status: "ended", isActive: false, endedAt: new Date() },
//       { new: true }
//     );

//     /* ----------------------------------
//        No bids case
//     ---------------------------------- */
//     if (!auction.highestBidder) {
//       const msg = "Auction ended – no bids placed";
//       if (res) return res.status(200).json({ success: true, message: msg });
//       return { success: true, message: msg };
//     }

//     /* ----------------------------------
//        Generate Payment
//     ---------------------------------- */
//     const gp = await generatePaymentLink({
//       auctionId: auction._id.toString(),
//       userId: auction.highestBidder._id.toString(),
//       amountPaise: finalPaise,
//       productName: auction.productName,
//       address: auction.shippingAddress || {},
//       depositPercent: auction.depositPercent ?? null,
//       depositAmountPaise: auction.depositAmountPaise ?? null,
//     });

//     const paymentRecord = gp?.paymentRecord || null;
//     const amountDuePaise =
//       gp?.amountDuePaise ??
//       Math.max(0, finalPaise - (gp?.depositPaise ?? 0));

//     const frontendCheckoutUrl =
//       gp?.frontendCheckoutUrl ||
//       buildFrontendCheckoutUrl({
//         auctionId: auction._id.toString(),
//         productName: auction.productName,
//         amountPaise: amountDuePaise,
//         paymentLinkId: paymentRecord?.paymentRef || "",
//       });

//     /* ----------------------------------
//        ✅ WINNER EMAIL
//     ---------------------------------- */
//     await sendAuctionWinEmail(
//       auction.highestBidder.email,
//       auction.highestBidder.name,
//       auction.productName,
//       finalPaise,
//       gp?.depositPaise ?? 0,
//       auction.depositPercent ?? null,
//       amountDuePaise,
//       frontendCheckoutUrl
//     );

//     /* ----------------------------------
//        ✅ SECOND HIGHEST BIDDER EMAIL
//     ---------------------------------- */
//     // sendSecondBidderEmail
//     // if (auction.bids?.length >= 2) {
//     //   const secondBid = auction.bids[1];
//     //   if (secondBid?.user?.email) {
//     //     await sendSecondBidderEmail({
//     //       to: secondBid.user.email,
//     //       name: secondBid.user.name,
//     //       product: auction.productName,
//     //       amountPaise: secondBid.amountPaise,
//     //       paymentLink: frontendCheckoutUrl,
//     //     });
//     //   }
//     // }


//     let secondBidder = null;

// if (Array.isArray(auction.bids) && auction.bids.length >= 2) {
//   // bids assumed sorted DESC (highest first)
//   secondBidder = auction.bids[1]; // 🥈 second highest
// }

//   if (secondBidder?.user?.email) {
//   await sendSecondBidderEmail({
//     userEmail: secondBidder.user.email,
//     userName: secondBidder.user.name,
//     productName: auction.productName,
//     finalPaise,
//     depositPaise,
//     depositPercent,
//     amountDuePaise,
//     frontendCheckoutUrl,
//   });
// }


//     /* ----------------------------------
//        ✅ LOST BIDDERS REFUND EMAIL
//     ---------------------------------- */
//     // sendAuctionLostRefundEmail
//     // if (auction.bids?.length) {
//     //   const winnerId = auction.highestBidder._id.toString();

//     //   const uniqueLosers = new Map();

//     //   auction.bids.forEach((bid) => {
//     //     if (bid.user && bid.user._id.toString() !== winnerId) {
//     //       uniqueLosers.set(bid.user._id.toString(), bid.user);
//     //     }
//     //   });

//     //   for (const [, loser] of uniqueLosers) {
//     //     await sendAuctionLostRefundEmail({
//     //       to: loser.email,
//     //       name: loser.name,
//     //       product: auction.productName,
//     //     });
//     //   }
//     // }

//    // ================= LOST BIDDERS REFUND =================
// if (Array.isArray(auction.bids)) {
//   const winnerId = auction.highestBidder._id.toString();
//   const notified = new Set();

//   for (const bid of auction.bids) {
//     if (
//       bid?.user &&
//       bid.user._id.toString() !== winnerId &&
//       !notified.has(bid.user._id.toString())
//     ) {
//       notified.add(bid.user._id.toString());

//       await sendAuctionLostRefundEmail({
//         userEmail: bid.user.email,
//         userName: bid.user.name,
//         productName: auction.productName,
//         depositPaise,
//       });
//     }
//   }
// }



//     /* ----------------------------------
//        RESPONSE
//     ---------------------------------- */
//     const responsePayload = {
//       success: true,
//       message: "Auction ended, winner & bidders notified",
//       data: {
//         auctionId: auction._id,
//         productName: auction.productName,
//         finalPaise,
//         amountDuePaise,
//         paymentRecordId: paymentRecord?._id ?? null,
//         frontendCheckoutUrl,
//       },
//     };

//     if (res) return res.status(200).json(responsePayload);
//     return responsePayload;
//   } catch (err) {
//     console.error("endAuctionAndNotifyWinner error:", err);
//     if (res) {
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error: err.message,
//       });
//     }
//     return { success: false, error: err.message };
//   }
// };

// export const endAuctionAndNotifyWinner = async (auctionIdOrReq, res = null) => {
//   try {
//     console.log("🟢 endAuctionAndNotifyWinner START");

//     const auctionId =
//       auctionIdOrReq?.params?.auctionId
//         ? auctionIdOrReq.params.auctionId
//         : auctionIdOrReq;

//     console.log("🟡 Auction ID:", auctionId);

//     if (!auctionId) throw new Error("Auction ID is required");

//     /* ----------------------------------
//        FETCH AUCTION
//     ---------------------------------- */
//     const auction = await Auction.findById(auctionId)
//       .populate("highestBidder", "name email _id")
//       .populate("createdBy", "name email _id")
//       .populate("bids.user", "name email _id")
//       .lean();

//     console.log("🟡 Auction fetched");

//     if (!auction) throw new Error("Auction not found");

//     if (auction.status === "ended") {
//       console.log("⚠ Auction already ended");
//       return;
//     }

//     /* ----------------------------------
//        VALIDATE HIGHEST BIDDER
//     ---------------------------------- */
//     if (
//       !auction.highestBidder ||
//       !auction.highestBidder.email
//     ) {
//       console.error("❌ highestBidder missing:", auction.highestBidder);
//       throw new Error("Highest bidder email not found");
//     }

//     console.log("🏆 Winner:", auction.highestBidder.email);

//     /* ----------------------------------
//        SORT BIDS DESC
//     ---------------------------------- */
//     const bids = Array.isArray(auction.bids)
//       ? [...auction.bids].sort(
//           (a, b) =>
//             (b.amountPaise ?? b.amount * 100) -
//             (a.amountPaise ?? a.amount * 100)
//         )
//       : [];

//     console.log("📊 Total bids:", bids.length);

//     /* ----------------------------------
//        FINAL PRICE
//     ---------------------------------- */
//     const topBid = bids[0];
//     const finalPaise =
//       auction.finalPricePaise ??
//       auction.currentPricePaise ??
//       topBid?.amountPaise ??
//       Math.round(topBid?.amount * 100);

//     if (!finalPaise || finalPaise <= 0)
//       throw new Error("Invalid final price");

//     console.log("💰 Final price paise:", finalPaise);

//     /* ----------------------------------
//        END AUCTION
//     ---------------------------------- */
//     await Auction.findByIdAndUpdate(auctionId, {
//       status: "ended",
//       isActive: false,
//       endedAt: new Date(),
//     });

//     console.log("✅ Auction marked ended");

//     /* ----------------------------------
//        PAYMENT LINK
//     ---------------------------------- */
//     console.log("🟡 Generating payment link");

//     const gp = await generatePaymentLink({
//       auctionId: auction._id.toString(),
//       userId: auction.highestBidder._id.toString(),
//       amountPaise: finalPaise,
//       productName: auction.productName,
//       address: auction.shippingAddress || {},
//       depositPercent: auction.depositPercent ?? null,
//       depositAmountPaise: auction.depositAmountPaise ?? null,
//     });

//     if (!gp) throw new Error("Payment link generation failed");

//     console.log("✅ Payment link generated");

//     const depositPaise = gp.depositPaise ?? 0;
//     const depositPercent = auction.depositPercent ?? null;

//     const amountDuePaise =
//       gp.amountDuePaise ?? Math.max(0, finalPaise - depositPaise);

//     const frontendCheckoutUrl = gp.frontendCheckoutUrl;

//     console.log("💳 Checkout URL:", frontendCheckoutUrl);

//     /* ----------------------------------
//        🏆 WINNER EMAIL (FIXED)
//     ---------------------------------- */
//     console.log("📧 Sending WINNER email...");

//     try {
//       await sendAuctionWinEmail(
//         auction.highestBidder.email,
//         auction.highestBidder.name,
//         auction.productName,
//         finalPaise,
//         depositPaise,
//         depositPercent,
//         amountDuePaise,
//         frontendCheckoutUrl
//       );
//       console.log("✅ WINNER EMAIL SENT");
//     } catch (emailErr) {
//       console.error("❌ Winner email FAILED:", emailErr);
//       throw emailErr;
//     }

//     /* ----------------------------------
//        🥈 SECOND BIDDER EMAIL
//     ---------------------------------- */
//     const secondBidder = bids[1];

//     if (secondBidder?.user?.email) {
//       console.log("📧 Sending SECOND BIDDER email:", secondBidder.user.email);

//       try {
//         await sendSecondBidderEmail({
//           userEmail: secondBidder.user.email,
//           userName: secondBidder.user.name,
//           productName: auction.productName,
//           finalPaise,
//           depositPaise,
//           depositPercent,
//           amountDuePaise,
//           frontendCheckoutUrl,
//         });
//         console.log("✅ Second bidder email sent");
//       } catch (err) {
//         console.error("❌ Second bidder email failed:", err.message);
//       }
//     }

//     /* ----------------------------------
//        ❌ LOST BIDDERS EMAIL
//     ---------------------------------- */
//     const winnerId = auction.highestBidder._id.toString();
//     const notified = new Set();

//     for (const bid of bids) {
//       if (
//         bid?.user &&
//         bid.user._id.toString() !== winnerId &&
//         !notified.has(bid.user._id.toString())
//       ) {
//         notified.add(bid.user._id.toString());

//         console.log("📧 Sending LOST email:", bid.user.email);

//         try {
//           await sendAuctionLostRefundEmail({
//             userEmail: bid.user.email,
//             userName: bid.user.name,
//             productName: auction.productName,
//             depositPaise,
//           });
//           console.log("✅ Lost email sent:", bid.user.email);
//         } catch (err) {
//           console.error("❌ Lost email failed:", err.message);
//         }
//       }
//     }

//     console.log("🎉 AUCTION FLOW COMPLETED");

//     if (res)
//       return res.json({
//         success: true,
//         message: "Auction ended & all emails sent",
//       });

//   } catch (err) {
//     console.error("🔥 endAuctionAndNotifyWinner ERROR:", err);
//     if (res)
//       return res.status(500).json({
//         success: false,
//         message: err.message,
//       });
//   }
// };

// export const endAuctionAndNotifyWinner = async (auctionIdOrReq, res = null) => {
//   try {
//     console.log("🟢 endAuctionAndNotifyWinner START");

//     const auctionId =
//       auctionIdOrReq?.params?.auctionId
//         ? auctionIdOrReq.params.auctionId
//         : auctionIdOrReq;

//     if (!auctionId) throw new Error("Auction ID is required");

//     /* ----------------------------------
//        FETCH AUCTION
//     ---------------------------------- */
//     const auction = await Auction.findById(auctionId)
//       .populate("highestBidder", "name email _id")
//       .populate({
//         path: "bids",
//         populate: {
//           path: "bidder",
//           select: "name email _id",
//         },
//       })
//       .lean();

//     if (!auction) throw new Error("Auction not found");

//     console.log("🏆 Winner:", auction.highestBidder?.email);

//     if (!auction.highestBidder?.email)
//       throw new Error("Highest bidder email missing");

//     /* ----------------------------------
//        SORT BIDS (DESC)
//     ---------------------------------- */
//     const bids = [...(auction.bids || [])].sort(
//       (a, b) =>
//         (b.amountPaise ?? b.amount * 100) -
//         (a.amountPaise ?? a.amount * 100)
//     );

//     console.log("📊 Total bids:", bids.length);

//     /* ----------------------------------
//        UNIQUE BIDDERS (ORDERED)
//     ---------------------------------- */
//     const uniqueBidders = [];
//     const seen = new Set();

//     for (const bid of bids) {
//       if (!bid?.bidder?._id) continue;

//       const id = bid.bidder._id.toString();
//       if (!seen.has(id)) {
//         seen.add(id);
//         uniqueBidders.push(bid.bidder);
//       }
//     }

//     console.log(
//       "👥 Unique bidders:",
//       uniqueBidders.map((u) => u.email)
//     );

//     /* ----------------------------------
//        FINAL PRICE
//     ---------------------------------- */
//     const topBid = bids[0];
//     const finalPaise =
//       auction.finalPricePaise ??
//       topBid?.amountPaise ??
//       Math.round(topBid?.amount * 100);

//     if (!finalPaise || finalPaise <= 0)
//       throw new Error("Invalid final price");

//     /* ----------------------------------
//        END AUCTION
//     ---------------------------------- */
//     await Auction.findByIdAndUpdate(auctionId, {
//       status: "ended",
//       isActive: false,
//       endedAt: new Date(),
//     });

//     /* ----------------------------------
//        PAYMENT LINK
//     ---------------------------------- */
//     const gp = await generatePaymentLink({
//       auctionId: auction._id.toString(),
//       userId: auction.highestBidder._id.toString(),
//       amountPaise: finalPaise,
//       productName: auction.productName,
//       depositPercent: auction.depositPercent ?? null,
//     });

//     const depositPaise = gp.depositPaise ?? 0;
//     const depositPercent = auction.depositPercent ?? null;
//     const amountDuePaise =
//       gp.amountDuePaise ?? finalPaise - depositPaise;

//     /* ----------------------------------
//        🏆 WINNER EMAIL
//     ---------------------------------- */
//     console.log("📧 Sending WINNER email:", auction.highestBidder.email);

//     await sendAuctionWinEmail(
//       auction.highestBidder.email,
//       auction.highestBidder.name,
//       auction.productName,
//       finalPaise,
//       depositPaise,
//       depositPercent,
//       amountDuePaise,
//       gp.frontendCheckoutUrl
//     );

//     console.log("✅ WINNER EMAIL SENT");

//     /* ----------------------------------
//        🥈 SECOND HIGHEST BIDDER EMAIL
//     ---------------------------------- */
//     const winnerId = auction.highestBidder._id.toString();

//     const secondHighest = uniqueBidders.find(
//       (u) => u._id.toString() !== winnerId
//     );

//     if (secondHighest) {
//       console.log("📧 Sending SECOND HIGHEST email:", secondHighest.email);

//       await sendSecondBidderEmail({
//         userEmail: secondHighest.email,
//         userName: secondHighest.name,
//         productName: auction.productName,
//         finalPaise,
//         depositPaise,
//         depositPercent,
//         amountDuePaise,
//         frontendCheckoutUrl: gp.frontendCheckoutUrl,
//       });

//       console.log("✅ SECOND HIGHEST EMAIL SENT");
//     } else {
//       console.log("ℹ No second highest bidder");
//     }

//     /* ----------------------------------
//        ❌ LOST BIDDERS EMAIL
//     ---------------------------------- */
//     const lostBidders = uniqueBidders.filter(
//       (u) =>
//         u._id.toString() !== winnerId &&
//         u._id.toString() !== secondHighest?._id.toString()
//     );

//     if (lostBidders.length === 0) {
//       console.log("ℹ No LOST bidders");
//     }

//     for (const user of lostBidders) {
//       console.log("📧 Sending LOST email:", user.email);

//       await sendAuctionLostRefundEmail({
//         userEmail: user.email,
//         userName: user.name,
//         productName: auction.productName,
//         depositPaise,
//       });

//       console.log("✅ LOST EMAIL SENT:", user.email);
//     }

//     console.log("🎉 AUCTION FLOW COMPLETED");

//     if (res) {
//       return res.json({
//         success: true,
//         message: "Auction ended & all bidder emails sent successfully",
//       });
//     }
//   } catch (err) {
//     console.error("🔥 endAuctionAndNotifyWinner ERROR:", err.message);
//     if (res) {
//       return res.status(500).json({
//         success: false,
//         message: err.message,
//       });
//     }
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
    if (!auction.highestBidder?.email)
      throw new Error("Winner email missing");

    /* ---------------- FINAL PRICE ---------------- */
    const bids = [...auction.bids].sort(
      (a, b) => b.amountPaise - a.amountPaise
    );

    const finalPaise = auction.finalPricePaise ?? bids[0].amountPaise;

    /* ---------------- SET PAYMENT WINDOW ---------------- */
    const paymentDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000);

    auction.status = "ended";
    auction.pendingPaymentUntil = paymentDeadline;
    await auction.save();

    /* ---------------- PAYMENT LINK (WINNER) ---------------- */
    const gp = await generatePaymentLink({
      auctionId: auction._id.toString(),
      userId: auction.highestBidder._id.toString(),
      amountPaise: finalPaise,
      productName: auction.productName,
      depositPercent: auction.depositPercent,
    });

    /* ---------------- WINNER EMAIL ---------------- */
    await sendAuctionWinEmail(
      auction.highestBidder.email,
      auction.highestBidder.name,
      auction.productName,
      finalPaise,
      gp.depositPaise,
      auction.depositPercent,
      gp.amountDuePaise,
      gp.frontendCheckoutUrl
    );

    console.log("✅ Winner email sent");

    /* ---------------- LOST BIDDERS ---------------- */
    const winnerId = auction.highestBidder._id.toString();
    const notified = new Set([winnerId]);

    for (const bid of bids) {
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

      console.log("❌ Lost mail sent:", bidder.email);
    }

    console.log("🎉 Auction End Flow Complete");

    res?.json({ success: true });
  } catch (err) {
    console.error("🔥 endAuction error:", err.message);
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
