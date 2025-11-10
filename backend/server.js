// // // // // server.js
// // // // import express from "express";
// // // // import cors from "cors";
// // // // import "dotenv/config";
// // // // import connectDB from "./config/mongodb.js";
// // // // import connectCloudinary from "./config/cloudinary.js";
// // // // import connectRedis from "./config/redis.js";
// // // // import session from "express-session";
// // // // import path from "path";
// // // // import { fileURLToPath } from "url";

// // // // // Routers
// // // // import userRouter from "./routes/userRoute.js";
// // // // import productRouter from "./routes/productRoute.js";
// // // // import cartRouter from "./routes/cartRoute.js";
// // // // import wishlistRouter from "./routes/wishlistRoute.js";
// // // // import orderRouter from "./routes/orderRoute.js";
// // // // import authRoutes from "./routes/auth.routes.js";
// // // // import formsRouter from "./routes/forms.routes.js";
// // // // import pricingRouter from "./routes/pricingRoutes.js";

// // // // const app = express();
// // // // const port = process.env.PORT || 4000;

// // // // // ---------------- Connect External Services ----------------
// // // // connectDB();
// // // // connectCloudinary();
// // // // connectRedis();

// // // // // ---------------- Fix __dirname for ES Modules ----------------
// // // // const __filename = fileURLToPath(import.meta.url);
// // // // const __dirname = path.dirname(__filename);

// // // // // ---------------- Body Parsers ----------------
// // // // app.use(express.json({ limit: "10mb" }));
// // // // app.use(express.urlencoded({ extended: true }));

// // // // // ---------------- Session ----------------
// // // // app.use(
// // // //   session({
// // // //     secret: process.env.SESSION_SECRET || "devsecret",
// // // //     resave: false,
// // // //     saveUninitialized: false,
// // // //     cookie: { sameSite: "lax", secure: process.env.NODE_ENV === "production" },
// // // //   })
// // // // );

// // // // // ---------------- CORS Setup ----------------
// // // // const allowedOrigins = [
// // // //   "http://localhost:5173",
// // // //   "http://localhost:5174",
// // // //   "http://127.0.0.1:5173",
// // // //   "http://127.0.0.1:5174",
// // // //   "https://elysianjewels.ca",
// // // //   "https://admin.elysianjewels.ca",
// // // //   "https://everglowb2b.onrender.com",
// // // // ];

// // // // app.use(
// // // //   cors({
// // // //     origin: function (origin, callback) {
// // // //       if (!origin) return callback(null, true);
// // // //       if (allowedOrigins.includes(origin)) return callback(null, true);
// // // //       console.warn("❌ Blocked by CORS:", origin);
// // // //       return callback(new Error("Not allowed by CORS"));
// // // //     },
// // // //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// // // //     credentials: true,
// // // //   })
// // // // );

// // // // // ---------------- API Routes ----------------
// // // // app.use("/api/user", userRouter);
// // // // app.use("/api/product", productRouter);
// // // // app.use("/api/cart", cartRouter);
// // // // app.use("/api/order", orderRouter);
// // // // app.use("/api/auth", authRoutes);
// // // // app.use("/api/wishlist", wishlistRouter);
// // // // app.use("/api/forms", formsRouter);
// // // // app.use("/api/pricing", pricingRouter);

// // // // // ---------------- Serve Frontend (Vite Build) ----------------
// // // // const frontendPath = path.join(__dirname, "../Frontend/dist");
// // // // app.use(express.static(frontendPath));

// // // // // ---------------- React Router Fallback ----------------
// // // // app.get("*", (req, res) => {
// // // //   res.sendFile(path.join(frontendPath, "index.html"), (err) => {
// // // //     if (err) {
// // // //       res.status(500).send(err);
// // // //     }
// // // //   });
// // // // });

// // // // // ---------------- Global Error Handler ----------------
// // // // app.use((err, req, res, next) => {
// // // //   console.error("❌ Server Error:", err.message);
// // // //   res.status(err.status || 500).json({ error: err.message || "Server Error" });
// // // // });

// // // // // ---------------- Start Server ----------------
// // // // app.listen(port, () => {
// // // //   console.log(`🚀 Server started on PORT: ${port}`);
// // // // });

// // // // server.js
// // // // import express from "express";
// // // // import cors from "cors";
// // // // import "dotenv/config";
// // // // import session from "express-session";

