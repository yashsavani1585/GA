import express from 'express';
import { verifyPayment } from '../config/paymentService.js';
import Auction from '../models/auctionModel.js';
import Bid from '../models/bidModel.js';
import { createHmac } from 'crypto';
import Order from "../models/orderModel.js"
import mongoose from "mongoose";
import Payment2 from '../models/Payment2.js';


const router = express.Router();

// Payment webhook
router.post('/webhook', async (req, res) => {
  try {
    const { merchantTransactionId, transactionId, amount, code } = req.body;

    // Verify payment with PhonePe
    const paymentStatus = await verifyPayment(merchantTransactionId);

    if (paymentStatus.code === 'PAYMENT_SUCCESS') {
      // Extract auction ID from merchantTransactionId
      const auctionId = merchantTransactionId.split('_')[1];
      
      // Update auction payment status
      await Auction.findByIdAndUpdate(auctionId, {
        paymentStatus: 'completed',
        paymentId: transactionId,
        paidAt: new Date()
      });

      // Update bid payment status
      await Bid.findOneAndUpdate(
        { auction: auctionId, isWinningBid: true },
        { paymentStatus: 'completed' }
      );

      console.log(`✅ Payment completed for auction: ${auctionId}`);
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ success: false });
  }
});

// Check payment status
router.get('/status/:auctionId', async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId);
    
    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }

    res.json({
      success: true,
      data: {
        paymentStatus: auction.paymentStatus || 'pending',
        paymentId: auction.paymentId,
        paidAt: auction.paidAt
      }
    });

  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// router.post("/verify", async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     // Missing fields
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing Razorpay fields",
//       });
//     }

//     // ✅ Signature verification
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     const isValid = expectedSignature === razorpay_signature;

//     // ✅ Find order
//     const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // ❌ Invalid signature
//     if (!isValid) {
//       order.payment = false;
//       order.status = "Canceled";
//       await order.save();

//       return res.status(400).json({
//         success: false,
//         message: "Invalid signature",
//         order,
//       });
//     }

//     // ✅ Prevent double verify
//     if (order.payment === true) {
//       return res.json({
//         success: true,
//         message: "Payment already verified",
//         order,
//       });
//     }

//     // ✅ Generate paymentRef (ESM compatible)
//     const paymentRefId = new mongoose.Types.ObjectId();

//     // ✅ Select REAL IMAGE
//     const realImage =
//       order.auctionImage ||
//       order.image ||
//       order.productImage ||
//       order.productImg ||
//       (order.items?.length ? order.items[0].image : null) ||
//       null;

//     // ✅ Create payment doc
//     const paymentDoc = await Payment.create({
//       _id: paymentRefId,
//       userId: order.userId,
//       order_id: order.order_id || order._id.toString(),
//       amount: order.amount || order.winnerBidAmount,
//       status: "SUCCESS",
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       signature: razorpay_signature,
//     });

//     // ✅ Update order completely
//     order.payment = true;
//     order.status = "Processing";
//     order.paymentRef = paymentRefId;
//     order.paymentId = razorpay_payment_id;
//     order.razorpayPaymentId = razorpay_payment_id;
//     order.razorpayOrderId = razorpay_order_id;
//     order.amount = order.amount || order.winnerBidAmount || 0;

//     // ✅ Auction fallback items
//     if (order.isAuctionOrder) {
//       if (!order.items || order.items.length === 0) {
//         order.items = [
//           {
//             productId: order.auctionId,
//             name: order.winnerName || "Auction Item",
//             quantity: 1,
//             price: order.winnerBidAmount || order.amount,
//             image: realImage,
//           },
//         ];
//       } else {
//         // Fill image if missing
//         order.items = order.items.map((item) => ({
//           ...item,
//           image: item.image || realImage,
//         }));
//       }
//     }

//     await order.save();

//     return res.json({
//       success: true,
//       message: "Payment verified successfully",
//       order,
//       payment: paymentDoc,
//     });
//   } catch (err) {
//     console.error("Verify error:", err);
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// });

// router.post("/verify", async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     // ✅ Validate fields
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing Razorpay verification fields",
//       });
//     }

//     // ✅ Signature Verification
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     const isValid = expectedSignature === razorpay_signature;

