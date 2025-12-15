

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import connectRedis from "../config/redis.js";
import Payment from "../models/paymentModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Payment2 from "../models/Payment2.js";
import { sendAuctionWinEmail } from "../config/emailService.js";
import { generatePaymentLink } from "../config/paymentService.js";
import mongoose from "mongoose";
import PaymentRecord from "../models/PaymentRecord.js";
// import { clearCart } from "../utils/cart.js";
// import razorpay from "../config/razorpay.js";
// import crypto from "crypto";

// TTL for cached orders in seconds
const ORDER_CACHE_TTL = Number(process.env.ORDER_CACHE_TTL || 60);

// -------------------- Helpers --------------------
async function cacheOrders(key, data) {
  try {
    const redisClient = await connectRedis();
    await redisClient.setEx(key, ORDER_CACHE_TTL, JSON.stringify(data));
  } catch (err) {
    console.error("Redis setEx error:", err);
  }
}

async function getCachedOrders(key) {
  try {
    const redisClient = await connectRedis();
    const cached = await redisClient.get(key);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.error("Redis get error:", err);
  }
  return null;
}

// -------------------- Controllers --------------------

// Place COD order
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user.id; // Get userId from authenticated token

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      status: "Pending",
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Clear cached user orders
    const userOrdersCacheKey = `user_orders_${userId}`;
    const redisClient = await connectRedis();
    await redisClient.del(userOrdersCacheKey);

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placeholder for Razorpay integration
const placeOrderRazorpay = async (req, res) => {
  res.status(501).json({ success: false, message: "Razorpay not implemented yet" });
};

// Admin: Get all orders
// const allOrders = async (req, res) => {
//   try {
//     const cacheKey = "all_orders";
//     let orders = await getCachedOrders(cacheKey);

//     if (!orders) {
//       orders = await orderModel.find({});
//       await cacheOrders(cacheKey, orders);
//     }

//     res.json({ success: true, orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

//  const allOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({}).lean();
//     const paymentRecords = await PaymentRecord.find({ order_id: { $in: orders.map(o => o.order_id) } }).lean();
//     const paymentRecordMap = {};

//     const formattedOrders = orders.map((o) => ({
//       ...o,
//       isCanceled: o.isCanceled,
//       isRefunded: o.isRefunded,
//     }));

//     const pay