// // // // import connectDB from "./config/mongodb.js";
// // // // import connectCloudinary from "./config/cloudinary.js";
// // // // import connectRedis from "./config/redis.js";

// // // // // ---- Routers ----
// // // // import userRouter from "./routes/userRoute.js";
// // // // import productRouter from "./routes/productRoute.js";
// // // // import cartRouter from "./routes/cartRoute.js";
// // // // import wishlistRouter from "./routes/wishlistRoute.js";
// // // // import orderRouter from "./routes/orderRoute.js";
// // // // import authRoutes from "./routes/auth.routes.js";
// // // // import formsRouter from "./routes/forms.routes.js";
// // // // import pricingRouter from "./routes/pricingRoutes.js";
// // // // import paymentRouter from "./routes/paymentRoutes.js"; // ✅ ADD THIS

// // // // const app = express();
// // // // const port = process.env.PORT || 4000;

// // // // // ---------------- Connect External Services ----------------
// // // // connectDB();
// // // // connectCloudinary();
// // // // connectRedis();

// // // // // ---------------- Body Parsers ----------------
// // // // app.use(express.json({ limit: "10mb" }));
// // // // app.use(express.urlencoded({ extended: true }));

// // // // // ---------------- Session Setup ----------------
// // // // app.use(
// // // //   session({
// // // //     secret: process.env.SESSION_SECRET || "devsecret",
// // // //     resave: false,
// // // //     saveUninitialized: false,
// // // //     name: "everglowOAuth",
// // // //     cookie: {
// // // //       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
// // // //       secure: process.env.NODE_ENV === "production",
// // // //       httpOnly: true,
// // // //       maxAge: 30 * 60 * 1000, // 30 minutes
// // // //     },
// // // //     ...(process.env.NODE_ENV === "production" && { proxy: true }),
// // // //   })
// // // // );

// // // // // ---------------- CORS Setup ----------------
// // // // const allowedOrigins = [
// // // //   "http://localhost:5173",
// // // //   "http://localhost:5174",
// // // //   "http://127.0.0.1:5173",
// // // //   "http://127.0.0.1:5174",
// // // //   "https://elysianjewels.ca",
// // // //   "https://admin.elysianjewels.ca",
// // // //   "https://gemsglobaljewels.com",
// // // //   "https://everglowb2b.onrender.com",
// // // // ];

// // // // app.use(
// // // //   cors({
// // // //     origin: (origin, callback) => {
// // // //       if (!origin) return callback(null, true); // allow curl/postman
// // // //       if (allowedOrigins.includes(origin)) return callback(null, true);
// // // //       console.warn("❌ Blocked by CORS:", origin);
// // // //       return callback(new Error("Not allowed by CORS"));
// // // //     },
// // // //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// // // //     credentials: true,
// // // //   })
// // // // );

// // // // // ---------------- API Routes ----------------
// // // // app.use("/api/user", userRouter);
// // // // app.use("/api/product", productRouter);
// // // // app.use("/api/cart", cartRouter);
// // // // app.use("/api/order", orderRouter);
// // // // app.use("/api/auth", authRoutes);
// // // // app.use("/api/wishlist", wishlistRouter);
// // // // app.use("/api/forms", formsRouter);
// // // // app.use("/api/pricing", pricingRouter);
// // // // app.use("/api/payment", paymentRouter); // ✅ REGISTER PAYMENT ROUTE

// // // // // ---------------- Error Handler ----------------
// // // // app.use((err, req, res, next) => {
// // // //   console.error("❌ Server Error:", err.message || err);
// // // //   res.status(err.status || 500).json({ error: err.message || "Server Error" });
// // // // });

// // // // // ---------------- Start Server ----------------
// // // // app.listen(port, () => {
// // // //   console.log(`🚀 Backend API running on PORT: ${port}`);
// // // // });


// // // import express from "express";
// // // import cors from "cors";
// // // import "dotenv/config";
// // // import session from "express-session";
// // // import http from "http";
// // // import { Server } from "socket.io";

// // // // ---------------- External Services ----------------
// // // import connectDB from "./config/mongodb.js";
// // // import connectCloudinary from "./config/cloudinary.js";
// // // import connectRedis from "./config/redis.js";