//     // ✅ Get Order
//     const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // ❌ Wrong signature
//     if (!isValid) {
//       order.payment = false;
//       order.status = "Canceled";
//       await order.save();
//       return res.status(400).json({
//         success: false,
//         message: "Invalid signature",
//         order,
//       });
//     }

//     // ✅ Prevent double verification
//     if (order.payment === true) {
//       return res.json({
//         success: true,
//         message: "Payment already verified",
//         order,
//       });
//     }

//     // ✅ Auto select proper image
//     const realImage =
//       order.auctionImage ||
//       order.productImage ||
//       order.image ||
//       (order.items?.length ? order.items[0].image : null) ||
//       null;

//     // ✅ Create a new paymentRef ObjectId
//     const paymentRefId = new mongoose.Types.ObjectId();

//     // ✅ Create payment document (NOW WITH ALL REQUIRED FIELDS)
//     const paymentDoc = await Payment.create({
//       _id: paymentRefId,
//       userId: order.userId,
//       order_id: order._id.toString(),
//       amount: order.amount || order.winnerBidAmount,
//       status: "SUCCESS",
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       signature: razorpay_signature,

//       // ✅ FIXED REQUIRED FIELDS
//       // deliveryType: order.deliveryType || "Standard Delivery",
//       // mobileNumber: order.mobileNumber,
//       email: order.email,
//     });

//     // ✅ Update order info
//     order.payment = true;
//     order.status = "Processing";
//     order.paymentRef = paymentRefId;
//     order.paymentId = razorpay_payment_id;
//     order.razorpayPaymentId = razorpay_payment_id;
//     order.razorpayOrderId = razorpay_order_id;
//     order.amount = order.amount || order.winnerBidAmount || 0;

//     // ✅ Fix auction items & images
//     if (!order.items || order.items.length === 0) {
//       order.items = [
//         {
//           productId: order.auctionId,
//           name: order.winnerName || "Auction Item",
//           price: order.winnerBidAmount || order.amount,
//           quantity: 1,
//           image: realImage,
//         },
//       ];
//     } else {
//       order.items = order.items.map((i) => ({
//         ...i,
//         image: i.image || realImage,
//       }));
//     }

//     await order.save();

//     return res.json({
//       success: true,
//       message: "Payment verified successfully",
//       order,
//       payment: paymentDoc,
//     });
//   } catch (err) {
//     console.error("Verify error:", err);
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// });



// router.post("/verify", async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing Razorpay fields",
//       });
//     }

//     const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Validate signature
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     const isValid = expectedSignature === razorpay_signature;

//     if (!isValid) {
//       order.payment = false;
//       order.paymentStatus = "FAILED";
//       order.deliveryStatus = "Canceled";
//       await order.save();
//       return res.status(400).json({ success: false, message: "Invalid signature" });
//     }

//     // ✅ Real image choose
//     const realImage =
//       order.auctionImage ||
//       order.productImage ||
//       order.image ||
//       (order.items?.length ? order.items[0].image : null) ||
//       null;

//     // ✅ Create your paymentRef
//     const paymentRefId = new mongoose.Types.ObjectId();

//     // ✅ Create Payment2 document
//     const paymentDoc = await Payment2.create({
//       _id: paymentRefId,
//       userId: order.userId,
//       orderId: order._id.toString(),
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       razorpaySignature: razorpay_signature,
//       amount: order.amount,
//       status: "SUCCESS",
//       image: realImage,
//       items: order.items,
//       providerResponse: req.body,
//     });

//     // ✅ Update order details
//     order.payment = true;
//     order.paymentStatus = "SUCCESS";
//     order.deliveryStatus = "Processing";
//     order.paymentRef = paymentRefId;
//     order.razorpayPaymentId = razorpay_payment_id;
//     order.razorpayOrderId = razorpay_order_id;

//     // ✅ Fix items image
//     order.items = order.items.map((i) => ({
//       ...i,
//       image: i.image || realImage,
//     }));

//     await order.save();

//     return res.json({
//       success: true,
//       message: "Payment verified successfully",
//       order,
//       payment: paymentDoc,
//     });
//   } catch (err) {
//     console.error("Verify error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// router.post("/verify", async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing Razorpay fields",
//       });
//     }