//     res.json({ success: true, orders: formattedOrders });
//   } catch (error) {
//     console.error("[allOrders] error:", error);
//     res.json({ success: false, message: error.message });
//   }
// };

 const allOrders = async (req, res) => {
  try {
    // 1️⃣ Fetch all orders
    const orders = await Order.find({}).lean();

    // 2️⃣ Fetch all payment records related to those orders
    const paymentRecords = await PaymentRecord.find({
      order_id: { $in: orders.map(o => o.order_id) }
    }).lean();

    // 3️⃣ Create map: order_id → paymentRecord
    const paymentRecordMap = {};
    paymentRecords.forEach(pr => {
      paymentRecordMap[pr.order_id] = pr;
    });

    // 4️⃣ Merge Order + PaymentRecord
    const formattedOrders = orders.map((o) => {
      const payment = paymentRecordMap[o.order_id] || null;

      return {
        /* ============ ORDER DATA ============ */
        ...o,
        isCanceled: o.isCanceled,
        isRefunded: o.isRefunded,

        /* ============ PAYMENT RECORD DATA ============ */
        paymentRecord: payment
          ? {
              ...payment,
              amountRupees: payment.amountPaise / 100,
              depositRupees: payment.depositPaise / 100,
              amountDueRupees: payment.amountDuePaise / 100,
            }
          : null,
      };
    });

    return res.json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("[allOrders] error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// User: Get orders
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const cacheKey = `user_orders_${userId}`;
    let orders = await getCachedOrders(cacheKey);

    if (!orders) {
      orders = await orderModel.find({ userId });
      await cacheOrders(cacheKey, orders);
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: Update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "OrderId & status required" });
    }

    // Update order only by UUID
    const order = await orderModel.findOneAndUpdate(
      { order_id: orderId }, // Always use UUID
      { status },
      { new: true }
    );



    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found with given order_id" });
    }

    // Clear Redis cache
    const redisClient = await connectRedis();
    await redisClient.del("all_orders");
    if (order.userId) await redisClient.del(`user_orders_${order.userId}`);

    res.json({ success: true, message: "Status updated successfully", order });
  } catch (error) {
    console.error("[updateStatus] error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};







export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!orders || orders.length === 0)
      return res.json({ success: true, count: 0, orders: [] });

    const result = await Promise.all(
      orders.map(async (order) => {
        let payment = null;
        let payment2 = null;

        // ✅ Prefer direct paymentRef
        if (
          order.paymentRef &&
          mongoose.Types.ObjectId.isValid(order.paymentRef)
        ) {
          // Try Payment first
          payment = await Payment.findById(order.paymentRef).lean();
          if (!payment)
            payment2 = await Payment2.findById(order.paymentRef).lean();
        }

        // ✅ Fallback to find by Razorpay IDs or order_id
        if (!payment && !payment2) {
          payment = await Payment.findOne({
            $or: [
              { razorpayPaymentId: order.razorpayPaymentId },
              { razorpayOrderId: order.razorpayOrderId },
              { order_id: order.order_id },
            ],
          }).lean();

          if (!payment) {
            payment2 = await Payment2.findOne({
              $or: [
                { razorpayPaymentId: order.razorpayPaymentId },
                { razorpayOrderId: order.razorpayOrderId },
                { order_id: order.order_id },
              ],
            }).lean();
          }
        }

        // ✅ Fallback dummy object if none found
        const paymentData =
          payment ||
          payment2 ||
          ({
            _id: null,
            amount: order.amount,
            status: order.paymentStatus || "PENDING",
            razorpayPaymentId: order.razorpayPaymentId || "N/A",
            razorpayOrderId: order.razorpayOrderId || "N/A",
          });

        // ✅ Prepare safe items
        const items = (order.items || []).map((item) => ({
          ...item,
          image:
            item.image ||
            order.productImage ||
            "https://placehold.co/600x600?text=No+Image",
        }));

        // ✅ Combined result
        return {
          _id: order._id,
          order_id: order.order_id,
          razorpayOrderId:
            paymentData.razorpayOrderId || order.razorpayOrderId || "N/A",
          razorpayPaymentId:
            paymentData.razorpayPaymentId || order.razorpayPaymentId || "N/A",
          amount: paymentData.amount || order.amount,
          paymentStatus:
            (paymentData.status || order.paymentStatus || "PENDING").toUpperCase(),
          deliveryStatus: order.deliveryStatus || "Order Placed",
          createdAt: order.createdAt,
          userId: order.userId,
          address: order.address || {},
          items,
          paymentRef: order.paymentRef || paymentData._id || null,

          // 🟢 Include both payment objects for debugging / tracking
          payment: payment || null,
          payment2: payment2 || null,
        };
      })
    );

    return res.json({
      success: true,
      count: result.length,
      orders: result,
    });
  } catch (err) {
    console.error("[getMyOrders] error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

// export const paymentRecoard = async (req, res) => {
//   try {
//     const paymentRecords = await PaymentRecord.find({}).lean();
//     res.json({ success: true, paymentRecords });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// }

// export const getOrdersFromPaymentRecord = async (req, res) => {
//   try {
//     // support "me" or passing userId param; prefer authenticated user if available
//     const paramUserId = req.params.userId;
//     const userId = req.user?.id || (paramUserId === "me" ? null : paramUserId);

//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized - missing user id" });
//     }

//     // ensure valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(String(userId))) {
//       return res.status(400).json({ success: false, message: "Invalid userId" });
//     }

//     // Query PaymentRecord for the user and return full docs.
//     // We populate auction (select a few fields) and user (name,email) to give more context.
//     const records = await PaymentRecord.find({ user: userId })
//       .sort({ createdAt: -1 })
//       .populate({ path: "auction", select: "title productName image" })
//       .populate({ path: "user", select: "name email" })
//       .lean()
//       .exec();

//     // If nothing found, return empty array (success)
//     if (!records || records.length === 0) {
//       return res.json({ success: true, count: 0, records: [] });
//     }

//     // Normalize and present a friendly shape while preserving raw providerResponse
//     const out = records.map((r) => ({
//       _id: r._id,
//       order_id: r.order_id || r.paymentRef || null,
//       user: r.user || null,
//       auction: r.auction || r.auctionId || null,
//       amountPaise: Number(r.amountPaise || 0),
//       amountRupees: Number(((Number(r.amountPaise || 0) / 100) || 0).toFixed(2)),
//       currency: r.currency || "INR",
//       status: r.status,
//       razorpayOrderId: r.razorpayOrderId || null,
//       razorpayPaymentId: r.razorpayPaymentId || null,
//       razorpaySignature: r.razorpaySignature || null,
//       paymentRef: r.paymentRef || null,
//       paymentLinkUrl: r.paymentLinkUrl || (r.providerResponse && (r.providerResponse.short_url || r.providerResponse.data?.short_url)) || null,
//       items: r.items || [],
//       depositPercent: r.depositPercent ?? null,
//       depositPaise: Number(r.depositPaise || 0),
//       depositRupees: Number(((Number(r.depositPaise || 0) / 100) || 0).toFixed(2)),
//       depositAmountPaise: r.depositAmountPaise ?? null,
//       amountDuePaise: Number(r.amountDuePaise || 0),
//       amountDueRupees: Number(((Number(r.amountDuePaise || 0) / 100) || 0).toFixed(2)),
//       providerResponse: r.providerResponse || null, // raw provider response (can be large)
//       receipt: r.receipt || null,
//       address: r.address || {},
//       mobile: r.mobile || "",
//       createdAt: r.createdAt,
//       updatedAt: r.updatedAt,
//       raw: r, // include entire raw doc if you need it on frontend (optional)
//     }));

//     return res.json({ success: true, count: out.length, records: out });
//   } catch (err) {
//     console.error("[getOrdersFromPaymentRecord] error:", err);
//     return res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };

export const paymentRecords = async (req, res) => {
  try {
    // 1. All orders
    const orders = await PaymentRecord.find({}).lean();

    // 2. All related payment records
    const paymentRecords = await PaymentRecord.find({
      order_id: { $in: orders.map(o => o.order_id) },
    })
      .populate("user", "name email mobile")
      .populate("auction", "title productName image")
      .lean();

    // 3. Map paymentRecord by order_id
    const paymentMap = {};
    paymentRecords.forEach(p => {
      paymentMap[p.order_id] = p;
    });

    // 4. Merge data
    const mergedOrders = orders.map(order => {
      const payment = paymentMap[order.order_id] || null;

      return {
        ...order,

        paymentRecord: payment
          ? {
              ...payment,
              amountRupees: payment.amountPaise / 100,
              depositRupees: payment.depositPaise / 100,
              amountDueRupees: payment.amountDuePaise / 100,
            }
          : null,
      };
    });

    return res.json({
      success: true,
      count: mergedOrders.length,
      orders: mergedOrders,
    });
  } catch (error) {
    console.error("[paymentRecords] error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getOrdersFromPaymentRecord = async (req, res) => {
  try {
    /**
     * 1. Resolve userId
     * Priority:
     *  - Authenticated user (req.user.id)
     *  - /me
     *  - /:userId
     */
    let userId = null;

    if (req.user?.id) {
      userId = req.user.id;
    } else if (req.params.userId && req.params.userId !== "me") {
      userId = req.params.userId;
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID not found",
      });
    }

    // 2. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    /**
     * 3. Fetch payment records
     */
    const records = await PaymentRecord.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "auction",
        select: "title productName image startingPrice endTime",
      })
      .populate({
        path: "user",
        select: "name email mobile",
      })
      .lean();

    // 4. No records → empty success response
    if (!records.length) {
      return res.json({
        success: true,
        count: 0,
        records: [],
      });
    }

    /**
     * 5. Normalize response (FULL DATA)
     */
    const formattedRecords = records.map((r) => ({
      _id: r._id,

      // User & Auction
      user: r.user,
      auction: r.auction,

      // Order / Payment IDs
      order_id: r.order_id || r.paymentRef || null,
      razorpayOrderId: r.razorpayOrderId || null,
      razorpayPaymentId: r.razorpayPaymentId || null,
      razorpaySignature: r.razorpaySignature || null,

      // Amounts
      currency: r.currency || "INR",

      amountPaise: Number(r.amountPaise || 0),
      amountRupees: Number((r.amountPaise / 100).toFixed(2)),

      depositPercent: r.depositPercent ?? null,
      depositPaise: Number(r.depositPaise || 0),
      depositRupees: Number((r.depositPaise / 100).toFixed(2)),

      amountDuePaise: Number(r.amountDuePaise || 0),
      amountDueRupees: Number((r.amountDuePaise / 100).toFixed(2)),

      // Status & Meta
      status: r.status,
      receipt: r.receipt || null,
      items: r.items || [],

      // Contact / Address
      mobile: r.mobile || "",
      address: r.address || {},

      // Razorpay / Provider data
      paymentRef: r.paymentRef || null,
      paymentLinkUrl:
        r.paymentLinkUrl ||
        r.providerResponse?.short_url ||
        r.providerResponse?.data?.short_url ||
        null,

      providerResponse: r.providerResponse || null, // FULL RAW RESPONSE

      // Timestamps
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    return res.json({
      success: true,
      count: formattedRecords.length,
      records: formattedRecords,
    });
  } catch (error) {
    console.error("[getOrdersFromPaymentRecord]", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};






export const saveOrderAddress = async (req, res) => {
  try {
    const { order_id, fullName, mobile, address } = req.body;

    if (!order_id || !fullName || !mobile || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ✅ Find by custom order_id, not _id
    const order = await Order.findOneAndUpdate(
      { order_id },
      {
        $set: {
          address: { fullName, mobile, line: address },
          paymentStatus: "PENDING",
        },
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // ✅ Generate Razorpay order
    const payment = await generatePaymentLink({
      amount: order.amount,
      auctionId: order.auctionId.toString(),
      userId: order.userId.toString(),
      productName: order.productName,
      productImage: order.auctionImage,
      userName: fullName,
      userEmail: order.winnerEmail,
      address,
      mobile,
    });

    if (!payment.success) return res.status(500).json({ success: false, message: payment.error });

    // ✅ Send email (optional)
    await sendAuctionWinEmail(order.winnerEmail, fullName, order.productName, order.amount, payment.checkoutUrl);

    return res.json({ success: true, message: "Address saved & payment link generated", checkoutUrl: payment.checkoutUrl });
  } catch (err) {
    console.error("saveOrderAddress error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};







export { placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus };
