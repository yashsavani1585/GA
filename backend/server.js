
import express from "express";
import cors from "cors";
import "dotenv/config";
import session from "express-session";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import jwt from 'jsonwebtoken';


// External Services
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import connectRedis from "./config/redis.js";

// Routers
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import orderRouter from "./routes/orderRoute.js";
import authRoutes from "./routes/auth.routes.js";
import formsRouter from "./routes/forms.routes.js";
import pricingRouter from "./routes/pricingRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import blogRouter from "./routes/BlogRoute.js";
import auctionRouter from "./routes/auctionRoute.js";
import paymentRoutes2 from './routes/paymentRoutes2.js';
import adsRouter from "./routes/adsRoute.js";
// Models
import Auction from "./models/auctionModel.js";
import Bid from "./models/bidModel.js";

// Socket Utility
import { setSocketIO } from "./config/socketUtils.js";
import { endAuctionAndNotifyWinner } from "./controllers/auctionController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Connect external services
connectDB();
connectCloudinary();
connectRedis();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "devsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ga-inx6.onrender.com",
  "https://sparkleandshine.vercel.app/",
  "https://sparkleandshine.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));


// API ROUTES
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/forms", formsRouter);
app.use("/api/pricing", pricingRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/blog", blogRouter);
app.use("/api/auction", auctionRouter);
app.use('/api/payment2', paymentRoutes2);
app.use("/api/ads",adsRouter);



app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Auction Backend Running" });
});

setInterval(async () => {
  try {
    const expiredAuctions = await Auction.find({
      status: "live",
      endTime: { $lt: new Date() },
    });

    for (const auction of expiredAuctions) {
      await endAuctionAndNotifyWinner(auction._id); // No req/res needed
    }
  } catch (error) {
    console.error("Error checking expired auctions:", error);
  }
}, 60 * 1000);



// Error middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message || err);
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

// Create HTTP server + attach socket.io
const server = http.createServer(app);
const io = setSocketIO(server);
app.set("io", io);

// --- SOCKET.IO EVENTS ---
// io.on("connection", (socket) => {
//   console.log("🟢 Client connected:", socket.id);

//   const { token } = socket.handshake.auth;
//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       socket.user = { _id: decoded.id };
//       socket.join(`user_${decoded.id}`);
//     } catch (err) {
//       console.log("Socket auth failed:", err.message);
//     }
//   }


//   // const { userId } = socket.handshake.auth || {};
//   // if (userId) {
//   //   socket.join(`user_${userId}`);
//   //   console.log(`👤 User ${userId} joined room.`);
//   // }

//   // Handle placeBid via Socket
//   // socket.on("placeBid", async ({ auctionId, bidderId, bidAmount }) => {
//   //   try {
//   //     if (!auctionId || !bidderId || !bidAmount)
//   //       return socket.emit("errorMsg", "Invalid bid data");

//   //     const auction = await Auction.findById(auctionId);
//   //     if (!auction) return socket.emit("errorMsg", "Auction not found");
//   //     if (auction.status !== "live") return socket.emit("errorMsg", "Auction not active");
//   //     if (bidAmount <= auction.currentPrice)
//   //       return socket.emit("errorMsg", "Bid too low");

//   //     // Create new bid document
//   //     const newBid = await Bid.create({
//   //       auction: auction._id,
//   //       bidder: bidderId,
//   //       amount: bidAmount,
//   //     });

//   //     // Update auction
//   //     auction.currentPrice = bidAmount;
//   //     auction.highestBidder = bidderId;
//   //     auction.bids.push(newBid._id);
//   //     auction.bidsCount = auction.bids.length;
//   //     await auction.save();

//   //     // Populate highestBidder for broadcasting
//   //     const updated = await Auction.findById(auctionId)
//   //       .populate("highestBidder", "name email")
//   //       .populate({
//   //         path: "bids",
//   //         populate: { path: "bidder", select: "name email" },
//   //       })
//   //       .lean();

//   //     // Emit update to all clients
//   //     io.emit("auctionUpdated", updated);
//   //   } catch (err) {
//   //     console.error("Bid error:", err);
//   //     socket.emit("errorMsg", "Error placing bid");
//   //   }
//   // });

// socket.on("placeBid", async ({ auctionId, bidAmount }) => {
//     try {
//       if (!socket.user?._id) return socket.emit("errorMsg", "Unauthorized");

//       const bidderId = socket.user._id;

//       const auction = await Auction.findById(auctionId).populate("highestBidder");
//       if (!auction) return socket.emit("errorMsg", "Auction not found");
//       if (auction.status !== "live") return socket.emit("errorMsg", "Auction not active");

//       // Check bid validity
//       if (bidAmount <= auction.currentPrice)
//         return socket.emit("errorMsg", `Bid too low. Current bid: ₹${auction.currentPrice}`);