//     // ✅ Find the order
//     const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // ✅ Validate Razorpay signature
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       order.paymentStatus = "FAILED";
//       order.deliveryStatus = "Canceled";
//       await order.save();
//       return res.status(400).json({ success: false, message: "Invalid signature" });
//     }

//     // ✅ Always choose the right image (Auction > Product > Item)
//     const realImage =
//       order.auctionImage ||
//       order.productImage ||
//       order.image ||
//       (order.items?.length ? order.items[0].image : null) ||
//       "https://placehold.co/600x600?text=No+Image";

//     // ✅ Save selected image in Order too
//     order.image = realImage;

//     // ✅ paymentRef ID
//     const paymentRefId = new mongoose.Types.ObjectId();

//     // ✅ Create Payment2
//     const paymentDoc = await Payment2.create({
//       _id: paymentRefId,
//       userId: order.userId,
//       order_id: order.order_id,

//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       razorpaySignature: razorpay_signature,

//       amount: order.amount,
//       status: "SUCCESS",

//       // ✅ Save image for frontend
//       image: realImage,
//       productImage: order.productImage || null,
//       auctionImage: order.auctionImage || null,

//       items: order.items,
//       providerResponse: req.body,
//     });

//     // ✅ Update Order
//     order.paymentStatus = "SUCCESS";
//     order.deliveryStatus = "Processing";
//     order.paymentRef = paymentRefId;
//     order.razorpayPaymentId = razorpay_payment_id;

//     // ✅ Fix item images
//     order.items = order.items.map((it) => ({
//       ...it,
//       image: it.image || realImage,
//     }));

//     await order.save();

//     return res.json({
//       success: true,
//       message: "Payment verified successfully",
//       order,
//       payment: paymentDoc,
//       paymentRef: paymentDoc._id, // ✅ now included
//     });
//   } catch (err) {
//     console.error("Verify error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });


// router.post("/verify", async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     // 🔹 Step 1: Validate fields
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing Razorpay fields (order_id, payment_id, signature).",
//       });
//     }

//     // 🔹 Step 2: Find order by razorpayOrderId
//     const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found.",
//       });
//     }

//     // 🔹 Step 3: Verify signature using Razorpay key secret
//     const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature = 
//       createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(signBody)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       // ❌ Signature mismatch — mark as failed
//       order.paymentStatus = "FAILED";
//       order.deliveryStatus = "Canceled";
//       await order.save();

//       return res.status(400).json({
//         success: false,
//         message: "Invalid signature — payment verification failed.",
//       });
//     }

//     // 🔹 Step 4: Get image safely
//     const realImage =
//       order.auctionImage ||
//       order.productImage ||
//       (order.items?.[0]?.image ?? "https://placehold.co/600x600?text=No+Image");

//     // 🔹 Step 5: Create payment document
//     const paymentRefId = new mongoose.Types.ObjectId();
//     const paymentDoc = await Payment2.create({
//       _id: paymentRefId,
//       userId: order.userId,
//       order_id: order.order_id,
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       razorpaySignature: razorpay_signature,
//       amount: order.amount,
//       currency: "INR",
//       status: "SUCCESS",
//       image: realImage,
//       productImage: order.productImage || null,
//       auctionImage: order.auctionImage || null,
//       items: order.items || [],
//       providerResponse: req.body,
//       createdAt: new Date(),
//     });

//     // 🔹 Step 6: Update main Order
//     const updatedOrder = await Order.findOneAndUpdate(
//       { razorpayOrderId: razorpay_order_id },
//       {
//         $set: {
//           paymentStatus: "SUCCESS",
//           deliveryStatus: "Processing",
//           payment: true,
//           razorpayPaymentId: razorpay_payment_id,
//           paymentRef: paymentRefId,
//           image: realImage,
//           items: (order.items || []).map((item) => ({
//             ...item,
//             image: item.image || realImage,
//           })),
//           updatedAt: new Date(),
//         },
//       },
//       { new: true }
//     );

