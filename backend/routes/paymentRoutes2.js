// import express from 'express';
// // import { verifyPayment } from '../config/paymentService.js';
// import Auction from '../models/auctionModel.js';
// import Bid from '../models/bidModel.js';
// import { createHmac } from 'crypto';
// import Order from "../models/orderModel.js"
// import mongoose from "mongoose";
// import Payment2 from '../models/Payment2.js';
// import asyncHandler from 'express-async-handler';
// import * as paymentService from '../config/paymentService.js';
// import Deposit from '../models/Deposit.js';
// import PaymentRecord from '../models/PaymentRecord.js';



// const router = express.Router();

// // Payment webhook
// router.post('/webhook', async (req, res) => {
//   try {
//     const { merchantTransactionId, transactionId, amount, code } = req.body;

//     // Verify payment with PhonePe
//     const paymentStatus = await verifyPayment(merchantTransactionId);

//     if (paymentStatus.code === 'PAYMENT_SUCCESS') {
//       // Extract auction ID from merchantTransactionId
//       const auctionId = merchantTransactionId.split('_')[1];
      
//       // Update auction payment status
//       await Auction.findByIdAndUpdate(auctionId, {
//         paymentStatus: 'completed',
//         paymentId: transactionId,
//         paidAt: new Date()
//       });

//       // Update bid payment status
//       await Bid.findOneAndUpdate(
//         { auction: auctionId, isWinningBid: true },
//         { paymentStatus: 'completed' }
//       );

//       console.log(`✅ Payment completed for auction: ${auctionId}`);
//     }

//     res.status(200).json({ success: true });

//   } catch (error) {
//     console.error('Payment webhook error:', error);
//     res.status(500).json({ success: false });
//   }
// });

// // Check payment status
// router.get('/status/:auctionId', async (req, res) => {
//   try {
//     const { auctionId } = req.params;

//     const auction = await Auction.findById(auctionId);
    
//     if (!auction) {
//       return res.status(404).json({ success: false, message: 'Auction not found' });
//     }

//     res.json({
//       success: true,
//       data: {
//         paymentStatus: auction.paymentStatus || 'pending',
//         paymentId: auction.paymentId,
//         paidAt: auction.paidAt
//       }
//     });

//   } catch (error) {
//     console.error('Payment status error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

// // router.post("/verify", async (req, res) => {
// //   try {
// //     const {
// //       razorpay_order_id,
// //       razorpay_payment_id,
// //       razorpay_signature,
// //     } = req.body;

// //     // Missing fields
// //     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Missing Razorpay fields",
// //       });
// //     }

// //     // ✅ Signature verification
// //     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
// //     const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
// //       .update(body)
// //       .digest("hex");

// //     const isValid = expectedSignature === razorpay_signature;

// //     // ✅ Find order
// //     const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     // ❌ Invalid signature
// //     if (!isValid) {
// //       order.payment = false;
// //       order.status = "Canceled";
// //       await order.save();

// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid signature",
// //         order,
// //       });
// //     }

// //     // ✅ Prevent double verify
// //     if (order.payment === true) {
// //       return res.json({
// //         success: true,
// //         message: "Payment already verified",
// //         order,
// //       });
// //     }

// //     // ✅ Generate paymentRef (ESM compatible)
// //     const paymentRefId = new mongoose.Types.ObjectId();

// //     // ✅ Select REAL IMAGE
// //     const realImage =
// //       order.auctionImage ||
// //       order.image ||
// //       order.productImage ||
// //       order.productImg ||
// //       (order.items?.length ? order.items[0].image : null) ||
// //       null;

// //     // ✅ Create payment doc
// //     const paymentDoc = await Payment.create({
// //       _id: paymentRefId,
// //       userId: order.userId,
// //       order_id: order.order_id || order._id.toString(),
// //       amount: order.amount || order.winnerBidAmount,
// //       status: "SUCCESS",
// //       razorpayOrderId: razorpay_order_id,
// //       razorpayPaymentId: razorpay_payment_id,
// //       signature: razorpay_signature,
// //     });

// //     // ✅ Update order completely
// //     order.payment = true;
// //     order.status = "Processing";
// //     order.paymentRef = paymentRefId;
// //     order.paymentId = razorpay_payment_id;
// //     order.razorpayPaymentId = razorpay_payment_id;
// //     order.razorpayOrderId = razorpay_order_id;
// //     order.amount = order.amount || order.winnerBidAmount || 0;

// //     // ✅ Auction fallback items
// //     if (order.isAuctionOrder) {
// //       if (!order.items || order.items.length === 0) {
// //         order.items = [
// //           {
// //             productId: order.auctionId,
// //             name: order.winnerName || "Auction Item",
// //             quantity: 1,
// //             price: order.winnerBidAmount || order.amount,
// //             image: realImage,
// //           },
// //         ];
// //       } else {
// //         // Fill image if missing
// //         order.items = order.items.map((item) => ({
// //           ...item,
// //           image: item.image || realImage,
// //         }));
// //       }
// //     }

// //     await order.save();

// //     return res.json({
// //       success: true,
// //       message: "Payment verified successfully",
// //       order,
// //       payment: paymentDoc,
// //     });
// //   } catch (err) {
// //     console.error("Verify error:", err);
// //     return res.status(500).json({
// //       success: false,
// //       message: err.message,
// //     });
// //   }
// // });

// // router.post("/verify", async (req, res) => {
// //   try {
// //     const {
// //       razorpay_order_id,
// //       razorpay_payment_id,
// //       razorpay_signature,
// //     } = req.body;

// //     // ✅ Validate fields
// //     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Missing Razorpay verification fields",
// //       });
// //     }

// //     // ✅ Signature Verification
// //     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
// //     const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
// //       .update(body)
// //       .digest("hex");

// //     const isValid = expectedSignature === razorpay_signature;

// //     // ✅ Get Order
// //     const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found",
// //       });
// //     }

// //     // ❌ Wrong signature
// //     if (!isValid) {
// //       order.payment = false;
// //       order.status = "Canceled";
// //       await order.save();
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid signature",
// //         order,
// //       });
// //     }

// //     // ✅ Prevent double verification
// //     if (order.payment === true) {
// //       return res.json({
// //         success: true,
// //         message: "Payment already verified",
// //         order,
// //       });
// //     }

// //     // ✅ Auto select proper image
// //     const realImage =
// //       order.auctionImage ||
// //       order.productImage ||
// //       order.image ||
// //       (order.items?.length ? order.items[0].image : null) ||
// //       null;

// //     // ✅ Create a new paymentRef ObjectId
// //     const paymentRefId = new mongoose.Types.ObjectId();

// //     // ✅ Create payment document (NOW WITH ALL REQUIRED FIELDS)
// //     const paymentDoc = await Payment.create({
// //       _id: paymentRefId,
// //       userId: order.userId,
// //       order_id: order._id.toString(),
// //       amount: order.amount || order.winnerBidAmount,
// //       status: "SUCCESS",
// //       razorpayOrderId: razorpay_order_id,
// //       razorpayPaymentId: razorpay_payment_id,
// //       signature: razorpay_signature,

// //       // ✅ FIXED REQUIRED FIELDS
// //       // deliveryType: order.deliveryType || "Standard Delivery",
// //       // mobileNumber: order.mobileNumber,
// //       email: order.email,
// //     });

// //     // ✅ Update order info
// //     order.payment = true;
// //     order.status = "Processing";
// //     order.paymentRef = paymentRefId;
// //     order.paymentId = razorpay_payment_id;
// //     order.razorpayPaymentId = razorpay_payment_id;
// //     order.razorpayOrderId = razorpay_order_id;
// //     order.amount = order.amount || order.winnerBidAmount || 0;

// //     // ✅ Fix auction items & images
// //     if (!order.items || order.items.length === 0) {
// //       order.items = [
// //         {
// //           productId: order.auctionId,
// //           name: order.winnerName || "Auction Item",
// //           price: order.winnerBidAmount || order.amount,
// //           quantity: 1,
// //           image: realImage,
// //         },
// //       ];
// //     } else {
// //       order.items = order.items.map((i) => ({
// //         ...i,
// //         image: i.image || realImage,
// //       }));
// //     }