// // // // ---------------- Routers ----------------
// // // import userRouter from "./routes/userRoute.js";
// // // import productRouter from "./routes/productRoute.js";
// // // import cartRouter from "./routes/cartRoute.js";
// // // import wishlistRouter from "./routes/wishlistRoute.js";
// // // import orderRouter from "./routes/orderRoute.js";
// // // import authRoutes from "./routes/auth.routes.js";
// // // import formsRouter from "./routes/forms.routes.js";
// // // import pricingRouter from "./routes/pricingRoutes.js";
// // // import paymentRouter from "./routes/paymentRoutes.js";
// // // import BlogRouter from "./routes/BlogRoute.js";

// // // const app = express();
// // // const port = process.env.PORT || 4000;

// // // // ---------------- Connect External Services ----------------
// // // connectDB();
// // // connectCloudinary();
// // // connectRedis();

// // // // ---------------- Body Parsers ----------------
// // // app.use(express.json({ limit: "10mb" }));
// // // app.use(express.urlencoded({ extended: true }));

// // // // ---------------- Session Setup ----------------
// // // app.use(
// // //   session({
// // //     secret: process.env.SESSION_SECRET || "devsecret",
// // //     resave: false,
// // //     saveUninitialized: true, // important for local testing
// // //     cookie: {
// // //       maxAge: 30 * 60 * 1000, // 30 mins
// // //       httpOnly: true,
// // //       secure: false, // must be false for localhost
// // //       sameSite: "lax", // critical for OAuth in localhost
// // //     },
// // //   })
// // // );

// // // // ---------------- CORS Setup ----------------
// // // const allowedOrigins = [
// // //   "http://localhost:5173",
// // //   "http://localhost:5174"
// // // ];

// // // app.use(
// // //   cors({
// // //     origin: (origin, callback) => {
// // //       if (!origin) return callback(null, true); // allow curl/postman
// // //       if (allowedOrigins.includes(origin)) return callback(null, true);
// // //       console.warn("❌ Blocked by CORS:", origin);
// // //       return callback(new Error("Not allowed by CORS"));
// // //     },
// // //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// // //     credentials: true,
// // //   })
// // // );

// // // // ---------------- API Routes ----------------
// // // app.use("/api/user", userRouter);
// // // app.use("/api/product", productRouter);
// // // app.use("/api/cart", cartRouter);
// // // app.use("/api/order", orderRouter);
// // // app.use("/api/auth", authRoutes);
// // // app.use("/api/wishlist", wishlistRouter);
// // // app.use("/api/forms", formsRouter);
// // // app.use("/api/pricing", pricingRouter);
// // // app.use("/api/payment", paymentRouter);
// // // app.use("/api/blog", BlogRouter);

// // // // ---------------- Error Handler ----------------
// // // app.use((err, req, res, next) => {
// // //   console.error("❌ Server Error:", err.message || err);
// // //   res.status(err.status || 500).json({ error: err.message || "Server Error" });
// // // });

// // // // ---------------- Create HTTP Server & Socket.io ----------------
// // // const server = http.createServer(app);
// // // const io = new Server(server, {
// // //   cors: { origin: allowedOrigins, credentials: true },
// // // });

// // // // ---------------- Auction Data ----------------
// // // let auctionItems = [
// // //   { id: 1, name: "Gold Ring", currentBid: 12000, highestBidder: "N/A" },
// // //   { id: 2, name: "Diamond Necklace", currentBid: 45000, highestBidder: "N/A" },
// // //   { id: 3, name: "Silver Bracelet", currentBid: 8500, highestBidder: "N/A" },
// // //   { id: 4, name: "Pearl Earrings", currentBid: 9200, highestBidder: "N/A" },
// // //   { id: 5, name: "Platinum Pendant", currentBid: 22000, highestBidder: "N/A" },
// // //   { id: 6, name: "Custom Ring Set", currentBid: 15500, highestBidder: "N/A" },
// // // ];

// // // // ---------------- Socket.io Handlers ----------------
// // // io.on("connection", (socket) => {
// // //   console.log("New client connected:", socket.id);

// // //   // Send current auction items to client
// // //   socket.emit("auctionData", auctionItems);

// // //   // Handle new bid from client
// // //   socket.on("placeBid", ({ itemId, bidder, bidAmount }) => {
// // //     auctionItems = auctionItems.map((item) => {
// // //       if (item.id === itemId && bidAmount > item.currentBid) {
// // //         return { ...item, currentBid: bidAmount, highestBidder: bidder };
// // //       }
// // //       return item;
// // //     });