//     // 🔹 Step 7: Respond with success
//     return res.status(200).json({
//       success: true,
//       message: "✅ Payment verified successfully!",
//       paymentRef: paymentRefId,
//       razorpayPaymentId: razorpay_payment_id,
//       order: updatedOrder,
//       payment: paymentDoc,
//     });
//   } catch (err) {
//     console.error("❌ Verify error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error during payment verification.",
//       error: err.message,
//     });
//   }
// });

// router.post("/verify", async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       address,
//       auctionId,
//     } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing Razorpay fields (order_id, payment_id, signature).",
//       });
//     }

//     // 🔹 Find payment document
//     const paymentDoc = await Payment2.findOne({
//       razorpayOrderId: razorpay_order_id,
//     });

//     if (!paymentDoc) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment record not found.",
//       });
//     }

//     // 🔹 Verify signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = createHmac(
//       "sha256",
//       process.env.RAZORPAY_KEY_SECRET
//     )
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       paymentDoc.status = "FAILED";
//       await paymentDoc.save();
//       return res.status(400).json({
//         success: false,
//         message: "Invalid signature — payment verification failed.",
//       });
//     }

//     // ✅ Update payment success
//     paymentDoc.status = "SUCCESS";
//     paymentDoc.razorpayPaymentId = razorpay_payment_id;
//     paymentDoc.razorpaySignature = razorpay_signature;
//     paymentDoc.paymentVerifiedAt = new Date();

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

//     // 🔹 Create Order record after payment success
//     const order = await Order.create({
//       userId: paymentDoc.userId,
//       order_id: paymentDoc.order_id,
//       auctionId: auctionId || paymentDoc.items?.[0]?.productId,
//       isAuctionOrder: true,
//       items: paymentDoc.items,
//       amount: paymentDoc.amount,
//       paymentMethod: "Razorpay",
//       payment: true,
//       razorpayPaymentId: paymentDoc.razorpayPaymentId,
//       razorpayOrderId: paymentDoc.razorpayOrderId,
//       razorpaySignature: paymentDoc.razorpaySignature,
//       paymentStatus: "SUCCESS",
//       address: {
//         recipientName: paymentDoc.address?.fullName,
//         recipientMobile: paymentDoc.mobile,
//         houseNo: paymentDoc.address?.line1,
//         locality: paymentDoc.address?.city,
//         landmark: paymentDoc.address?.state,
//         pincode: paymentDoc.address?.pincode,
//       },
//       auctionImage: paymentDoc.productImage,
//       status: "Order Placed",
//       paymentRef: paymentDoc._id,
//     });

//     // 🔹 Mark auction as paid
//     if (auctionId && mongoose.Types.ObjectId.isValid(auctionId)) {
//       await Auction.findByIdAndUpdate(auctionId, {
//         paymentStatus: "PAID",
//         winnerPaid: true,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "✅ Payment verified & order created successfully!",
//       payment: paymentDoc,
//       order,
//     });
//   } catch (err) {
//     console.error("❌ Verify payment error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error during payment verification.",
//       error: err.message,
//     });
//   }
// });