// //     await order.save();

// //     return res.json({
// //       success: true,
// //       message: "Payment verified successfully",
// //       order,
// //       payment: paymentDoc,
// //     });
// //   } catch (err) {
// //     console.error("Verify error:", err);
// //     return res.status(500).json({
// //       success: false,
// //       message: err.message,
// //     });
// //   }
// // });



// // router.post("/verify", async (req, res) => {
// //   try {
// //     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

// //     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Missing Razorpay fields",
// //       });
// //     }

// //     const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

// //     if (!order) {
// //       return res.status(404).json({ success: false, message: "Order not found" });
// //     }

// //     // Validate signature
// //     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
// //     const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
// //       .update(body)
// //       .digest("hex");

// //     const isValid = expectedSignature === razorpay_signature;

// //     if (!isValid) {
// //       order.payment = false;
// //       order.paymentStatus = "FAILED";
// //       order.deliveryStatus = "Canceled";
// //       await order.save();
// //       return res.status(400).json({ success: false, message: "Invalid signature" });
// //     }

// //     // ✅ Real image choose
// //     const realImage =
// //       order.auctionImage ||
// //       order.productImage ||
// //       order.image ||
// //       (order.items?.length ? order.items[0].image : null) ||
// //       null;

// //     // ✅ Create your paymentRef
// //     const paymentRefId = new mongoose.Types.ObjectId();

// //     // ✅ Create Payment2 document
// //     const paymentDoc = await Payment2.create({
// //       _id: paymentRefId,
// //       userId: order.userId,
// //       orderId: order._id.toString(),
// //       razorpayOrderId: razorpay_order_id,
// //       razorpayPaymentId: razorpay_payment_id,
// //       razorpaySignature: razorpay_signature,
// //       amount: order.amount,
// //       status: "SUCCESS",
// //       image: realImage,
// //       items: order.items,
// //       providerResponse: req.body,
// //     });

// //     // ✅ Update order details
// //     order.payment = true;
// //     order.paymentStatus = "SUCCESS";
// //     order.deliveryStatus = "Processing";
// //     order.paymentRef = paymentRefId;
// //     order.razorpayPaymentId = razorpay_payment_id;
// //     order.razorpayOrderId = razorpay_order_id;

// //     // ✅ Fix items image
// //     order.items = order.items.map((i) => ({
// //       ...i,
// //       image: i.image || realImage,
// //     }));

// //     await order.save();

// //     return res.json({
// //       success: true,
// //       message: "Payment verified successfully",
// //       order,
// //       payment: paymentDoc,
// //     });
// //   } catch (err) {
// //     console.error("Verify error:", err);
// //     return res.status(500).json({ success: false, message: err.message });
// //   }
// // });

// // router.post("/verify", async (req, res) => {
// //   try {
// //     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

// //     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Missing Razorpay fields",
// //       });
// //     }

// //     // ✅ Find the order
// //     const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

// //     if (!order) {
// //       return res.status(404).json({ success: false, message: "Order not found" });
// //     }

// //     // ✅ Validate Razorpay signature
// //     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
// //     const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
// //       .update(body)
// //       .digest("hex");

// //     if (expectedSignature !== razorpay_signature) {
// //       order.paymentStatus = "FAILED";
// //       order.deliveryStatus = "Canceled";
// //       await order.save();
// //       return res.status(400).json({ success: false, message: "Invalid signature" });
// //     }

// //     // ✅ Always choose the right image (Auction > Product > Item)
// //     const realImage =
// //       order.auctionImage ||
// //       order.productImage ||
// //       order.image ||
// //       (order.items?.length ? order.items[0].image : null) ||
// //       "https://placehold.co/600x600?text=No+Image";

// //     // ✅ Save selected image in Order too
// //     order.image = realImage;

// //     // ✅ paymentRef ID
// //     const paymentRefId = new mongoose.Types.ObjectId();

// //     // ✅ Create Payment2
// //     const paymentDoc = await Payment2.create({
// //       _id: paymentRefId,
// //       userId: order.userId,
// //       order_id: order.order_id,

// //       razorpayOrderId: razorpay_order_id,
// //       razorpayPaymentId: razorpay_payment_id,
// //       razorpaySignature: razorpay_signature,

// //       amount: order.amount,
// //       status: "SUCCESS",

// //       // ✅ Save image for frontend
// //       image: realImage,
// //       productImage: order.productImage || null,
// //       auctionImage: order.auctionImage || null,

// //       items: order.items,
// //       providerResponse: req.body,
// //     });

// //     // ✅ Update Order
// //     order.paymentStatus = "SUCCESS";
// //     order.deliveryStatus = "Processing";
// //     order.paymentRef = paymentRefId;
// //     order.razorpayPaymentId = razorpay_payment_id;

// //     // ✅ Fix item images
// //     order.items = order.items.map((it) => ({
// //       ...it,
// //       image: it.image || realImage,
// //     }));

// //     await order.save();

// //     return res.json({
// //       success: true,
// //       message: "Payment verified successfully",
// //       order,
// //       payment: paymentDoc,
// //       paymentRef: paymentDoc._id, // ✅ now included
// //     });
// //   } catch (err) {
// //     console.error("Verify error:", err);
// //     return res.status(500).json({ success: false, message: err.message });
// //   }
// // });


// // router.post("/verify", async (req, res) => {
// //   try {
// //     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

// //     // 🔹 Step 1: Validate fields
// //     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Missing Razorpay fields (order_id, payment_id, signature).",
// //       });
// //     }

// //     // 🔹 Step 2: Find order by razorpayOrderId
// //     const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
// //     if (!order) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Order not found.",
// //       });
// //     }

// //     // 🔹 Step 3: Verify signature using Razorpay key secret
// //     const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;
// //     const expectedSignature = 
// //       createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
// //       .update(signBody)
// //       .digest("hex");

// //     if (expectedSignature !== razorpay_signature) {
// //       // ❌ Signature mismatch — mark as failed
// //       order.paymentStatus = "FAILED";
// //       order.deliveryStatus = "Canceled";
// //       await order.save();

// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid signature — payment verification failed.",
// //       });
// //     }

// //     // 🔹 Step 4: Get image safely
// //     const realImage =
// //       order.auctionImage ||
// //       order.productImage ||
// //       (order.items?.[0]?.image ?? "https://placehold.co/600x600?text=No+Image");

// //     // 🔹 Step 5: Create payment document
// //     const paymentRefId = new mongoose.Types.ObjectId();
// //     const paymentDoc = await Payment2.create({
// //       _id: paymentRefId,
// //       userId: order.userId,
// //       order_id: order.order_id,
// //       razorpayOrderId: razorpay_order_id,
// //       razorpayPaymentId: razorpay_payment_id,
// //       razorpaySignature: razorpay_signature,
// //       amount: order.amount,
// //       currency: "INR",
// //       status: "SUCCESS",
// //       image: realImage,
// //       productImage: order.productImage || null,
// //       auctionImage: order.auctionImage || null,
// //       items: order.items || [],
// //       providerResponse: req.body,
// //       createdAt: new Date(),
// //     });

// //     // 🔹 Step 6: Update main Order
// //     const updatedOrder = await Order.findOneAndUpdate(
// //       { razorpayOrderId: razorpay_order_id },
// //       {
// //         $set: {
// //           paymentStatus: "SUCCESS",
// //           deliveryStatus: "Processing",
// //           payment: true,
// //           razorpayPaymentId: razorpay_payment_id,
// //           paymentRef: paymentRefId,
// //           image: realImage,
// //           items: (order.items || []).map((item) => ({
// //             ...item,
// //             image: item.image || realImage,
// //           })),
// //           updatedAt: new Date(),
// //         },
// //       },
// //       { new: true }
// //     );