// // //     // Broadcast updated auction data to all connected clients
// // //     io.emit("auctionData", auctionItems);
// // //   });

// // //   socket.on("disconnect", () => {
// // //     console.log("Client disconnected:", socket.id);
// // //   });
// // // });

// // // // ---------------- Start Server ----------------
// // // server.listen(port, () => {
// // //   console.log(`🚀 Backend API + Socket.io running on PORT: ${port}`);
// // // });


// // // import express from "express";
// // // import cors from "cors";
// // // import "dotenv/config";
// // // import session from "express-session";
// // // import http from "http";
// // // import { Server } from "socket.io";

// // // // ---- External Services ----
// // // import connectDB from "./config/mongodb.js";
// // // import connectCloudinary from "./config/cloudinary.js";
// // // import connectRedis from "./config/redis.js";

// // // // ---- Routers ----
// // // import userRouter from "./routes/userRoute.js";
// // // import productRouter from "./routes/productRoute.js";
// // // import cartRouter from "./routes/cartRoute.js";
// // // import wishlistRouter from "./routes/wishlistRoute.js";
// // // import orderRouter from "./routes/orderRoute.js";
// // // import authRoutes from "./routes/auth.routes.js";
// // // import formsRouter from "./routes/forms.routes.js";
// // // import pricingRouter from "./routes/pricingRoutes.js";
// // // import paymentRouter from "./routes/paymentRoutes.js";
// // // import blogRouter from "./routes/BlogRoute.js";
// // // import auctionRouter from "./routes/auctionRoute.js"; // ✅ new route

// // // const app = express();
// // // const port = process.env.PORT || 4000;

// // // // ---- Connect Services ----
// // // connectDB();
// // // connectCloudinary();
// // // connectRedis();

// // // // ---- Middleware ----
// // // app.use(express.json({ limit: "10mb" }));
// // // app.use(express.urlencoded({ extended: true }));

// // // // ---- Session ----
// // // app.use(
// // //   session({
// // //     secret: process.env.SESSION_SECRET || "devsecret",
// // //     resave: false,
// // //     saveUninitialized: true,
// // //     cookie: {
// // //       maxAge: 30 * 60 * 1000, // 30 mins
// // //       httpOnly: true,
// // //       secure: false,
// // //       sameSite: "lax",
// // //     },
// // //   })
// // // );

// // // app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));


// // // // ---- CORS ----
// // // const allowedOrigins = [
// // //   "http://localhost:5173",
// // //   "http://localhost:5174",
// // //   "https://everglowb2b.onrender.com",
// // // ];
// // // app.use(
// // //   cors({
// // //     origin: (origin, callback) => {
// // //       if (!origin) return callback(null, true);
// // //       if (allowedOrigins.includes(origin)) return callback(null, true);
// // //       console.warn("❌ Blocked by CORS:", origin);
// // //       return callback(new Error("Not allowed by CORS"));
// // //     },
// // //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// // //     credentials: true,
// // //   })
// // // );

// // // // ---- API Routes ----
// // // app.use("/api/user", userRouter);
// // // app.use("/api/product", productRouter);
// // // app.use("/api/cart", cartRouter);
// // // app.use("/api/order", orderRouter);
// // // app.use("/api/auth", authRoutes);
// // // app.use("/api/wishlist", wishlistRouter);
// // // app.use("/api/forms", formsRouter);
// // // app.use("/api/pricing", pricingRouter);
// // // app.use("/api/payment", paymentRouter);
// // // app.use("/api/blog", blogRouter);
// // // app.use("/api/auction", auctionRouter); // ✅ auction routes
// // // app.use("/api/verify", verificationRoutes);

// // // // ---- Error Handler ----
// // // app.use((err, req, res, next) => {
// // //   console.error("❌ Server Error:", err.message || err);
// // //   res.status(err.status || 500).json({ error: err.message || "Server Error" });
// // // });

// // // // ---- Create HTTP Server + Socket.io ----
// // // const server = http.createServer(app);
// // // const io = new Server(server, {
// // //   cors: { origin: allowedOrigins, credentials: true },
// // // });

// // // // ✅ --- Socket.IO: Live Auction Logic ---
// // // import Auction from "./models/auctionModel.js";
// // // import Bid from "./models/bidModel.js";
// // // import path from "path";
// // // import verificationRoutes from "./routes/verificationRoute.js";


// // // io.on("connection", (socket) => {
// // //   console.log("🟢 New client connected:", socket.id);