//       // Create new bid
//       const bid = await Bid.create({ auction: auction._id, bidder: bidderId, amount: bidAmount });

//       // Update auction
//       auction.currentPrice = bidAmount;
//       auction.highestBidder = bidderId;
//       auction.bids.push(bid._id);
//       auction.bidsCount = auction.bids.length;
//       await auction.save();

//       // Populate for response
//       const updated = await Auction.findById(auctionId)
//         .populate("highestBidder", "name email")
//         .populate({ path: "bids", populate: { path: "bidder", select: "name email" } })
//         .lean();

//       io.emit("auctionUpdated", updated);
//     } catch (err) {
//       console.error("Socket placeBid error:", err);
//       socket.emit("errorMsg", "Error placing bid");
//     }
//   });

//   socket.on("disconnect", () => console.log("🔴 Disconnected:", socket.id));
// });

// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);

//   socket.on("placeBid", async ({ auctionId, bidAmount }) => {
//     try {
//       if (!socket.user?._id) return socket.emit("errorMsg", "Unauthorized");

//       const auction = await Auction.findById(auctionId).populate("bids.bidder highestBidder");
//       if (!auction) return socket.emit("errorMsg", "Auction not found");
//       if (auction.status !== "live") return socket.emit("errorMsg", "Auction not active");
//       if (bidAmount <= (auction.currentPrice || auction.startingPrice))
//         return socket.emit("errorMsg", "Bid too low");

//       const bid = await Bid.create({ auction: auction._id, bidder: socket.user._id, amount: bidAmount });

//       auction.bids.push(bid._id);
//       auction.currentPrice = bidAmount;
//       auction.highestBidder = socket.user._id;
//       auction.bidsCount = auction.bids.length;
//       await auction.save();

//       const updated = await Auction.findById(auctionId)
//         .populate("highestBidder", "name email")
//         .populate({ path: "bids", populate: { path: "bidder", select: "name email" } })
//         .lean();

//       io.emit("auctionUpdated", updated);
//     } catch (err) {
//       console.error("Socket placeBid error:", err);
//       socket.emit("errorMsg", "Error placing bid");
//     }
//   });

//   socket.on("disconnect", () => console.log("Disconnected:", socket.id));
// });


// Socket.IO with JWT authentication
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Authenticate socket using JWT token
  const { token } = socket.handshake.auth;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { _id: decoded.id };
      console.log(`✅ Authenticated socket for user: ${decoded.id}`);
    } catch (err) {
      console.log("Socket auth failed:", err.message);
      socket.emit("errorMsg", "Authentication failed");
      socket.disconnect();
      return;
    }
  } else {
    console.log("No token provided for socket connection");
    socket.emit("errorMsg", "Authentication required");
    socket.disconnect();
    return;
  }

  socket.on("placeBid", async ({ auctionId, bidAmount }) => {
    try {
      if (!socket.user?._id) return socket.emit("errorMsg", "Unauthorized");

      const auction = await Auction.findById(auctionId);
      if (!auction) return socket.emit("errorMsg", "Auction not found");
      if (auction.status !== "live") return socket.emit("errorMsg", "Auction not active");

      // Calculate minimum acceptable bid
      const minBid = auction.currentPrice > 0 ? auction.currentPrice + (auction.minIncrement || 1) : auction.startingPrice;
      
      if (bidAmount <= minBid) {
        return socket.emit("errorMsg", `Bid must be higher than current price. Minimum bid: ₹${minBid}`);
      }

      const bid = await Bid.create({ 
        auction: auctionId, 
        bidder: socket.user._id, 
        amount: bidAmount 
      });

      auction.bids.push(bid._id);
      auction.currentPrice = bidAmount;
      auction.highestBidder = socket.user._id;
      auction.bidsCount = auction.bids.length;
      await auction.save();

      const updated = await Auction.findById(auctionId)
        .populate("highestBidder", "name email")
        .populate({ 
          path: "bids", 
          populate: { path: "bidder", select: "name email" } 
        })
        .lean();

      io.emit("auctionUpdated", updated);
      
    } catch (err) {
      console.error("Socket placeBid error:", err);
      socket.emit("errorMsg", "Error placing bid: " + err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});



  // Notify user verification
  // socket.on("userVerified", ({ userId }) => {
  //   console.log(`📢 Emitting verification to user_${userId}`);
  //   io.to(`user_${userId}`).emit("userVerified", {
  //     userId,
  //     verified: true,
  //     verifiedAt: new Date(),
  //   });
  // });

//   socket.on("disconnect", () => {
//     console.log("🔴 Disconnected:", socket.id);
//   });
// });

server.listen(port, () =>
  console.log(`🚀 Server + Socket running on port ${port}`)
);