// //     // 🔹 Step 7: Respond with success
// //     return res.status(200).json({
// //       success: true,
// //       message: "✅ Payment verified successfully!",
// //       paymentRef: paymentRefId,
// //       razorpayPaymentId: razorpay_payment_id,
// //       order: updatedOrder,
// //       payment: paymentDoc,
// //     });
// //   } catch (err) {
// //     console.error("❌ Verify error:", err);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Server error during payment verification.",
// //       error: err.message,
// //     });
// //   }
// // });

// // router.post("/verify", async (req, res) => {
// //   try {
// //     const {
// //       razorpay_order_id,
// //       razorpay_payment_id,
// //       razorpay_signature,
// //       address,
// //       auctionId,
// //     } = req.body;

// //     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Missing Razorpay fields (order_id, payment_id, signature).",
// //       });
// //     }

// //     // 🔹 Find payment document
// //     const paymentDoc = await Payment2.findOne({
// //       razorpayOrderId: razorpay_order_id,
// //     });

// //     if (!paymentDoc) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Payment record not found.",
// //       });
// //     }

// //     // 🔹 Verify signature
// //     const body = razorpay_order_id + "|" + razorpay_payment_id;
// //     const expectedSignature = createHmac(
// //       "sha256",
// //       process.env.RAZORPAY_KEY_SECRET
// //     )
// //       .update(body.toString())
// //       .digest("hex");

// //     if (expectedSignature !== razorpay_signature) {
// //       paymentDoc.status = "FAILED";
// //       await paymentDoc.save();
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid signature — payment verification failed.",
// //       });
// //     }

// //     // ✅ Update payment success
// //     paymentDoc.status = "SUCCESS";
// //     paymentDoc.razorpayPaymentId = razorpay_payment_id;
// //     paymentDoc.razorpaySignature = razorpay_signature;
// //     paymentDoc.paymentVerifiedAt = new Date();

// //     if (address) {
// //       paymentDoc.address = {
// //         fullName: address.fullName || paymentDoc.address?.fullName,
// //         line1: address.line1 || paymentDoc.address?.line1,
// //         city: address.city || paymentDoc.address?.city,
// //         state: address.state || paymentDoc.address?.state,
// //         pincode: address.pincode || paymentDoc.address?.pincode,
// //       };
// //       paymentDoc.mobile = address.mobile || paymentDoc.mobile;
// //     }

// //     await paymentDoc.save();

// //     // 🔹 Create Order record after payment success
// //     const order = await Order.create({
// //       userId: paymentDoc.userId,
// //       order_id: paymentDoc.order_id,
// //       auctionId: auctionId || paymentDoc.items?.[0]?.productId,
// //       isAuctionOrder: true,
// //       items: paymentDoc.items,
// //       amount: paymentDoc.amount,
// //       paymentMethod: "Razorpay",
// //       payment: true,
// //       razorpayPaymentId: paymentDoc.razorpayPaymentId,
// //       razorpayOrderId: paymentDoc.razorpayOrderId,
// //       razorpaySignature: paymentDoc.razorpaySignature,
// //       paymentStatus: "SUCCESS",
// //       address: {
// //         recipientName: paymentDoc.address?.fullName,
// //         recipientMobile: paymentDoc.mobile,
// //         houseNo: paymentDoc.address?.line1,
// //         locality: paymentDoc.address?.city,
// //         landmark: paymentDoc.address?.state,
// //         pincode: paymentDoc.address?.pincode,
// //       },
// //       auctionImage: paymentDoc.productImage,
// //       status: "Order Placed",
// //       paymentRef: paymentDoc._id,
// //     });

// //     // 🔹 Mark auction as paid
// //     if (auctionId && mongoose.Types.ObjectId.isValid(auctionId)) {
// //       await Auction.findByIdAndUpdate(auctionId, {
// //         paymentStatus: "PAID",
// //         winnerPaid: true,
// //       });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       message: "✅ Payment verified & order created successfully!",
// //       payment: paymentDoc,
// //       order,
// //     });
// //   } catch (err) {
// //     console.error("❌ Verify payment error:", err);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Server error during payment verification.",
// //       error: err.message,
// //     });
// //   }
// // });


// router.post("/verify", async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       address,
//       auctionId,
//     } = req.body;

//     // 🧩 Step 1: Basic validation
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required Razorpay fields (order_id, payment_id, signature).",
//       });
//     }

//     // 🧾 Step 2: Fetch Payment2 document
//     const paymentDoc = await Payment2.findOne({ razorpayOrderId: razorpay_order_id });
//     if (!paymentDoc) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment record not found for this Razorpay order.",
//       });
//     }

//     // 🔍 Step 3: Verify Razorpay Signature
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature =createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       paymentDoc.status = "FAILED";
//       paymentDoc.razorpayPaymentId = razorpay_payment_id;
//       paymentDoc.razorpaySignature = razorpay_signature;
//       await paymentDoc.save();

//       return res.status(400).json({
//         success: false,
//         message: "Invalid signature — payment verification failed.",
//       });
//     }

//     // 💰 Step 4: Mark payment as successful
//     paymentDoc.status = "SUCCESS";
//     paymentDoc.razorpayPaymentId = razorpay_payment_id;
//     paymentDoc.razorpaySignature = razorpay_signature;
//     paymentDoc.paymentVerifiedAt = new Date();

//     // 🏠 Update address (if provided)
//     if (address) {
//       paymentDoc.address = {
//         fullName: address.fullName || paymentDoc.address?.fullName,
//         line1: address.line1 || paymentDoc.address?.line1,
//         city: address.city || paymentDoc.address?.city,
//         state: address.state || paymentDoc.address?.state,
//         pincode: address.pincode || paymentDoc.address?.pincode,
//       };
//       paymentDoc.mobile = address.mobile || paymentDoc.mobile;
//     }

//     await paymentDoc.save();

//     // 🧠 Step 5: Create Order after verified payment
//     const order = await Order.create({
//       userId: paymentDoc.userId,
//       order_id: paymentDoc.order_id,
//       auctionId: auctionId || paymentDoc.items?.[0]?.productId,
//       isAuctionOrder: true,
//       items: paymentDoc.items,
//       amount: paymentDoc.amount,
//       paymentMethod: "Razorpay",
//       payment: true,
//       paymentStatus: "SUCCESS",
//       razorpayPaymentId: paymentDoc.razorpayPaymentId,
//       razorpayOrderId: paymentDoc.razorpayOrderId,
//       razorpaySignature: paymentDoc.razorpaySignature,
//       address: {
//         recipientName: paymentDoc.address?.fullName,
//         recipientMobile: paymentDoc.mobile,
//         houseNo: paymentDoc.address?.line1,
//         locality: paymentDoc.address?.city,
//         landmark: paymentDoc.address?.state,
//         pincode: paymentDoc.address?.pincode,
//       },
//       auctionImage:
//         paymentDoc.productImage ||
//         paymentDoc.auctionImage ||
//         "https://placehold.co/600x600?text=No+Image",
//       finalPrice: paymentDoc.amount,
//       status: "Order Placed",
//       paymentRef: paymentDoc._id,
//       paymentRefModel: "Payment2",
//     });

//     // 🏆 Step 6: Mark auction as paid (if valid)
//     if (auctionId && mongoose.Types.ObjectId.isValid(auctionId)) {
//       await Auction.findByIdAndUpdate(auctionId, {
//         paymentStatus: "PAID",
//         winnerPaid: true,
//         winnerPaymentId: paymentDoc._id,
//       });
//     }

//     // ✅ Step 7: Respond success
//     return res.status(200).json({
//       success: true,
//       message: "✅ Payment verified & order created successfully!",
//       payment: paymentDoc,
//       order,
//     });
//   } catch (err) {
//     console.error("❌ [Verify Payment Error]:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error during payment verification.",
//       error: err.message,
//     });
//   }
// });



// router.get("/details/:paymentRef", async (req, res) => {
//   try {
//     const { paymentRef } = req.params;