// // //   // Send all live auctions initially
// // //   const sendLiveAuctions = async () => {
// // //     const liveAuctions = await Auction.find({ status: "live" })
// // //       .populate("highestBidder", "name email")
// // //       .lean();
// // //     socket.emit("auctionData", liveAuctions);
// // //   };
// // //   sendLiveAuctions();

// // //   // Handle new bid
// // //   socket.on("placeBid", async ({ auctionId, bidderId, bidAmount }) => {
// // //     try {
// // //       const auction = await Auction.findById(auctionId);
// // //       if (!auction) return socket.emit("errorMsg", "Auction not found");
// // //       if (auction.status !== "live")
// // //         return socket.emit("errorMsg", "Auction is not active");
// // //       if (bidAmount <= auction.currentPrice)
// // //         return socket.emit("errorMsg", "Bid must be higher than current price");

// // //       // Save new bid
// // //       const newBid = await Bid.create({
// // //         auction: auction._id,
// // //         bidder: bidderId,
// // //         amount: bidAmount,
// // //       });

// // //       // Update auction current bid
// // //       auction.currentPrice = bidAmount;
// // //       auction.highestBidder = bidderId;
// // //       auction.bids.push(newBid._id);
// // //       await auction.save();

// // //       // Broadcast updated auction to all clients
// // //       const updatedAuction = await Auction.findById(auctionId)
// // //         .populate("highestBidder", "name email")
// // //         .lean();
// // //       io.emit("auctionUpdated", updatedAuction);
// // //     } catch (error) {
// // //       console.error("❌ Bid error:", error);
// // //       socket.emit("errorMsg", "Error placing bid");
// // //     }
// // //   });

// // //   socket.on("disconnect", () => {
// // //     console.log("🔴 Client disconnected:", socket.id);
// // //   });
// // // });

// // // // ---- Start Server ----
// // // server.listen(port, () => {
// // //   console.log(`🚀 Backend API + Live Auction running on PORT: ${port}`);
// // // });

// // import express from "express";
// // import cors from "cors";
// // import "dotenv/config";
// // import session from "express-session";
// // import http from "http";
// // import { Server } from "socket.io";
// // import path from "path";

// // // ---- External Services ----
// // import connectDB from "./config/mongodb.js";
// // import connectCloudinary from "./config/cloudinary.js";
// // import connectRedis from "./config/redis.js";

// // // ---- Routers ----
// // import userRouter from "./routes/userRoute.js";
// // import productRouter from "./routes/productRoute.js";
// // import cartRouter from "./routes/cartRoute.js";
// // import wishlistRouter from "./routes/wishlistRoute.js";
// // import orderRouter from "./routes/orderRoute.js";
// // import authRoutes from "./routes/auth.routes.js";
// // import formsRouter from "./routes/forms.routes.js";
// // import pricingRouter from "./routes/pricingRoutes.js";
// // import paymentRouter from "./routes/paymentRoutes.js";
// // import blogRouter from "./routes/BlogRoute.js";
// // import auctionRouter from "./routes/auctionRoute.js";
// // import verificationRoutes from "./routes/verificationRoute.js";

// // // ---- Models ----
// // import Auction from "./models/auctionModel.js";
// // import Bid from "./models/bidModel.js";

// // const app = express();
// // const port = process.env.PORT || 4000;

// // // ---- Connect Services ----
// // connectDB();
// // connectCloudinary();
// // connectRedis();

// // // ---- Middleware ----
// // app.use(express.json({ limit: "10mb" }));
// // app.use(express.urlencoded({ extended: true }));
// // app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// // // ---- Session ----
// // app.use(
// //   session({
// //     secret: process.env.SESSION_SECRET || "devsecret",
// //     resave: false,
// //     saveUninitialized: true,
// //     cookie: {
// //       maxAge: 30 * 60 * 1000,
// //       httpOnly: true,
// //       secure: false,
// //       sameSite: "lax",
// //     },
// //   })
// // );

// // // ---- CORS ----
// // const allowedOrigins = [
// //   "http://localhost:5173",
// //   "http://localhost:5174",
// //   "https://everglowb2b.onrender.com",
// // ];
// // app.use(
// //   cors({
// //     origin: (origin, callback) => {
// //       if (!origin) return callback(null, true);
// //       if (allowedOrigins.includes(origin)) return callback(null, true);
// //       return callback(new Error("Not allowed by CORS"));
// //     },
// //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //     credentials: true,
// //   })
// // );