router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      address,
      auctionId,
    } = req.body;

    // 🧩 Step 1: Basic validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required Razorpay fields (order_id, payment_id, signature).",
      });
    }

    // 🧾 Step 2: Fetch Payment2 document
    const paymentDoc = await Payment2.findOne({ razorpayOrderId: razorpay_order_id });
    if (!paymentDoc) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found for this Razorpay order.",
      });
    }

    // 🔍 Step 3: Verify Razorpay Signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature =createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      paymentDoc.status = "FAILED";
      paymentDoc.razorpayPaymentId = razorpay_payment_id;
      paymentDoc.razorpaySignature = razorpay_signature;
      await paymentDoc.save();

      return res.status(400).json({
        success: false,
        message: "Invalid signature — payment verification failed.",
      });
    }

    // 💰 Step 4: Mark payment as successful
    paymentDoc.status = "SUCCESS";
    paymentDoc.razorpayPaymentId = razorpay_payment_id;
    paymentDoc.razorpaySignature = razorpay_signature;
    paymentDoc.paymentVerifiedAt = new Date();

    // 🏠 Update address (if provided)
    if (address) {
      paymentDoc.address = {
        fullName: address.fullName || paymentDoc.address?.fullName,
        line1: address.line1 || paymentDoc.address?.line1,
        city: address.city || paymentDoc.address?.city,
        state: address.state || paymentDoc.address?.state,
        pincode: address.pincode || paymentDoc.address?.pincode,
      };
      paymentDoc.mobile = address.mobile || paymentDoc.mobile;
    }

    await paymentDoc.save();

    // 🧠 Step 5: Create Order after verified payment
    const order = await Order.create({
      userId: paymentDoc.userId,
      order_id: paymentDoc.order_id,
      auctionId: auctionId || paymentDoc.items?.[0]?.productId,
      isAuctionOrder: true,
      items: paymentDoc.items,
      amount: paymentDoc.amount,
      paymentMethod: "Razorpay",
      payment: true,
      paymentStatus: "SUCCESS",
      razorpayPaymentId: paymentDoc.razorpayPaymentId,
      razorpayOrderId: paymentDoc.razorpayOrderId,
      razorpaySignature: paymentDoc.razorpaySignature,
      address: {
        recipientName: paymentDoc.address?.fullName,
        recipientMobile: paymentDoc.mobile,
        houseNo: paymentDoc.address?.line1,
        locality: paymentDoc.address?.city,
        landmark: paymentDoc.address?.state,
        pincode: paymentDoc.address?.pincode,
      },
      auctionImage:
        paymentDoc.productImage ||
        paymentDoc.auctionImage ||
        "https://placehold.co/600x600?text=No+Image",
      finalPrice: paymentDoc.amount,
      status: "Order Placed",
      paymentRef: paymentDoc._id,
      paymentRefModel: "Payment2",
    });

    // 🏆 Step 6: Mark auction as paid (if valid)
    if (auctionId && mongoose.Types.ObjectId.isValid(auctionId)) {
      await Auction.findByIdAndUpdate(auctionId, {
        paymentStatus: "PAID",
        winnerPaid: true,
        winnerPaymentId: paymentDoc._id,
      });
    }

    // ✅ Step 7: Respond success
    return res.status(200).json({
      success: true,
      message: "✅ Payment verified & order created successfully!",
      payment: paymentDoc,
      order,
    });
  } catch (err) {
    console.error("❌ [Verify Payment Error]:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during payment verification.",
      error: err.message,
    });
  }
});



router.get("/details/:paymentRef", async (req, res) => {
  try {
    const { paymentRef } = req.params;

    // ✅ Step 1: Determine if it's a valid MongoDB ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(paymentRef);
    let payment = null;

    // ✅ Step 2: Try to find by _id (only if valid ObjectId)
    if (isObjectId) {
      payment = await Payment2.findById(paymentRef).populate("userId", "name email");
    }

    // ✅ Step 3: If not found, try other identifiers
    if (!payment) {
      payment = await Payment2.findOne({
        $or: [
          { razorpayPaymentId: paymentRef },
          { razorpayOrderId: paymentRef },
          { order_id: paymentRef },
        ],
      }).populate("userId", "name email");
    }

    // ✅ Step 4: Handle not found case
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: `No payment found for reference: ${paymentRef}`,
      });
    }

    // ✅ Step 5: Return clean structured response
    return res.status(200).json({
      success: true,
      payment: {
        _id: payment._id,
        user: payment.userId
          ? {
              id: payment.userId._id,
              name: payment.userId.name,
              email: payment.userId.email,
            }
          : null,
        order_id: payment.order_id,
        razorpayOrderId: payment.razorpayOrderId,
        razorpayPaymentId: payment.razorpayPaymentId,
        razorpaySignature: payment.razorpaySignature,
        paymentRef: payment.paymentRef,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        providerResponse: payment.providerResponse,
        items: payment.items || [],
        address: {
          fullName: payment.address?.fullName,
          line1: payment.address?.line1,
          city: payment.address?.city,
          state: payment.address?.state,
          pincode: payment.address?.pincode,
        },
        mobile: payment.mobile,
        images: {
          main: payment.image,
          productImage: payment.productImage,
          auctionImage: payment.auctionImage,
        },
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching payment details:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching payment details",
      error: err.message,
    });
  }
});










router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



export default router;