//     // ✅ Step 1: Determine if it's a valid MongoDB ObjectId
//     const isObjectId = mongoose.Types.ObjectId.isValid(paymentRef);
//     let payment = null;

//     // ✅ Step 2: Try to find by _id (only if valid ObjectId)
//     if (isObjectId) {
//       payment = await Payment2.findById(paymentRef).populate("userId", "name email");
//     }

//     // ✅ Step 3: If not found, try other identifiers
//     if (!payment) {
//       payment = await Payment2.findOne({
//         $or: [
//           { razorpayPaymentId: paymentRef },
//           { razorpayOrderId: paymentRef },
//           { order_id: paymentRef },
//         ],
//       }).populate("userId", "name email");
//     }

//     // ✅ Step 4: Handle not found case
//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: `No payment found for reference: ${paymentRef}`,
//       });
//     }

//     // ✅ Step 5: Return clean structured response
//     return res.status(200).json({
//       success: true,
//       payment: {
//         _id: payment._id,
//         user: payment.userId
//           ? {
//               id: payment.userId._id,
//               name: payment.userId.name,
//               email: payment.userId.email,
//             }
//           : null,
//         order_id: payment.order_id,
//         razorpayOrderId: payment.razorpayOrderId,
//         razorpayPaymentId: payment.razorpayPaymentId,
//         razorpaySignature: payment.razorpaySignature,
//         paymentRef: payment.paymentRef,
//         amount: payment.amount,
//         currency: payment.currency,
//         status: payment.status,
//         providerResponse: payment.providerResponse,
//         items: payment.items || [],
//         address: {
//           fullName: payment.address?.fullName,
//           line1: payment.address?.line1,
//           city: payment.address?.city,
//           state: payment.address?.state,
//           pincode: payment.address?.pincode,
//         },
//         mobile: payment.mobile,
//         images: {
//           main: payment.image,
//           productImage: payment.productImage,
//           auctionImage: payment.auctionImage,
//         },
//         createdAt: payment.createdAt,
//         updatedAt: payment.updatedAt,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Error fetching payment details:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while fetching payment details",
//       error: err.message,
//     });
//   }
// });

// router.post('/create-deposit-order', asyncHandler(async (req, res) => {
//   try {
//     const { userId, auctionId } = req.body;
//     if (!userId || !auctionId) return res.status(400).json({ error: 'Missing userId or auctionId' });
//     const result = await paymentService.createDepositOrderForAuction({ auctionId, userId });
//     return res.json(result); // { order, depositId, key }
//   } catch (err) {
//     console.error('create-deposit-order error:', err);
//     return res.status(500).json({ error: err.message });
//   }
// }));

// router.post('/verify-deposit', asyncHandler(async (req, res) => {
//   try {
//     const { depositId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
//     const deposit = await paymentService.verifyAndFinalizeDeposit({ depositId, razorpay_payment_id, razorpay_order_id, razorpay_signature });
//     return res.json({ success: true, deposit });
//   } catch (err) {
//     console.error('verify-deposit err:', err);
//     return res.status(400).json({ error: err.message });
//   }
// }));

// router.post('/create-final-order', asyncHandler(async (req, res) => {
//   try {
//     const { auctionId, userId } = req.body;
//     if (!auctionId || !userId) return res.status(400).json({ error: 'Missing auctionId or userId' });

//     const result = await paymentService.generatePaymentLinkForAuction({ auctionId, userId });
//     if (!result.success) return res.status(400).json({ error: result.error || 'Failed to generate payment link' });

//     return res.json({ success: true, checkoutUrl: result.checkoutUrl, orderDb: result.orderDb, amountPaise: result.amountPaise, key: process.env.RAZORPAY_KEY_ID });
//   } catch (err) {
//     console.error('create-final-order err:', err);
//     return res.status(500).json({ error: err.message });
//   }
// }));

// router.post('/verify-final-payment', asyncHandler(async (req, res) => {
//   try {
//     const { paymentRecordId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
//     const result = await paymentService.verifyFinalPaymentAndFinalize({ paymentRecordId, razorpay_payment_id, razorpay_order_id, razorpay_signature });
//     return res.json({ success: true, payment: result.rec, auction: result.auction });
//   } catch (err) {
//     console.error('verify-final-payment err:', err);
//     return res.status(400).json({ error: err.message });
//   }
// }));

// router.get('/name', asyncHandler(async (req, res) => {
//   try {
//     const userId = req.query.userId;
//     if (userId) {
//       const deps = await Deposit.find({ user: userId }).populate('auction').populate('user', 'name email');
//       return res.json({ success: true, deposits: deps });
//     } else {
//       // return aggregated summary
//       const total = await Deposit.countDocuments();
//       const paid = await Deposit.countDocuments({ status: 'paid' });
//       const pending = await Deposit.countDocuments({ status: 'pending' });
//       const forfeited = await Deposit.countDocuments({ status: 'forfeited' });
//       return res.json({ success: true, summary: { total, paid, pending, forfeited } });
//     }
//   } catch (err) {
//     console.error('GET /name err', err);
//     return res.status(500).json({ error: err.message });
//   }
// }));












// router.get("/user/:userId", async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
//     res.json({ success: true, orders });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });



// export default router;

// routes/paymentRoutes2.js
import express from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { createHmac } from 'crypto';
import Razorpay from 'razorpay';
import crypto from "crypto";
import * as paymentService from '../config/paymentService.js';
import { authUser, protect } from '../middleware/auth.js';

import Deposit from '../models/Deposit.js';
import Payment2 from '../models/Payment2.js';
import PaymentRecord from '../models/PaymentRecord.js';
import Auction from '../models/auctionModel.js';
import Order from '../models/orderModel.js';



const router = express.Router();

const {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  FRONTEND_BASE_URL = "http://localhost:5173",
} = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.warn("⚠️ Razorpay keys missing in env: set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET");
}

// Razorpay SDK instance (used for Orders)
const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID || "rzp_test_z8VHG8l7lxwyLF",
  key_secret: RAZORPAY_KEY_SECRET || "MJGRuvCiarfUxZyQzkhbt8DZ",
});


function safeReceipt({ prefix = "rcpt", auctionId = "", userId = "" } = {}) {
  const a = String(auctionId || "").replace(/[^a-zA-Z0-9]/g, "");
  const u = String(userId || "").replace(/[^a-zA-Z0-9]/g, "");
  const ts = String(Date.now()).slice(-6);
  return `${prefix}_${a.slice(-8) || "A"}_${u.slice(-6) || "U"}_${ts}`.slice(0, 40);
}

async function createRazorpayOrder(amountPaise, { receipt = null, notes = {} } = {}) {
  const payload = {
    amount: Math.round(Number(amountPaise)),
    currency: "INR",
    receipt: receipt ? String(receipt).slice(0, 40) : safeReceipt({ prefix: "rcpt" }),
    payment_capture: 1,
    notes: notes || {},
  };
  return Razorpay.Order.create(payload);
}

// function verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
//   if (!RAZORPAY_KEY_SECRET) throw new Error("Missing RAZORPAY_KEY_SECRET env var");
//   const generated = crypto
//     .createHmac("sha256", RAZORPAY_KEY_SECRET)
//     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//     .digest("hex");
//   return generated === razorpay_signature;
// }

export function verifyRazorpaySignature({ order_id, payment_id, signature }) {
  const secret = process.env.RAZORPAY_KEY_SECRET || process.env.RZP_KEY_SECRET;
  if (!secret) {
    console.warn("Razorpay secret missing for signature verification");
    return false;
  }
  const generated = crypto
    .createHmac("sha256", secret)
    .update(`${order_id}|${payment_id}`)
    .digest("hex");

  return generated === signature;
}


/**
 * Create deposit order
 * Protected route: uses req.user (preferred)
 * body: { auctionId, amountPaise? }
 * Response: { order, depositId, key }
 */