// // // ---- API Routes ----
// // app.use("/api/user", userRouter);
// // app.use("/api/product", productRouter);
// // app.use("/api/cart", cartRouter);
// // app.use("/api/order", orderRouter);
// // app.use("/api/auth", authRoutes);
// // app.use("/api/wishlist", wishlistRouter);
// // app.use("/api/forms", formsRouter);
// // app.use("/api/pricing", pricingRouter);
// // app.use("/api/payment", paymentRouter);
// // app.use("/api/blog", blogRouter);
// // app.use("/api/auction", auctionRouter);
// // app.use("/api/verify", verificationRoutes);

// // // ---- Error Handler ----
// // app.use((err, req, res, next) => {
// //   console.error("❌ Server Error:", err.message || err);
// //   res.status(err.status || 500).json({ error: err.message || "Server Error" });
// // });

// // // ---- HTTP Server + Socket.io ----
// // const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: { origin: allowedOrigins, credentials: true },
// // });
// // app.set("io", io);

// // // ---- Socket.IO ----
// // io.on("connection", (socket) => {
// //   console.log("🟢 Client connected:", socket.id);

// //   // Send live auctions initially
// //   const sendLiveAuctions = async () => {
// //     const liveAuctions = await Auction.find({ status: "live" })
// //       .populate("highestBidder", "name email")
// //       .lean();
// //     socket.emit("auctionData", liveAuctions);
// //   };
// //   sendLiveAuctions();

// //   // Place bid
// //   socket.on("placeBid", async ({ auctionId, bidderId, bidAmount }) => {
// //     try {
// //       const auction = await Auction.findById(auctionId);
// //       if (!auction) return socket.emit("errorMsg", "Auction not found");
// //       if (auction.status !== "live") return socket.emit("errorMsg", "Auction not active");
// //       if (bidAmount <= auction.currentPrice) return socket.emit("errorMsg", "Bid too low");

// //       const newBid = await Bid.create({ auction: auction._id, bidder: bidderId, amount: bidAmount });

// //       auction.currentPrice = bidAmount;
// //       auction.highestBidder = bidderId;
// //       auction.bids.push(newBid._id);
// //       await auction.save();

// //       const updatedAuction = await Auction.findById(auctionId)
// //         .populate("highestBidder", "name email")
// //         .lean();

// //       io.emit("auctionUpdated", updatedAuction); // global update
// //     } catch (err) {
// //       console.error("❌ Bid error:", err);
// //       socket.emit("errorMsg", "Error placing bid");
// //     }
// //   });

// //   socket.on("disconnect", () => console.log("🔴 Client disconnected:", socket.id));
// // });


// // server.listen(port, () =>
// //   console.log(`🚀 Backend + Live Auction running on PORT: ${port}`)
// // );

// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import session from "express-session";
// import http from "http";
// import { Server } from "socket.io";
// import path from "path";

// // ---- External Services ----
// import connectDB from "./config/mongodb.js";
// import connectCloudinary from "./config/cloudinary.js";
// import connectRedis from "./config/redis.js";

// // ---- Routers ----
// import userRouter from "./routes/userRoute.js";
// import productRouter from "./routes/productRoute.js";
// import cartRouter from "./routes/cartRoute.js";
// import wishlistRouter from "./routes/wishlistRoute.js";
// import orderRouter from "./routes/orderRoute.js";
// import authRoutes from "./routes/auth.routes.js";
// import formsRouter from "./routes/forms.routes.js";
// import pricingRouter from "./routes/pricingRoutes.js";
// import paymentRouter from "./routes/paymentRoutes.js";
// import blogRouter from "./routes/BlogRoute.js";
// import auctionRouter from "./routes/auctionRoute.js";
// import verificationRoutes from "./routes/verificationRoute.js";

// // ---- Models ----
// import Auction from "./models/auctionModel.js";
// import Bid from "./models/bidModel.js";

// const app = express();
// const port = process.env.PORT || 4000;

// // ---- Connect Services ----
// connectDB();
// connectCloudinary();
// connectRedis();

// // ---- Middleware ----
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// // ---- Session ----
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "devsecret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 30 * 60 * 1000,
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     },
//   })
// );

// // ---- CORS ----
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "https://everglowb2b.onrender.com",
// ];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error("Not allowed by CORS"));
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true,
//   })
// );

