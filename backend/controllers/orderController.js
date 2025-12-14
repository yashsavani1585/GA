// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from 'stripe'
//global variables
// const currency = 'inr'
// const deliveryCharge = 10
//gateway initialized
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing orders using COD method
// const placeOrder = async (req,res) => {
//     try {
//         const {userId, items, amount, address} = req.body;

//         const orderData = {
//             userId,
//             items,
//             address,
//             amount,
//             paymentMethod:"COD",
//             payment:false,
//             date: Date.now()
//         }

//         const newOrder = new orderModel(orderData)
//         await newOrder.save()

//         await userModel.findByIdAndUpdate(userId, {cartData:{}})

//         res.json({success:true, message:"Order Placed"})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message})

//     }
// }

// Placing orders using Stripe method
// const placeOrderStripe = async (req,res) => {
//     try {

//         const {userId, items, amount, address} = req.body;
//         const {origin} = req.headers;

//         const orderData = {
//             userId,
//             items,
//             address,
//             amount,
//             paymentMethod:"Stripe",
//             payment:false,
//             date: Date.now()
//         }

//         const newOrder = new orderModel(orderData)
//         await newOrder.save()

//         const line_items = items.map((item)=>({
//             price_data:{
//                 currency:currency,
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount: item.price * 100
//             },
//             quantity: item.quantity
//         }))

//         line_items.push({
//             price_data:{
//                 currency:currency,
//                 product_data:{
//                     name:'Delivery Charges'
//                 },
//                 unit_amount: deliveryCharge * 100
//             },
//             quantity: 1
//         })

//         const session = await stripe.checkout.sessions.create({
//             success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
//             line_items,
//             mode:'payment',
//         })

//         res.json({success:true, session_url:session.url})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message})
//     }
// }

// Verify Stripe
// const verifyStripe = async(req,res) => {

//     const {orderId, success, userId} = req.body

//     try {
//         if (success === "true") {
//             await orderModel.findById(orderId, {payment:true});
//             await userModel.findByIdAndUpdate(userId, {cartData:{}})
//             res.json({success:true});

//         }
//         else{
//             await orderModel.findOneAndDelete(orderId)
//             res.json({success:false})
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message})
//     }
// }

// Placing orders using Razorpay method
// const placeOrderRazorpay = async (req,res) => {

// }

// // All Orders data for admin panel
// const allOrders = async (req,res) => {
//     try {
//         const orders = await orderModel.find({})
//         res.json({success:true, orders})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message})
//     }
// }

// // User Orders data for Frontend
// const userOrders = async (req,res) => {
//     try {

//         const {userId} = req.body
//         const orders = await orderModel.find({userId})
//         res.json({success:true, orders})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message})
//     }
// }

// // update order status from AdminPanel
// const updateStatus = async (req,res) => {
//     try {
//         const {orderId, status} = req.body
//         await orderModel.findByIdAndUpdate(orderId, {status})
//         res.json({success:true, message:'Status Updated'})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message})
//     }
// }