router.post('/create-deposit-order', protect, asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { auctionId, amountPaise } = req.body;
    if (!auctionId) return res.status(400).json({ error: 'Missing auctionId' });

    // pass requested amountPaise (frontend computed) — server will validate and prefer server computation if mismatch
    const result = await paymentService.createDepositOrderForAuction({ auctionId, userId, amountPaise: amountPaise ? Number(amountPaise) : null });
    return res.json(result); // { order, depositId, key }
  } catch (err) {
    console.error('create-deposit-order error:', err);
    return res.status(500).json({ error: err.message });
  }
}));

/**
 * Verify deposit after checkout
 * Protected route (recommended)
 * body: { depositId, razorpay_payment_id, razorpay_order_id, razorpay_signature }
 */
router.post('/verify-deposit', protect, asyncHandler(async (req, res) => {
  try {
    const { depositId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    if (!depositId) return res.status(400).json({ error: 'Missing depositId' });

    // verify and finalize
    const deposit = await paymentService.verifyAndFinalizeDeposit({ depositId, razorpay_payment_id, razorpay_order_id, razorpay_signature });

    return res.json({ success: true, deposit });
  } catch (err) {
    console.error('verify-deposit err:', err);
    return res.status(400).json({ error: err.message });
  }
}));

/**
 * Create final order (winner pays remaining)
 * Protected route
 * body: { auctionId }
 */
router.post('/create-final-order', protect, asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { auctionId } = req.body;
    if (!auctionId) return res.status(400).json({ error: 'Missing auctionId' });

    const result = await paymentService.generatePaymentLink({ auctionId, userId });
    if (!result.success) return res.status(400).json({ error: result.error || 'Failed to generate payment link' });
    return res.json({ success: true, checkoutUrl: result.checkoutUrl, orderDb: result.orderDb, amountPaise: result.amountPaise, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('create-final-order err:', err);
    return res.status(500).json({ error: err.message });
  }
}));

/**
 * Verify final payment (winner pays remaining)
 * Protected route
 * body: { paymentRecordId, razorpay_payment_id, razorpay_order_id, razorpay_signature }
 */