// // ---- API Routes ----
// app.use("/api/user", userRouter);
// app.use("/api/product", productRouter);
// app.use("/api/cart", cartRouter);
// app.use("/api/order", orderRouter);
// app.use("/api/auth", authRoutes);
// app.use("/api/wishlist", wishlistRouter);
// app.use("/api/forms", formsRouter);
// app.use("/api/pricing", pricingRouter);
// app.use("/api/payment", paymentRouter);
// app.use("/api/blog", blogRouter);
// app.use("/api/auction", auctionRouter);
// app.use("/api/verify", verificationRoutes);

// // ---- Error Handler ----
// app.use((err, req, res, next) => {
//   console.error("❌ Server Error:", err.message || err);
//   res.status(err.status || 500).json({ error: err.message || "Server Error" });
// });

// // ---- HTTP Server + Socket.io ----
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     credentials: true,
//   },
// });
// app.set("io", io);

// // ---- Socket.IO: Live Auction & Verification ----
// io.on("connection", (socket) => {
//   console.log("🟢 Client connected:", socket.id);

//   // Send live auctions
//   const sendLiveAuctions = async () => {
//     const liveAuctions = await Auction.find({ status: "live" })
//       .populate("highestBidder", "name email")
//       .lean();
//     socket.emit("auctionData", liveAuctions);
//   };
//   sendLiveAuctions();

//   // Handle bidding
//   socket.on("placeBid", async ({ auctionId, bidderId, bidAmount }) => {
//     try {
//       const auction = await Auction.findById(auctionId);
//       if (!auction) return socket.emit("errorMsg", "Auction not found");
//       if (auction.status !== "live")
//         return socket.emit("errorMsg", "Auction is not active");
//       if (bidAmount <= auction.currentPrice)
//         return socket.emit("errorMsg", "Bid must be higher than current price");

//       const newBid = await Bid.create({
//         auction: auction._id,
//         bidder: bidderId,
//         amount: bidAmount,
//       });

//       auction.currentPrice = bidAmount;
//       auction.highestBidder = bidderId;
//       auction.bids.push(newBid._id);
//       await auction.save();

//       const updatedAuction = await Auction.findById(auctionId)
//         .populate("highestBidder", "name email")
//         .lean();
//       io.emit("auctionUpdated", updatedAuction);
//     } catch (err) {
//       console.error("❌ Bid error:", err);
//       socket.emit("errorMsg", "Error placing bid");
//     }
//   });

//   // Handle user verification status updates
//   socket.on("joinUserRoom", (userId) => {
//     socket.join(`user_${userId}`);
//     console.log(`User ${userId} joined their room`);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 Client disconnected:", socket.id);
//   });
// });

// // Helper function to emit verification events
// export const emitVerificationEvent = (userId, verified) => {
//   io.to(`user_${userId}`).emit("userVerified", { 
//     userId, 
//     verified,
//     timestamp: new Date().toISOString()
//   });
//   console.log(`📢 Verification event sent for user ${userId}: ${verified}`);
// };

// server.listen(port, () =>
//   console.log(`🚀 Backend + Live Auction running on PORT: ${port}`)
// );

// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import session from "express-session";
// import http from "http";
// import { Server } from "socket.io";
// import path from "path";
// import { fileURLToPath } from "url";

// // ---- External Services ----
// import connectDB from "./config/mongodb.js";
// import connectCloudinary from "./config/cloudinary.js";
// import connectRedis from "./config/redis.js";

// // ---- Routers ----
// import userRouter from "./routes/userRoute.js";
// import productRouter from "./routes/productRoute.js";
// import cartRouter from "./routes/cartRoute.js";
// import wishlistRouter from "./routes/wishlistRoute.js";
// import orderRouter from "./routes/orderRoute.js";
// import authRoutes from "./routes/auth.routes.js";
// import formsRouter from "./routes/forms.routes.js";
// import pricingRouter from "./routes/pricingRoutes.js";
// import paymentRouter from "./routes/paymentRoutes.js";
// import blogRouter from "./routes/BlogRoute.js";
// import auctionRouter from "./routes/auctionRoute.js";
// import verificationRoutes from "./routes/verificationRoute.js";

// // ---- Models ----
// import Auction from "./models/auctionModel.js";
// import Bid from "./models/bidModel.js";