// export {placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus}

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

 const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).lean();

    const formattedOrders = orders.map((o) => ({
      ...o,
      isCanceled: o.isCanceled,
      isRefunded: o.isRefunded,
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error("[allOrders] error:", error);
    res.json({ success: false, message: error.message });
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






// export const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.params.userId;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     // Fetch all successful payments for this user
//     const payments = await Payment.find({ userId, status: "SUCCESS" })
//       .sort({ createdAt: -1 })
//       .lean();

//     const orders = await Promise.all(
//       payments.map(async (payment) => {
//         // Fetch the corresponding order from orderModel using paymentId
//         const order = await orderModel.findOne({ paymentId: payment._id.toString() }).lean();

//         if (!order) {
//           console.warn(`Order not found for paymentId: ${payment._id}`);
//           return null; // Skip if no matching order found
//         }

//         // Map cart items with images
//         const items = await Promise.all(
//           Object.entries(payment.cartData || {}).map(async ([productId, productDetails]) => {
//             let image = "https://placehold.co/600x600?text=No+Image";

//             try {
//               const product = await Product.findById(productId).select("image thumbnail").lean();
//               if (product) {
//                 image = (Array.isArray(product.image) && product.image[0]) || product.thumbnail || image;
//               }
//             } catch {}

//             return {
//               productId,
//               ...productDetails.gold,
//               image,
//             };
//           })
//         );

//         return {
//           _id: order._id,           // MongoDB _id of the order
//           order_id: order.order_id, // UUID generated after payment (THIS IS THE CORRECT ORDER ID)
//           amount: payment.amount,
//           paymentStatus: payment.status,
//           deliveryStatus: order.status || "Processing",
//           createdAt: order.createdAt,
//           userId: payment.userId,
//           address: order.address || {},
//           items,
//         };
//       })
//     );

//     // Filter out nulls if some payments did not have matching orders
//     const filteredOrders = orders.filter((o) => o !== null);

//     res.json({ success: true, count: filteredOrders.length, orders: filteredOrders });
//   } catch (err) {
//     console.error("[getMyOrders] error:", err);
//     res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };

// export const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.params.userId;
//     if (!userId)
//       return res.status(401).json({ success: false, message: "Unauthorized" });

//     // Fetch all successful payments for this user
//     const payments = await Payment.find({ userId, status: "SUCCESS" })
//       .sort({ createdAt: -1 })
//       .lean();

//     const orders = await Promise.all(
//       payments.map(async (payment) => {
//         // Find order using Razorpay payment ID (consistent with verifyPayment)
//         const order = await Order.findOne({
//           $or: [
//             { order_id: payment.order_id },
//             { paymentId: payment.paymentId },
//             { paymentRef: payment._id }
//           ]
//         }).lean();

//          if (!order) {
//           console.warn(`Order not found for paymentId/order_id: ${payment.paymentId || payment.order_id}`);
//           return null;
//         }

//         // Map cart items with images
//         const items = await Promise.all(
//           Object.entries(payment.cartData || {}).map(async ([productId, productDetails]) => {
//             let image = "https://placehold.co/600x600?text=No+Image";
//             try {
//               const product = await Product.findById(productId)
//                 .select("image thumbnail")
//                 .lean();
//               if (product) {
//                 image =
//                   (Array.isArray(product.image) && product.image[0]) ||
//                   product.thumbnail ||
//                   image;
//               }
//             } catch { }

//             return {
//               productId,
//               ...productDetails.gold,
//               image,
//             };
//           })
//         );

//         return {
//           _id: order._id,
//           order_id: order.order_id,
//           amount: payment.amount,
//           paymentStatus: payment.status,
//           deliveryStatus: order.status || "Processing",
//           createdAt: order.createdAt,
//           userId: payment.userId,
//           address: order.address || {},
//           items,
//         };
//       })
//     );

//     const filteredOrders = orders.filter((o) => o !== null);

//     res.json({ success: true, count: filteredOrders.length, orders: filteredOrders });
//   } catch (err) {
//     console.error("[getMyOrders] error:", err);
//     res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };





// export const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.params.userId;
//     if (!userId)
//       return res.status(401).json({ success: false, message: "Unauthorized" });

//     const orders = await Order.find({ userId })
//       .sort({ createdAt: -1 })
//       .lean();

//     const result = await Promise.all(
//       orders.map(async (order) => {
//         let payment = null;

//         // Preferred: paymentRef
//         if (order.paymentRef) {
//           payment = await Payment.findById(order.paymentRef).lean();
//         }

//         // Fallback: razorpayPaymentId or order_id
//         if (!payment) {
//           payment = await Payment.findOne({
//             $or: [
//               { razorpayPaymentId: order.razorpayPaymentId || order.order_id },
//               { razorpayPaymentId: Payment.razorpayPaymentId || order.razorpayPaymentId },
//               { order_id: order.order_id },
//             ],
//           }).lean();
//         }

//         // If no payment found, set default
//         if (!payment) {
//           console.warn(`[getMyOrders] Payment not found for order: ${order._id}`);
//           return {
//             ...order,
//             amount: 0,
//             paymentStatus: "PENDING",
//             deliveryStatus: order.status || "Processing",
//             items: order.items || [],
//             paymentRef: null,
//           };
//         }

//         // Map items with images
//         const items = await Promise.all(
//           (order.items || []).map(async (item) => {
//             let image = "https://placehold.co/600x600?text=No+Image";
//             if (item.productId) {
//               try {
//                 const product = await Product.findById(item.productId)
//                   .select("image thumbnail")
//                   .lean();
//                 if (product) {
//                   image =
//                     (Array.isArray(product.image) && product.image[0]) ||
//                     product.thumbnail ||
//                     image;
//                 }
//               } catch (err) {
//                 console.warn("[getMyOrders] Product fetch error:", err.message);
//               }
//             }
//             return {
//               ...item,
//               image,
//             };
//           })
//         );

//         return {
//           _id: order._id,
//           order_id: order.order_id,
//           amount: payment.amount,
//           paymentStatus: payment.status,
//           deliveryStatus: order.status || "Processing",
//           createdAt: order.createdAt,
//           userId: order.userId,
//           address: order.address || {},
//           items,
//           paymentRef: payment._id, // <-- ensures frontend gets correct payment_id
//         };
//       })
//     );

//     res.json({
//       success: true,
//       count: result.length,
//       orders: result,
//     });
//   } catch (err) {
//     console.error("[getMyOrders] error:", err);
//     res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };

// export const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.params.userId;

//     if (!userId)
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized: Missing userId" });

//     // ✅ Fetch all orders for this user
//     const orders = await Order.find({ userId })
//       .sort({ createdAt: -1 })
//       .lean();

//     if (!orders.length) {
//       return res.json({ success: true, count: 0, orders: [] });
//     }

//     // ✅ Prepare orders with linked payment info
//     const result = await Promise.all(
//       orders.map(async (order) => {
//         let payment = null;

//         // ✅ 1. Find payment by reference stored in order (if available)
//         if (order.paymentRef && mongoose.Types.ObjectId.isValid(order.paymentRef)) {
//           payment = await Payment2.findById(order.paymentRef).lean();
//         }

//         // ✅ 2. Fallback: find payment using other identifiers
//         if (!payment) {
//           payment = await Payment2.findOne({
//             $or: [
//               { razorpayPaymentId: order.razorpayPaymentId },
//               { razorpayOrderId: order.razorpayOrderId },
//               { order_id: order.order_id },
//             ],
//           }).lean();
//         }

//         // ✅ 3. If still not found, return a mock PENDING payment
//         if (!payment) {
//           payment = {
//             _id: null,
//             amount: order.amount || order.winnerBidAmount || 0,
//             status: "PENDING",
//             razorpayPaymentId: "N/A",
//             razorpayOrderId: order.razorpayOrderId || "N/A",
//           };
//         }

//         // ✅ Normalize item images
//         const items = (order.items || []).map((item) => ({
//           ...item,
//           image:
//             item.image ||
//             order.productImage ||
//             order.auctionImage ||
//             "https://placehold.co/600x600?text=No+Image",
//         }));

//         // ✅ Final formatted object sent to frontend
//         return {
//           _id: order._id,
//           order_id: order.order_id || order._id.toString(),
//           razorpayOrderId: payment.razorpayOrderId,
//           razorpayPaymentId: payment.razorpayPaymentId,
//           amount: payment.amount,
//           paymentStatus: payment.status?.toUpperCase() || "PENDING",
//           deliveryStatus:
//             order.status ||
//             order.deliveryStatus ||
//             "Order Placed",
//           createdAt: order.createdAt,
//           userId: order.userId,
//           address: order.address || {},
//           items,
//           paymentRef: payment._id,
//         };
//       })
//     );

//     // ✅ Send response
//     res.json({
//       success: true,
//       count: result.length,
//       orders: result,
//     });
//   } catch (err) {
//     console.error("[getMyOrders] error:", err);
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error: " + err.message });
//   }
// };

// export const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.params.userId;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: Missing userId",
//       });
//     }

//     // ✅ Fetch orders for this user
//     const orders = await Order.find({ userId })
//       .sort({ createdAt: -1 })
//       .lean();

//     if (!orders || orders.length === 0) {
//       return res.json({
//         success: true,
//         count: 0,
//         orders: [],
//       });
//     }

//     // ✅ Combine order + payment info
//     const result = await Promise.all(
//       orders.map(async (order) => {
//         let payment = null;

//         // ✅ Step 1: Try to find by stored reference
//         if (order.paymentRef && mongoose.Types.ObjectId.isValid(order.paymentRef)) {
//           payment = await Payment2.findById(order.paymentRef).lean();
//         }

//         // ✅ Step 2: Fallback search by known fields
//         if (!payment) {
//           payment = await Payment2.findOne({
//             $or: [
//               { razorpayPaymentId: order.razorpayPaymentId },
//               { razorpayOrderId: order.razorpayOrderId },
//               { order_id: order.order_id },
//             ],
//           }).lean();
//         }

//         // ✅ Step 3: Create a safe fallback if not found
//         if (!payment) {
//           payment = {
//             _id: null,
//             amount: order.amount || order.winnerBidAmount || 0,
//             status: "PENDING",
//             razorpayPaymentId: "N/A",
//             razorpayOrderId: order.razorpayOrderId || "N/A",
//           };
//         }

//         // ✅ Step 4: Normalize item images
//         const items = (order.items || []).map((item) => ({
//           ...item,
//           image:
//             item.image ||
//             order.productImage ||
//             order.auctionImage ||
//             "https://placehold.co/600x600?text=No+Image",
//         }));

//         // ✅ Step 5: Return clean formatted response
//         return {
//           _id: order._id,
//           order_id: order.order_id || order._id.toString(),
//           razorpayOrderId: payment.razorpayOrderId,
//           razorpayPaymentId: payment.razorpayPaymentId,
//           amount: payment.amount,
//           paymentStatus: payment.status?.toUpperCase() || "PENDING",
//           deliveryStatus:
//             order.status ||
//             order.deliveryStatus ||
//             "Order Placed",
//           createdAt: order.createdAt,
//           userId: order.userId,
//           address: order.address || {},
//           items,
//           paymentRef: payment._id,
//         };
//       })
//     );

//     // ✅ Send final response
//     return res.json({
//       success: true,
//       count: result.length,
//       orders: result,
//     });
//   } catch (err) {
//     console.error("[getMyOrders] error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error: " + err.message,
//     });
//   }
// };


// export const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.params.userId;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: Missing userId",
//       });
//     }

//     const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

//     if (!orders.length) {
//       return res.json({ success: true, count: 0, orders: [] });
//     }

//     const result = await Promise.all(
//       orders.map(async (order) => {
//         let payment = null;

//         // ✅ Try direct reference first
//         if (order.paymentRef && mongoose.Types.ObjectId.isValid(order.paymentRef)) {
//           payment = await Payment2.findById(order.paymentRef).lean();
//         }

//         // ✅ Fallback find
//         if (!payment) {
//           payment = await Payment2.findOne({
//             $or: [
//               { razorpayPaymentId: order.razorpayPaymentId },
//               { razorpayOrderId: order.razorpayOrderId },
//               { order_id: order.order_id },
//             ],
//           }).lean();
//         }

//         if (!payment) {
//           payment = {
//             _id: null,
//             amount: order.amount,
//             status: order.paymentStatus || "PENDING",
//             razorpayPaymentId: "N/A",
//             razorpayOrderId: order.razorpayOrderId || "N/A",
//           };
//         }

//         return {
//           _id: order._id,
//           order_id: order.order_id,
//           razorpayOrderId: payment.razorpayOrderId,
//           razorpayPaymentId: payment.razorpayPaymentId,
//           amount: payment.amount,
//           paymentStatus: payment.status?.toUpperCase() || "PENDING",
//           deliveryStatus: order.deliveryStatus,
//           createdAt: order.createdAt,
//           userId: order.userId,
//           address: order.address || {},
//           items: order.items || [],
//           paymentRef: payment._id,
//         };
//       })
//     );

//     res.json({
//       success: true,
//       count: result.length,
//       orders: result,
//     });
//   } catch (err) {
//     console.error("[getMyOrders] error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.params.userId;
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

//     if (!orders || orders.length === 0) return res.json({ success: true, count: 0, orders: [] });

//     const result = await Promise.all(orders.map(async (order) => {
//       // prefer direct paymentRef -> Payment
//       let payment = null;
//       if (order.paymentRef && mongoose.Types.ObjectId.isValid(order.paymentRef)) {
//         payment = await Payment.findById(order.paymentRef).lean();
//       }

//       // fallback find by razorpay ids
//       if (!payment) {
//         payment = await Payment.findOne({
//           $or: [
//             { razorpayPaymentId: order.razorpayPaymentId },
//             { razorpayOrderId: order.razorpayOrderId },
//             { order_id: order.order_id },
//           ],
//         }).lean();
//       }

//       if (!payment) {
//         payment = { _id: null, amount: order.amount, status: order.paymentStatus || "PENDING", razorpayPaymentId: order.razorpayPaymentId || "N/A", razorpayOrderId: order.razorpayOrderId || "N/A" };
//       }

//       const items = (order.items || []).map(item => ({ ...item, image: item.image || order.productImage || "https://placehold.co/600x600?text=No+Image" }));

//       return {
//         _id: order._id,
//         order_id: order.order_id,
//         razorpayOrderId: payment.razorpayOrderId || order.razorpayOrderId,
//         razorpayPaymentId: payment.razorpayPaymentId || order.razorpayPaymentId || "N/A",
//         amount: payment.amount,
//         paymentStatus: (payment.status || order.paymentStatus || "PENDING").toUpperCase(),
//         deliveryStatus: order.deliveryStatus || "Order Placed",
//         createdAt: order.createdAt,
//         userId: order.userId,
//         address: order.address || {},
//         items,
//         paymentRef: payment._id || null,
//       };
//     }));

//     return res.json({ success: true, count: result.length, orders: result });
//   } catch (err) {
//     console.error("[getMyOrders] error:", err);
//     return res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };

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

export const getOrdersFromPaymentRecord = async (req, res) => {
  try {
    // support "me" or passing userId param; prefer authenticated user if available
    const paramUserId = req.params.userId;
    const userId = req.user?.id || (paramUserId === "me" ? null : paramUserId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - missing user id" });
    }

    // ensure valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(String(userId))) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    // Query PaymentRecord for the user and return full docs.
    // We populate auction (select a few fields) and user (name,email) to give more context.
    const records = await PaymentRecord.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "auction", select: "title productName image" })
      .populate({ path: "user", select: "name email" })
      .lean()
      .exec();

    // If nothing found, return empty array (success)
    if (!records || records.length === 0) {
      return res.json({ success: true, count: 0, records: [] });
    }

    // Normalize and present a friendly shape while preserving raw providerResponse
    const out = records.map((r) => ({
      _id: r._id,
      order_id: r.order_id || r.paymentRef || null,
      user: r.user || null,
      auction: r.auction || r.auctionId || null,
      amountPaise: Number(r.amountPaise || 0),
      amountRupees: Number(((Number(r.amountPaise || 0) / 100) || 0).toFixed(2)),
      currency: r.currency || "INR",
      status: r.status,
      razorpayOrderId: r.razorpayOrderId || null,
      razorpayPaymentId: r.razorpayPaymentId || null,
      razorpaySignature: r.razorpaySignature || null,
      paymentRef: r.paymentRef || null,
      paymentLinkUrl: r.paymentLinkUrl || (r.providerResponse && (r.providerResponse.short_url || r.providerResponse.data?.short_url)) || null,
      items: r.items || [],
      depositPercent: r.depositPercent ?? null,
      depositPaise: Number(r.depositPaise || 0),
      depositRupees: Number(((Number(r.depositPaise || 0) / 100) || 0).toFixed(2)),
      depositAmountPaise: r.depositAmountPaise ?? null,
      amountDuePaise: Number(r.amountDuePaise || 0),
      amountDueRupees: Number(((Number(r.amountDuePaise || 0) / 100) || 0).toFixed(2)),
      providerResponse: r.providerResponse || null, // raw provider response (can be large)
      receipt: r.receipt || null,
      address: r.address || {},
      mobile: r.mobile || "",
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      raw: r, // include entire raw doc if you need it on frontend (optional)
    }));

    return res.json({ success: true, count: out.length, records: out });
  } catch (err) {
    console.error("[getOrdersFromPaymentRecord] error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
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