router.post('/verify-final-payment', protect, asyncHandler(async (req, res) => {
  try {
    const { paymentRecordId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const result = await paymentService.verifyFinalPaymentAndFinalize({ paymentRecordId, razorpay_payment_id, razorpay_order_id, razorpay_signature });
    return res.json({ success: true, payment: result.rec, auction: result.auction });
  } catch (err) {
    console.error('verify-final-payment err:', err);
    return res.status(400).json({ error: err.message });
  }
}));

/**
 * GET deposits by user (or summary)
 * GET /api/payment2/name?userId=<optional>  -- but we prefer calling this with the logged in user.
 */
router.get('/name', asyncHandler(async (req, res) => {
  try {
    const userIdQuery = req.query.userId;
    if (userIdQuery) {
      const deps = await Deposit.find({ user: userIdQuery }).populate('auction').populate('user', 'name email');
      return res.json({ success: true, deposits: deps });
    } else {
      const total = await Deposit.countDocuments();
      const paid = await Deposit.countDocuments({ status: 'paid' });
      const pending = await Deposit.countDocuments({ status: 'pending' });
      const forfeited = await Deposit.countDocuments({ status: 'forfeited' });
      return res.json({ success: true, summary: { total, paid, pending, forfeited } });
    }
  } catch (err) {
    console.error('GET /name err', err);
    return res.status(500).json({ error: err.message });
  }
}));

/**
 * Get payment details by reference
 */
router.get(
  "/details/:paymentRef",
  asyncHandler(async (req, res) => {
    try {
      const { paymentRef } = req.params;
      if (!paymentRef) return res.status(400).json({ success: false, message: "Missing payment reference" });

      const isObjectId = mongoose.Types.ObjectId.isValid(paymentRef);
      let result = null;
      let foundIn = null;

      // 1) If looks like ObjectId, try PaymentRecord first (preferred), then Payment2, Payment
      if (isObjectId) {
        result = await PaymentRecord.findById(paymentRef).lean().exec();
        if (result) foundIn = "PaymentRecord";
        if (!result) {
          result = await Payment2.findById(paymentRef).lean().exec();
          if (result) foundIn = "Payment2";
        }
        if (!result) {
          result = await Payment.findById(paymentRef).lean().exec();
          if (result) foundIn = "Payment";
        }
      }

      // 2) If not found yet, search by razorpay ids or order_id
      if (!result) {
        // Try PaymentRecord by common fields (adjust keys if you store them differently)
        result = await PaymentRecord.findOne({
          $or: [
            { razorpayPaymentId: paymentRef },
            { razorpayOrderId: paymentRef },
            { paymentRef: paymentRef },
            { order_id: paymentRef }, // if you store original order_id
            { "providerResponse.id": paymentRef },
            { "providerResponse.order_id": paymentRef },
            { "providerResponse.payment_id": paymentRef },
            { "providerResponse.short_url": paymentRef }, // unlikely
          ],
        }).lean().exec();
        if (result) foundIn = "PaymentRecord";
      }

      if (!result) {
        // Payment2 next
        result = await Payment2.findOne({
          $or: [{ razorpayPaymentId: paymentRef }, { razorpayOrderId: paymentRef }, { order_id: paymentRef }],
        })
          .lean()
          .exec();
        if (result) foundIn = "Payment2";
      }

      if (!result) {
        // Payment fallback
        result = await Payment.findOne({
          $or: [{ razorpayPaymentId: paymentRef }, { razorpayOrderId: paymentRef }, { order_id: paymentRef }],
        })
          .lean()
          .exec();
        if (result) foundIn = "Payment";
      }

      if (!result) {
        return res.status(404).json({ success: false, message: `No payment found for reference: ${paymentRef}` });
      }

      // Normalize output fields (common shape)
      // PaymentRecord uses amountPaise; Payment/Payment2 may use amount in rupees or paise — detect
      const amountPaise =
        typeof result.amountPaise !== "undefined"
          ? Number(result.amountPaise)
          : typeof result.amount === "number" && Number(result.amount) > 1000
          ? Number(result.amount) // already in paise? can't be sure — we try safe fallbacks
          : Math.round(Number(result.amount || 0) * 100); // assume rupees -> paise if needed

      const amountRupees = (amountPaise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      // Prepare items, address, mobile, providerResponse safely
      const items = result.items || result.itemsSold || [];
      const address = result.address || {};
      const mobile = result.mobile || result.contact || (result.customer && result.customer.contact) || "";
      const providerResponse = result.providerResponse || result.provider || null;
      const paymentLinkUrl = result.paymentLinkUrl || (providerResponse && (providerResponse.short_url || providerResponse.data?.short_url)) || null;

      // Build normalized response object
      const out = {
        _id: result._id,
        source: foundIn || null,
        order_id: result.order_id || result.paymentRef || (providerResponse && (providerResponse.order_id || providerResponse.id)) || null,
        razorpayOrderId: result.razorpayOrderId || (providerResponse && (providerResponse.order_id || providerResponse.id)) || null,
        razorpayPaymentId: result.razorpayPaymentId || (providerResponse && providerResponse.payment_id) || null,
        amountPaise: Number(amountPaise || 0),
        amount: amountRupees,
        currency: result.currency || "INR",
        status: result.status || result.paymentStatus || "PENDING",
        items,
        address,
        mobile,
        createdAt: result.createdAt || result.created_at || null,
        updatedAt: result.updatedAt || result.updated_at || null,
        providerResponse,
        paymentLinkUrl,
        raw: result, // full record for debugging (optional — remove if too heavy)
      };

      // If this record has a userId as ObjectId, attempt to populate name/email for response
      if (result.userId && mongoose.Types.ObjectId.isValid(String(result.userId))) {
        try {
          const u = await User.findById(result.userId).select("name email").lean().exec();
          if (u) out.user = { id: u._id, name: u.name, email: u.email };
        } catch (e) {
          // ignore populate errors
          out.user = null;
        }
      } else {
        out.user = null;
      }

      return res.json({ success: true, payment: out });
    } catch (err) {
      console.error("GET /payment2/details error:", err);
      return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  })
);


/**
 * Optional: webhook endpoint (stub)
 */
router.post('/webhook', asyncHandler(async (req, res) => {
  // implement if you register Razorpay webhook
  res.json({ success: true });
}));

// router.post(
//   "/create-order",
//   asyncHandler(async (req, res) => {
//     const { auctionId, amountPaise } = req.body;
//     const userId = req.user?._id || req.body.userId || null; // use auth or passed user
//     if (!auctionId) return res.status(400).json({ success: false, message: "auctionId required" });

//     // compute final price (example fallback)
//     const auction = await Auction.findById(auctionId).lean();
//     if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });

//     const finalPaise = amountPaise != null ? Number(amountPaise) : (auction.finalPricePaise ?? auction.currentPricePaise ?? Math.round(Number(auction.startingPrice || 0) * 100));
//     if (!finalPaise || finalPaise <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });

//     // optionally apply deposit logic here (omitted for brevity — use generatePaymentLink service)
//     const receipt = `pay_${String(auctionId).slice(-6)}_${Date.now().toString().slice(-6)}`;

//     const orderPayload = {
//       amount: Math.round(finalPaise), // paise
//       currency: "INR",
//       receipt,
//       payment_capture: 1,
//       notes: { auctionId, userId: userId ? String(userId) : null },
//     };

//     try {
//       const order = await razorpayInstance.Order.create(orderPayload);
//       // persist PaymentRecord (example)
//       const payment = await PaymentRecord.create({
//         user: userId,
//         auction: auctionId,
//         razorpayOrderId: order.id,
//         amountPaise: finalPaise,
//         currency: "INR",
//         status: "PENDING",
//         providerResponse: order,
//         checkoutUrl: null,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       return res.json({
//         success: true,
//         data: { orderId: order.id, amountPaise: finalPaise, paymentRecordId: payment._id, currency: "INR" },
//       });
//     } catch (err) {
//       console.error("create-order error:", err);
//       return res.status(500).json({ success: false, message: "Failed to create order", error: err?.message || err });
//     }
//   })
// );

// router.post(
//   "/create-preference",
//   protect,
//   asyncHandler(async (req, res) => {
//     try {
//       const userId = req.user && req.user._id ? req.user._id : null;
//       if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//       let { auctionId, amountPaise, productName = "", customer = {}, notes = {} } = req.body;

//       // Resolve amountPaise from auction if auctionId given
//       if ((!amountPaise || Number(amountPaise) <= 0) && auctionId) {
//         const auction = await Auction.findById(auctionId).lean();
//         if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });
//         // choose final / current / starting price robustly:
//         amountPaise =
//           auction.finalPricePaise ??
//           auction.currentPricePaise ??
//           (auction.currentPrice ? Math.round(Number(auction.currentPrice) * 100) : null) ??
//           auction.startingPricePaise ??
//           (auction.startingPrice ? Math.round(Number(auction.startingPrice) * 100) : null);
//       }

//       if (!amountPaise || Number(amountPaise) <= 0) {
//         return res.status(400).json({ success: false, message: "Invalid amountPaise" });
//       }
//       amountPaise = Math.round(Number(amountPaise));

//       // Build preference payload for Razorpay standard checkout
//       const prefBody = {
//         amount: amountPaise,
//         currency: "INR",
//         customer: customer || {},
//         notes: {
//           ...notes,
//           auctionId: auctionId || null,
//           userId: userId ? String(userId) : null,
//           productName: productName || "",
//         },
//         checkout: {
//           mode: "payment",
//           redirect: {
//             url: `${FRONTEND_BASE_URL}/checkout-callback`
//           }
//         }
//       };

//       const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

//       // Call Razorpay server API (v1 standard_checkout/preferences) from server
//       const r = await axios.post("https://api.razorpay.com/v1/standard_checkout/preferences", prefBody, {
//         headers: {
//           Authorization: `Basic ${auth}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 15000,
//       });

//       const pref = r.data || {};

//       // Save PaymentRecord in DB for later verification / reference
//       const paymentDoc = await PaymentRecord.create({
//         user: userId,
//         auction: auctionId || null,
//         razorpayOrderId: null,
//         razorpayPreferenceId: pref.id || null,
//         amountPaise,
//         depositPaise: 0,
//         amountDuePaise: amountPaise,
//         currency: "INR",
//         status: "PENDING",
//         providerResponse: pref,
//         checkoutUrl: pref.checkout_url || pref.launch_url || null,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       return res.json({
//         success: true,
//         checkoutUrl: pref.checkout_url || pref.launch_url || null,
//         preference: pref,
//         paymentRecordId: paymentDoc._id,
//       });
//     } catch (err) {
//       console.error("create-preference err:", err?.response?.data || err?.message || err);
//       const status = err?.response?.status || 500;
//       const data = err?.response?.data || { message: err?.message || "Razorpay error" };
//       return res.status(status).json({ success: false, error: data });
//     }
//   })
// );

// router.post("/verify", authUser, express.json(), async (req, res) => {
//   try {
//     const body = req.body || {};
//     const action = (body.action || "").toString().trim();
//     if (!action) return res.status(400).json({ success: false, message: "Action required" });

//     if (action === "fetch") {
//       const out = await paymentService.handleFetch(body);
//       return res.status(out.success ? 200 : 404).json(out);
//     }

//     if (action === "verify") {
//       const out = await handleVerify(body, req);
//       return res.status(out.success ? 200 : 400).json(out);
//     }

//     if (action === "finalizeNoPay") {
//       const out = await paymentService.handleFinalizeNoPay(body, req);
//       return res.status(out.success ? 200 : 400).json(out);
//     }

//     return res.status(400).json({ success: false, message: "Unknown action" });
//   } catch (err) {
//     console.error("paymentService /verify error:", err);
//     return res.status(500).json({ success: false, message: err.message || String(err) });
//   }
// });

// router.post(
//   "/create-order",
//   protect,
//   asyncHandler(async (req, res) => {
//     try {
//       const userId = req.user._id;
//       const { auctionId, amountPaise } = req.body;
//       if (!auctionId) return res.status(400).json({ success: false, message: "auctionId required" });

//       const auction = await Auction.findById(auctionId).lean();
//       if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });

//       const finalPaise =
//         amountPaise != null
//           ? Math.round(Number(amountPaise))
//           : auction.finalPricePaise ?? auction.currentPricePaise ?? (auction.startingPrice ? Math.round(Number(auction.startingPrice) * 100) : 0);

//       if (!finalPaise || finalPaise <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });

//       const receipt = safeReceipt({ prefix: "pay", auctionId, userId });

//       const order = await createRazorpayOrder(finalPaise, {
//         receipt,
//         notes: { auctionId, userId, type: "final" },
//       });

//       const payment = await PaymentRecord.create({
//         user: userId,
//         auction: auctionId,
//         razorpayOrderId: order.id,
//         amountPaise: finalPaise,
//         depositPaise: 0,
//         amountDuePaise: finalPaise,
//         currency: "INR",
//         status: "PENDING",
//         providerResponse: order,
//         checkoutUrl: null,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       return res.json({
//         success: true,
//         data: { orderId: order.id, amountPaise: finalPaise, paymentRecordId: payment._id, currency: "INR" },
//       });
//     } catch (err) {
//       console.error("create-order error:", err?.message || err);
//       return res.status(500).json({ success: false, message: err?.message || String(err) });
//     }
//   })
// );



/**
 * Create Standard Checkout Preference from server
 * POST /api/payment2/create-preference
 * body: { auctionId?, amountPaise?, productName?, customer?: {name,email,contact}, notes?: {} }
 * Protected
 * returns: { success:true, checkoutUrl, preference, paymentRecordId }
 */
router.post("/create-order", protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { auctionId, amountPaise } = req.body;
  if (!auctionId) return res.status(400).json({ success: false, message: "auctionId required" });

  const auction = await Auction.findById(auctionId).lean();
  if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });

  const finalPaise = amountPaise != null
    ? Math.round(Number(amountPaise))
    : auction.finalPricePaise ?? auction.currentPricePaise ?? (auction.startingPrice ? Math.round(Number(auction.startingPrice) * 100) : 0);

  if (!finalPaise || finalPaise <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });

  const receipt = safeReceipt({ prefix: "pay", auctionId, userId });
  const order = await createRazorpayOrder(finalPaise, { receipt, notes: { auctionId, userId, type: "final" } });

  const payment = await PaymentRecord.create({
    user: userId,
    auction: auctionId,
    razorpayOrderId: order.id,
    amountPaise: finalPaise,
    depositPaise: 0,
    amountDuePaise: finalPaise,
    currency: "INR",
    status: "PENDING",
    providerResponse: order,
    checkoutUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return res.json({
    success: true,
    data: { orderId: order.id, amountPaise: finalPaise, paymentRecordId: payment._id, currency: "INR" },
  });
}));