// // ---- Socket Utils ----
// import { setSocketIO } from "./config/socketUtils.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const port = process.env.PORT || 4000;

// // ---- Connect External Services ----
// connectDB();
// connectCloudinary();
// connectRedis();

// // ---- Middleware ----
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ---- Session Configuration ----
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "devsecret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 30 * 60 * 1000, // 30 mins
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     },
//   })
// );

// // ---- CORS Configuration ----
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "https://everglowb2b.onrender.com",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error("Not allowed by CORS"));
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true,
//   })
// );

// // ---- API ROUTES ----
// app.use("/api/user", userRouter);
// app.use("/api/product", productRouter);
// app.use("/api/cart", cartRouter);
// app.use("/api/order", orderRouter);
// app.use("/api/auth", authRoutes);
// app.use("/api/wishlist", wishlistRouter);
// app.use("/api/forms", formsRouter);
// app.use("/api/pricing", pricingRouter);
// app.use("/api/payment", paymentRouter);
// app.use("/api/blog", blogRouter);
// app.use("/api/auction", auctionRouter);
// app.use("/api/verify", verificationRoutes);

// // ---- ERROR HANDLER ----
// app.use((err, req, res, next) => {
//   console.error("❌ Server Error:", err.message || err);
//   res.status(err.status || 500).json({ error: err.message || "Server Error" });
// });

// // ---- HTTP SERVER + SOCKET.IO ----
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     credentials: true,
//   },
// });

// // ---- Make socket globally available ----
// setSocketIO(io);
// app.set("io", io);

// // ---- SOCKET.IO EVENTS ----
// io.on("connection", (socket) => {
//   console.log("🟢 Client connected:", socket.id);

//   // Extract userId (sent from frontend during connection)
//   const { userId } = socket.handshake.auth || {};
//   if (userId) {
//     socket.join(`user_${userId}`);
//     console.log(`👤 User ${userId} joined their private room.`);
//   }

//   // 🔹 LIVE AUCTIONS SYNC ----
//   const sendLiveAuctions = async () => {
//     try {
//       const liveAuctions = await Auction.find({ status: "live" })
//         .populate("highestBidder", "name email")
//         .lean();
//       socket.emit("auctionData", liveAuctions);
//     } catch (error) {
//       console.error("Error fetching live auctions:", error);
//     }
//   };
//   sendLiveAuctions();

//   // 🔹 PLACE BID ----
//   socket.on("placeBid", async ({ auctionId, bidderId, bidAmount }) => {
//     try {
//       const auction = await Auction.findById(auctionId);
//       if (!auction) return socket.emit("errorMsg", "Auction not found");
//       if (auction.status !== "live")
//         return socket.emit("errorMsg", "Auction is not active");
//       if (bidAmount <= auction.currentPrice)
//         return socket.emit("errorMsg", "Bid must be higher than current price");

//       const newBid = await Bid.create({
//         auction: auction._id,
//         bidder: bidderId,
//         amount: bidAmount,
//       });

//       auction.currentPrice = bidAmount;
//       auction.highestBidder = bidderId;
//       auction.bids.push(newBid._id);
//       await auction.save();

//       const updatedAuction = await Auction.findById(auctionId)
//         .populate("highestBidder", "name email")
//         .lean();

//       io.emit("auctionUpdated", updatedAuction);
//     } catch (err) {
//       console.error("❌ Bid error:", err);
//       socket.emit("errorMsg", "Error placing bid");
//     }
//   });

//   // 🔹 JOIN USER ROOM ----
//   socket.on("joinUserRoom", (userId) => {
//     if (userId) {
//       socket.join(`user_${userId}`);
//       console.log(`✅ User joined room: user_${userId}`);
//     }
//   });

//   // 🔹 HANDLE USER VERIFICATION EMIT ----
//   socket.on("userVerified", ({ userId }) => {
//     console.log(`📢 Verification event for user_${userId}`);
//     io.to(`user_${userId}`).emit("userVerified", {
//       userId,
//       verified: true,
//       verifiedAt: new Date(),
//     });
//   });

//   // 🔹 DISCONNECT ----
//   socket.on("disconnect", () => {
//     console.log("🔴 Client disconnected:", socket.id);
//   });
// });

// // ---- START SERVER ----
// server.listen(port, () =>
//   console.log(`🚀 Backend + Live Auction running on PORT: ${port}`)
// );

// server.js
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
  "https://everglowb2b.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

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
