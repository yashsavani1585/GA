

import Razorpay from "razorpay";
// import crypto from "crypto";
import userModel from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Payment from "../models/paymentModel.js";
import productModel from "../models/productModel.js";
import connectRedis from "../config/redis.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import dotenv from "dotenv";
import qs from "qs";
import { createHmac } from "crypto";
dotenv.config();

// --------------------
// 🔹 Initialize Redis
// --------------------
const redisClient = await connectRedis();

// --------------------
// 🔹 Razorpay instance
// --------------------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --------------------
// 🔹 Helper: Clear cart
// --------------------
const clearCart = async (userId) => {
  if (!userId) return;
  await redisClient.del(`cart:${userId}`);
  await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });
};


export const createPayment = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const {
      email,
      mobileNumber,
      deliveryType,
      recipientName,
      recipientMobile,
      pincode,
      houseNo,
      street,
      locality,
      landmark,
      gstNumber,
    } = req.body;

    if (!email || !mobileNumber) return res.status(400).json({ success: false, message: "Email and mobile required" });

    const user = await userModel.findById(userId).lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart = user.cartData || {};
    if (Object.keys(cart).length === 0) return res.status(400).json({ success: false, message: "Cart empty" });

    // compute total
    let amount = 0;
    for (const productId of Object.keys(cart)) {
      const variants = cart[productId];
      if (!variants || typeof variants !== "object") continue;

      for (const colorKey of Object.keys(variants)) {
        const variant = variants[colorKey];
        if (!variant || typeof variant !== "object") continue;

        let pricing, quantity;
        if (variant.pricing && variant.quantity) {
          pricing = typeof variant.pricing === "string" ? JSON.parse(variant.pricing) : variant.pricing;
          quantity = Number(variant.quantity) || 1;
        } else if (variant.gold?.pricing) {
          pricing = typeof variant.gold.pricing === "string" ? JSON.parse(variant.gold.pricing) : variant.gold.pricing;
          quantity = Number(variant.gold.quantity) || 1;
        } else continue;

        const price = Number(pricing?.finalPrice) || 0;
        if (price > 0 && quantity > 0) amount += price * quantity;
      }
    }

    if (amount <= 0) return res.status(400).json({ success: false, message: "Invalid cart total" });

    const order_id = uuidv4();

    const payment = await Payment.create({
      userId,
      order_id,
      email,
      mobileNumber,
      deliveryType,
      recipientName,
      recipientMobile: recipientMobile || mobileNumber,
      pincode,
      houseNo,
      street,
      locality,
      landmark,
      gstNumber,
      cartData: cart,
      amount,
      status: "PENDING",
    });

    const razorOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${payment._id}`,
      notes: { email, userId, order_id },
    });

    payment.razorpayOrderId = razorOrder.id;
    payment.providerResponse = razorOrder;
    await payment.save();

    console.log("✅ Razorpay Order Created:", razorOrder.id);

    // (Optional) Create an Order skeleton so you can show order immediately in UI:
    // If you prefer to create Order only on verify, comment out this block.
    const items = [];
    for (const [productId, productVariants] of Object.entries(cart)) {
      let image = "https://placehold.co/600x600?text=No+Image";
      try {
        const prod = await productModel.findById(productId).select("image thumbnail").lean();
        if (prod) image = (Array.isArray(prod.image) && prod.image[0]) || prod.thumbnail || image;
      } catch {}
      // pick first valid variant price
      for (const [colorKey, variant] of Object.entries(productVariants)) {
        let pricing;
        if (variant.pricing) pricing = typeof variant.pricing === "string" ? JSON.parse(variant.pricing) : variant.pricing;
        else if (variant.gold?.pricing) pricing = typeof variant.gold.pricing === "string" ? JSON.parse(variant.gold.pricing) : variant.gold.pricing;
        const price = Number(pricing?.finalPrice) || 0;
        const quantity = Number(variant.quantity || variant.gold?.quantity || 1) || 1;
        if (price > 0) {
          items.push({
            productId,
            name: (variant.name || "Product") + " - " + colorKey,
            quantity,
            price,
            image,
          });
        }
      }
    }

    // create an initial order record so UI shows order immediately (optional)
    await Order.create({
      userId,
      order_id: payment.order_id,
      razorpayOrderId: razorOrder.id,
      razorpayPaymentId: "N/A",
      amount: payment.amount,
      paymentStatus: "PENDING",
      deliveryStatus: "Order Placed",
      address: {
        pincode: payment.pincode,
        houseNo: payment.houseNo,
        street: payment.street,
        locality: payment.locality,
        landmark: payment.landmark,
        gstNumber: payment.gstNumber,
        deliveryType: payment.deliveryType,
      },
      items,
      paymentRef: null,
    });

    return res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: razorOrder.currency,
      orderId: razorOrder.id,
      order_id: payment.order_id,
      message: "Proceed to Razorpay Checkout",
    });
  } catch (err) {
    console.error("[createPayment] error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};







export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing Razorpay fields" });
    }

    const generatedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("❌ Signature mismatch for:", razorpay_order_id);
      return res.status(400).json({ success: false, message: "Invalid Razorpay signature" });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "SUCCESS",
        providerResponse: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
        paymentVerifiedAt: new Date(),
      },
      { new: true }
    );

    if (!payment) return res.status(404).json({ success: false, message: "Payment record not found" });

    console.log("✅ Payment verified successfully for:", razorpay_payment_id);

    // Build items (same as earlier)
    const items = [];
    const cartData = payment.cartData || {};
    for (const [productId, productVariants] of Object.entries(cartData)) {
      let image = "https://placehold.co/600x600?text=No+Image";
      try {
        const prod = await productModel.findById(productId).select("image thumbnail").lean();
        if (prod) image = (Array.isArray(prod.image) && prod.image[0]) || prod.thumbnail || image;
      } catch {}

      for (const [colorKey, variant] of Object.entries(productVariants)) {
        let pricing;
        if (variant.pricing) pricing = typeof variant.pricing === "string" ? JSON.parse(variant.pricing) : variant.pricing;
        else if (variant.gold?.pricing) pricing = typeof variant.gold.pricing === "string" ? JSON.parse(variant.gold.pricing) : variant.gold.pricing;
        const price = Number(pricing?.finalPrice) || 0;
        const quantity = Number(variant.quantity || variant.gold?.quantity || 1) || 1;
        if (price > 0) {
          items.push({
            productId,
            name: (variant.name || "Product") + " - " + colorKey,
            quantity,
            price,
            image,
          });
        }
      }
    }

    // Try to find existing Order by razorpayOrderId or order_id or create new
    let order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (order) {
      // update existing
      order.razorpayPaymentId = razorpay_payment_id;
      order.paymentStatus = "SUCCESS";
      order.paymentRef = payment._id;
      await order.save();
      console.log("✅ Order updated with paymentRef and razorpayPaymentId:", order._id);
    } else {
      order = await Order.create({
        userId: payment.userId,
        order_id: payment.order_id,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        amount: payment.amount,
        paymentStatus: "SUCCESS",
        deliveryStatus: "Order Placed",
        items,
        paymentRef: payment._id,
        paymentRefModel: "Payment",
        address: {
          pincode: payment.pincode,
          houseNo: payment.houseNo,
          street: payment.street,
          locality: payment.locality,
          landmark: payment.landmark,
          gstNumber: payment.gstNumber,
          deliveryType: payment.deliveryType,
        },
      });
      console.log("✅ Order created after payment:", order._id);
    }

    // Link payment -> orderRef
    if (!payment.orderRef || payment.orderRef.toString() !== order._id.toString()) {
      payment.orderRef = order._id;
      await payment.save();
    }

    // clear user cart
    try {
      await userModel.findByIdAndUpdate(payment.userId, { cartData: {} });
    } catch (err) {
      console.warn("[verifyPayment] failed to clear cart:", err.message);
    }

    return res.json({
      success: true,
      message: "Payment verified & order linked successfully",
      orderId: order._id,
      order_id: order.order_id,
      payment_id: razorpay_payment_id,
      paymentRef: payment._id,
    });
  } catch (err) {
    console.error("[verifyPayment] error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};





export const refundPayment = async (req, res) => {
  try {
    const { order_id, payment_id, token } = req.body;

    // ---- VALIDATE INPUTS ----
    if (!order_id || !payment_id || !token) {
      return res.status(400).json({
        success: false,
        message: "Order ID, Payment ID & Captcha token are required",
      });
    }

    // ---- CAPTCHA VERIFY ----
    const secret = process.env.RECAPTCHA_SECRET || "6LfRQc8rAAAAAKO-LjF2xraEU3kbeFKK1fbK2dqf";
    const captchaVerify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      qs.stringify({
        secret,
        response: token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!captchaVerify.data.success) {
      return res
        .status(400)
        .json({ success: false, message: "Captcha verification failed" });
    }

    console.log("Captcha verify result:", captchaVerify.data);


    // ---- FIND PAYMENT ----
    const payment = await Payment.findOne({ _id: payment_id, order_id });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    if (payment.status === "refunded") {
      return res.status(400).json({ success: false, message: "Payment already refunded" });
    }

    // ---- 24-HOUR REFUND CHECK ----
    const hoursPassed = (Date.now() - new Date(payment.createdAt).getTime()) / 1000 / 60 / 60;
    if (hoursPassed > 24) {
      return res.status(400).json({
        success: false,
        message: "Refund period expired (24h limit)",
      });
    }

    // ---- PROCESS RAZORPAY REFUND ----
    let refundInfo = null;
    if (payment.razorpayPaymentId) {
      refundInfo = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: payment.amount * 100, // convert to paise
      });
    }

    // ---- UPDATE PAYMENT STATUS ----
    payment.status = "refunded";
    await payment.save();

    // ---- UPDATE ORDER STATUS ----
    const order = await Order.findOne({ order_id: payment.order_id });
    if (order) {
      order.status = "Canceled"; // must match schema enum
      order.isCanceled = true;   // optional: if you added this field
      await order.save();
    }

    // ---- RETURN SUCCESS RESPONSE ----
    return res.json({
      success: true,
      message: "Payment refunded & order canceled successfully",
      order_id: payment.order_id,
      refund_id: refundInfo?.id || null,
      refund_status: refundInfo?.status || "refunded",
      amount: payment.amount,
      currency: payment.currency || "INR",
      order_status: order?.status || "Canceled",
    });
  } catch (err) {
    console.error("[refundPayment] error:", err);
    return res.status(500).json({
      success: false,
      message: "Refund failed",
      error: err.message,
    });
  }
};




export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ success: true, count: payments.length, payments });
  } catch (err) {
    console.error("[getAllPayments] error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};