router.post("/create-preference", protect, asyncHandler(async (req, res) => {
  const userId = req.user && req.user._id ? req.user._id : null;
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

  let { auctionId, amountPaise, productName = "", customer = {}, notes = {} } = req.body;

  if ((!amountPaise || Number(amountPaise) <= 0) && auctionId) {
    const auction = await Auction.findById(auctionId).lean();
    if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });
    amountPaise = auction.finalPricePaise ?? auction.currentPricePaise ?? (auction.currentPrice ? Math.round(Number(auction.currentPrice) * 100) : null) ?? auction.startingPricePaise;
  }

  if (!amountPaise || Number(amountPaise) <= 0) return res.status(400).json({ success: false, message: "Invalid amountPaise" });
  amountPaise = Math.round(Number(amountPaise));

  // optional create order
  let rzpOrder = null;
  try {
    const receipt = safeReceipt({ prefix: "pref", auctionId, userId });
    rzpOrder = await createRazorpayOrder(amountPaise, { receipt, notes: { auctionId, userId: String(userId), type: "preference" } });
  } catch (err) {
    console.warn("Optional order creation failed:", err?.message || err);
    rzpOrder = null;
  }

  // build pref payload
  const prefBody = {
    amount: amountPaise,
    currency: "INR",
    customer: customer || {},
    notes: { ...notes, auctionId: auctionId || null, userId: String(userId), productName, rzpOrderId: rzpOrder ? rzpOrder.id : null },
    checkout: { mode: "payment", redirect: { url: `${FRONTEND_BASE_URL}/checkout-callback` } },
  };

  try {
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
    const r = await axios.post("https://api.razorpay.com/v1/standard_checkout/preferences", prefBody, {
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      timeout: 20000,
    });
    const prefResp = r.data || {};
    // save payment record
    const paymentDoc = await PaymentRecord.create({
      user: userId, auction: auctionId || null, razorpayOrderId: rzpOrder ? rzpOrder.id : null,
      razorpayPreferenceId: prefResp?.id || null, amountPaise, depositPaise: 0, amountDuePaise: amountPaise,
      currency: "INR", status: "PENDING", providerResponse: prefResp, checkoutUrl: prefResp?.checkout_url || prefResp?.launch_url || null,
      createdAt: new Date(), updatedAt: new Date()
    });

    return res.json({ success: true, checkoutUrl: prefResp?.checkout_url || prefResp?.launch_url || null, preference: prefResp, paymentRecordId: paymentDoc._id, razorpayOrderId: rzpOrder ? rzpOrder.id : null, amountPaise });
  } catch (err) {
    // on preference creation error, create fallback payment record and return fallback front-end URL
    console.error("Razorpay preference error:", err?.response?.status, err?.response?.data || err?.message || err);
    const fallbackPayment = await PaymentRecord.create({
      user: userId, auction: auctionId || null, razorpayOrderId: rzpOrder ? rzpOrder.id : null,
      razorpayPreferenceId: null, amountPaise, depositPaise: 0, amountDuePaise: amountPaise,
      currency: "INR", status: "PENDING", providerResponse: rzpOrder || null, checkoutUrl: null,
      createdAt: new Date(), updatedAt: new Date()
    });

    // fallback frontend url that will open popup using orderId (if we have rzpOrder) or go to checkout page
    const fallbackUrl = rzpOrder && rzpOrder.id
      ? `${FRONTEND_BASE_URL.replace(/\/$/, "")}/checkout?orderId=${encodeURIComponent(rzpOrder.id)}&auctionId=${encodeURIComponent(auctionId)}&amountPaise=${encodeURIComponent(amountPaise)}`
      : `${FRONTEND_BASE_URL.replace(/\/$/, "")}/checkout?auctionId=${encodeURIComponent(auctionId)}&amountPaise=${encodeURIComponent(amountPaise)}`;

    return res.status(err?.response?.status || 500).json({ success: false, message: "Preference creation failed", error: err?.response?.data || err?.message || err, paymentRecordId: fallbackPayment._id, fallbackUrl });
  }
}));


/**
 * Single verify endpoint (fetch | verify | finalizeNoPay)
 * POST /api/payment2/verify
 */
router.post("/verify", async (req, res) => {
  const { action } = req.body;
  try {
    if (action === "fetch") {
      // attempt to fetch by paymentRecordId or orderId or auctionId
      const { paymentRecordId, orderId, auctionId } = req.body;

      let payment;
      if (paymentRecordId) payment = await PaymentRecord.findById(paymentRecordId).lean();
      else if (orderId) payment = await PaymentRecord.findOne({ razorpayOrderId: orderId }).lean();
      else if (auctionId) payment = await PaymentRecord.findOne({ auction: auctionId }).lean();

      if (!payment) {
        return res.json({ success: false, message: "Checkout info not found" });
      }

      // Compose response shape frontend expects
      const response = {
        razorpayOrderId: payment.razorpayOrderId,
        paymentRecordId: payment._id,
        amountPaise: payment.amountPaise,
        amountDuePaise: payment.amountDuePaise ?? Math.max(0, payment.amountPaise - (payment.depositPaise || 0)),
        depositPaise: payment.depositPaise || 0,
        productName: (payment.items && payment.items[0] && payment.items[0].name) || "",
        auctionId: payment.auction,
        checkoutUrl: paymentService.buildFrontendCheckoutUrl({
          paymentLinkId: payment.paymentRef || "",
          razorpayOrderId: payment.razorpayOrderId || "",
          auctionId: payment.auction || "",
          productName: (payment.items && payment.items[0] && payment.items[0].name) || "",
          amountPaise: payment.amountDuePaise ?? payment.amountPaise,
        }),
      };

      return res.json({ success: true, data: response });
    }

    if (action === "verify") {
      // verify signature from Razorpay Checkout
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        paymentRecordId,
        address,
        auctionId,
      } = req.body;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !paymentRecordId) {
        return res.json({ success: false, message: "Missing verification params" });
      }

      // load PaymentRecord
      const pr = await PaymentRecord.findById(paymentRecordId);
      if (!pr) return res.json({ success: false, message: "Payment record not found" });

      const valid = verifyRazorpaySignature({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!valid) {
        return res.json({ success: false, message: "Invalid signature" });
      }

      // mark record as paid
      pr.razorpayPaymentId = razorpay_payment_id;
      pr.razorpaySignature = razorpay_signature;
      pr.status = "SUCCESS";
      pr.address = address || pr.address || {};
      pr.updatedAt = new Date();
      await pr.save();

      // (Optional) update Auction status, decrease stock, notify user, etc.
      // await Auction.findByIdAndUpdate(pr.auction, { status: "SOLD" });

      return res.json({ success: true, message: "Payment verified", data: { paymentId: razorpay_payment_id } });
    }

    if (action === "finalizeNoPay") {
      const { paymentRecordId, auctionId, address } = req.body;
      if (!paymentRecordId) return res.json({ success: false, message: "Missing paymentRecordId" });

      const pr = await PaymentRecord.findById(paymentRecordId);
      if (!pr) return res.json({ success: false, message: "Payment record not found" });

      // If amountDuePaise is 0, finalize
      const amountDue = pr.amountDuePaise ?? Math.max(0, pr.amountPaise - (pr.depositPaise || 0));
      if (amountDue > 0) return res.json({ success: false, message: "Payment still due" });

      pr.status = "SUCCESS";
      pr.address = address || pr.address || {};
      pr.updatedAt = new Date();
      await pr.save();

      return res.json({ success: true, message: "Order finalized (no payment)" });
    }

    return res.json({ success: false, message: "Invalid action" });
  } catch (err) {
    console.error("payment2 endpoint error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

router.post(
  "/create-payment-link",
  authUser,
  asyncHandler(async (req, res) => {
    try {
      const userId = req.user && req.user._id ? String(req.user._id) : null;
      if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const { auctionId, amountPaise: requestedAmountPaise = null, depositPercent = null, depositAmountPaise = null, productName = "", address = {} } = req.body;

      if (!auctionId) return res.status(400).json({ success: false, message: "auctionId required" });

      // fetch auction
      const auction = await Auction.findById(auctionId).lean();
      if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });

      // resolve finalPaise
      const finalPaise =
        requestedAmountPaise != null && !isNaN(requestedAmountPaise) && Number(requestedAmountPaise) > 0
          ? Math.round(Number(requestedAmountPaise))
          : auction.finalPricePaise ?? auction.currentPricePaise ?? (auction.currentPrice ? Math.round(Number(auction.currentPrice) * 100) : 0);

      if (!finalPaise || finalPaise <= 0) return res.status(400).json({ success: false, message: "Invalid final amount" });

      // compute deposit
      let appliedDepositPaise = 0;
      const depositRecord = await Deposit.findOne({ user: userId, auction: auctionId, status: "paid" }).lean();
      if (depositRecord && depositRecord.amountPaise) {
        appliedDepositPaise = Number(depositRecord.amountPaise);
      } else if (depositAmountPaise != null && Number(depositAmountPaise) > 0) {
        appliedDepositPaise = Math.round(Number(depositAmountPaise));
      } else if (auction.depositAmountPaise != null && Number(auction.depositAmountPaise) > 0) {
        appliedDepositPaise = Math.round(Number(auction.depositAmountPaise));
      } else {
        const pct = depositPercent != null ? Number(depositPercent) : auction.depositPercent != null ? Number(auction.depositPercent) : 25;
        appliedDepositPaise = Math.round((Number(finalPaise) * (pct || 25)) / 100);
      }
      if (appliedDepositPaise > finalPaise) appliedDepositPaise = finalPaise;

      const amountDuePaise = Math.max(0, Math.round(Number(finalPaise) - Number(appliedDepositPaise)));

      // create optional order if you want (not required for payment link). We'll create it because it helps tying records.
      let razorpayOrder = null;
      if (amountDuePaise > 0) {
        try {
          razorpayOrder = await razorpayInstance.orders.create({
            amount: amountDuePaise,
            currency: "INR",
            receipt: safeReceipt({ prefix: "pay", auctionId, userId }),
            payment_capture: 1,
            notes: { auctionId, userId, type: "final" },
          });
        } catch (err) {
          // log but continue - order is optional
          console.warn("Warning: create order failed, continuing to create payment link. err:", err?.error || err?.message || err);
          razorpayOrder = null;
        }
      }

      // If amountDuePaise === 0 -> deposit covered full amount => no need to create link
      if (amountDuePaise === 0) {
        // create a PaymentRecord marked paid_by_deposit
        const paidDoc = await PaymentRecord.create({
          user: mongoose.Types.ObjectId(userId),
          auction: mongoose.Types.ObjectId(auctionId),
          razorpayOrderId: razorpayOrder?.id || null,
          paymentRef: null,
          items: [{ productId: auctionId, name: productName || auction.productName || "Auction Item", quantity: 1, price: Math.round(finalPaise / 100) }],
          amountPaise: finalPaise,
          currency: "INR",
          status: "PAID",
          providerResponse: null,
          receipt: safeReceipt({ prefix: "pay", auctionId, userId }),
          address: {
            fullName: address?.fullName || "",
            line1: address?.line1 || "",
            city: address?.city || "",
            state: address?.state || "",
            pincode: address?.pincode || "",
          },
          mobile: address?.mobile || "",
          depositPercent,
          depositPaise: appliedDepositPaise,
          depositAmountPaise,
          amountDuePaise,
        });

        return res.json({ success: true, message: "Paid by deposit", checkoutUrl: null, paymentRecord: paidDoc, amountPaise: finalPaise });
      }

      // Build payload **only** with allowed fields for Razorpay paymentLink.create
      const safePayload = {
        amount: amountDuePaise,
        currency: "INR",
        accept_partial: false,                      // true if you want partial accept
        description: productName || auction.productName || "Auction payment",
        reference_id: razorpayOrder ? razorpayOrder.id : safeReceipt({ prefix: "pay", auctionId, userId }),
        customer: {},
        notify: { sms: true, email: true },
        notes: {
          auctionId,
          userId,
          depositAppliedPaise: appliedDepositPaise,
          razorpayOrderId: razorpayOrder ? razorpayOrder.id : undefined,
        },
        // expire_by: Math.floor(Date.now() / 1000) + 7 * 24 * 3600, // optional expiry
      };

      // add customer details only if present
      if (address?.fullName) safePayload.customer.name = address.fullName;
      if (address?.email) safePayload.customer.email = address.email;
      if (address?.mobile) {
        // sanitize and ensure string digits
        const digits = String(address.mobile).replace(/\D/g, "");
        if (digits.length >= 7) safePayload.customer.contact = digits;
      }
      // If customer is still empty object, delete it (Razorpay accepts missing customer)
      if (Object.keys(safePayload.customer).length === 0) delete safePayload.customer;

      // Create payment link via SDK
      const created = await createPaymentLinkSafe(safePayload);
      if (!created.success) {
        // return detailed error (Razorpay provides error object in created.details)
        console.error("Payment link generation failed:", created.details || created.error);
        return res.status(400).json({ success: false, message: "Payment link generation failed", error: created.details || String(created.error) });
      }

      const paymentLink = created.paymentLink;
      const checkoutUrl = paymentLink.short_url || paymentLink.long_url || null;

      // Save PaymentRecord
      const paymentDoc = await PaymentRecord.create({
        user: mongoose.Types.ObjectId(userId),
        auction: mongoose.Types.ObjectId(auctionId),
        razorpayOrderId: razorpayOrder?.id || null,
        paymentRef: paymentLink.id,
        items: [{ productId: auctionId, name: productName || auction.productName || "Auction Item", quantity: 1, price: Math.round(finalPaise / 100) }],
        amountPaise: finalPaise,
        currency: "INR",
        status: "PENDING",
        providerResponse: paymentLink,
        receipt: safeReceipt({ prefix: "pay", auctionId, userId }),
        address: {
          fullName: address?.fullName || "",
          line1: address?.line1 || "",
          city: address?.city || "",
          state: address?.state || "",
          pincode: address?.pincode || "",
        },
        mobile: address?.mobile || "",
        depositPercent,
        depositPaise: appliedDepositPaise,
        depositAmountPaise,
        amountDuePaise,
      });

      return res.json({
        success: true,
        checkoutUrl,
        paymentRecord: paymentDoc,
        paymentLink,
        amountPaise: finalPaise,
        depositPaise: appliedDepositPaise,
        amountDuePaise,
        razorpayOrderId: razorpayOrder?.id || null,
      });
    } catch (err) {
      console.error("createPaymentLinkForAuction ERROR:", err?.message || err, err?.response?.data || null);
      const details = err?.response?.data || err?.error || null;
      return res.status(500).json({ success: false, message: "Internal server error", error: err?.message || String(err), details });
    }
  })
);




export default router;
