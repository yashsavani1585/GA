// // import axios from "axios";
// // import userModel from "../models/userModel.js";
// // import Order from "../models/orderModel.js";
// // import { Payment } from "../models/paymentModel.js";
// // import { getPayoneerToken } from "../middleware/payoneerAuth.js";

// // const PAYONEER_BASE = "https://api.sandbox.payoneer.com/v4/programs";
// // const PAYONEER_PROGRAM_ID = process.env.PAYONEER_PROGRAM_ID;
// // const PAYONEER_FAKE_TOKEN = process.env.PAYONEER_FAKE_TOKEN;

// // // ✅ Create Payment Controller
// // export async function createPayment(req, res) {
// //   try {
// //     const userId = req.user.id; // from auth middleware
// //     const {
// //       email,
// //       mobileNumber,
// //       whatsappOptIn,
// //       whatsappNumber,
// //       deliveryType,
// //       recipientName,
// //       recipientMobile,
// //       pincode,
// //       houseNo,
// //       street,
// //       locality,
// //       landmark,
// //       gstNumber
// //     } = req.body;

// //     // Normalize deliveryType to enum
// //     const formattedDeliveryType =
// //       deliveryType?.toLowerCase() === "home" ? "Home Delivery" : "Store Pickup";

// //     // 1️⃣ Fetch user and cart
// //     const user = await userModel.findById(userId);
// //     if (!user) return res.status(404).json({ success: false, message: "User not found" });

// //     // ⚠️ Handle empty cart gracefully for testing
// //      if (!user.cartData || Object.keys(user.cartData).length === 0) {
// //       return res.status(400).json({ success: false, message: "Cart is empty" });
// //     }

// //     // 2️⃣ Calculate total amount
// //     let amount = 0;
// //     const items = [];
// //     for (const key in user.cartData) {
// //       const item = user.cartData[key];
// //       if (item.gold && item.gold.pricing) {
// //         const pricing = JSON.parse(item.gold.pricing);
// //         amount += pricing.finalPrice * item.gold.quantity;
// //         items.push(item);
// //       }
// //     }

// //     // 3️⃣ Create payment
// //     const payment = await Payment.create({
// //       email,
// //       mobileNumber,
// //       whatsappOptIn,
// //       whatsappNumber,
// //       deliveryType: formattedDeliveryType,
// //       recipientName,
// //       recipientMobile: recipientMobile || mobileNumber,
// //       pincode,
// //       houseNo,
// //       street,
// //       locality,
// //       landmark: landmark || "",
// //       gstNumber: gstNumber || "",
// //       cartData: user.cartData,
// //       amount,
// //       status: "PENDING"
// //     });

// //     const token = await getPayoneerToken();


// //     // 4️⃣ Payoneer fake/real API
// //     let payRes;
// //     if (PAYONEER_FAKE_TOKEN) {
// //       // Fake payment (sandbox)
// //       payRes = { data: { payment_id: "FAKE_PAY_" + Date.now(), status: "SUCCESS" } };
// //     } else {
// //       const token = await getPayoneerToken();
// //       payRes = await axios.post(
// //         `${PAYONEER_BASE}/${PAYONEER_PROGRAM_ID}/payments`,
// //         { payee_id: email, amount, currency: "INR", description: `Cart Payment #${payment._id}`,
// //             return_url: `${process.env.FRONTEND_URL}/payment-success`,
// //         cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,

// //          },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       const hostedUrl = checkoutRes.data.checkout_url || checkoutRes.data.url;

// //     res.json({ success: true, url: hostedUrl, paymentId: payment._id });

// //     }

// //     // 5️⃣ Update payment
// //     payment.paymentId = payRes.data.payment_id;
// //     payment.status = payRes.data.status === "SUCCESS" ? "SUCCESS" : "FAILED";
// //     payment.providerResponse = payRes.data;
// //     await payment.save();

// //     if (payment.status === "SUCCESS") {
// //       // 6️⃣ Create order
// //       const order = await Order.create({
// //         userId,
// //         items,
// //         amount: payment.amount,
// //         address: {
// //           deliveryType: formattedDeliveryType,
// //           recipientName,
// //           recipientMobile: recipientMobile || mobileNumber,
// //           pincode,
// //           houseNo,
// //           street,
// //           locality,
// //           landmark: landmark || "",
// //           gstNumber: gstNumber || "",
// //         },
// //         status: "Order Placed",
// //         paymentMethod: "Payoneer",
// //         payment: true,
// //         paymentId: payment._id,
// //       });

// //       // 7️⃣ Clear user cart
// //       user.cartData = {};
// //       await user.save();

// //       return res.json({ success: true, payment, order });
// //     }

// //     // Payment failed
// //     res.status(400).json({ success: false, payment, message: "Payment failed" });

// //   } catch (err) {
// //     console.error("[createPayment] error:", err.message);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // }

// // import axios from "axios";
// // import userModel from "../models/userModel.js";
// // import Order from "../models/orderModel.js";
// // import { Payment } from "../models/paymentModel.js";
// // import { getPayoneerToken } from "../middleware/payoneerAuth.js";

// // const PAYONEER_BASE = "https://api.sandbox.payoneer.com/v4/programs";
// // const PAYONEER_PROGRAM_ID = process.env.PAYONEER_PROGRAM_ID;
// // const PAYONEER_FAKE_TOKEN = process.env.PAYONEER_FAKE_TOKEN;

// // // ✅ Create Payment Controller
// // export async function createPayment(req, res) {
// //   try {
// //     const userId = req.user.id; // from auth middleware
// //     const {
// //       email,
// //       mobileNumber,
// //       whatsappOptIn,
// //       whatsappNumber,
// //       deliveryType,
// //       recipientName,
// //       recipientMobile,
// //       pincode,
// //       houseNo,
// //       street,
// //       locality,
// //       landmark,
// //       gstNumber
// //     } = req.body;

// //     // Normalize deliveryType
// //     const formattedDeliveryType =
// //       deliveryType?.toLowerCase() === "home" ? "Home Delivery" : "Store Pickup";

// //     // 1️⃣ Fetch user and cart data
// //     const user = await userModel.findById(userId);
// //     if (!user) {
// //       return res.status(404).json({ success: false, message: "User not found" });
// //     }

// //     if (!user.cartData || Object.keys(user.cartData).length === 0) {
// //       return res.status(400).json({ success: false, message: "Cart is empty" });
// //     }

// //     // 2️⃣ Calculate total amount from cart safely
// //     let amount = 0;
// //     const items = [];

// //     for (const key of Object.keys(user.cartData)) {
// //       const item = user.cartData[key];

// //       if (!item || !item.gold || !item.gold.pricing) continue;

// //       // Parse pricing (can be JSON string or object)
// //       let pricing = {};
// //       try {
// //         pricing =
// //           typeof item.gold.pricing === "string"
// //             ? JSON.parse(item.gold.pricing)
// //             : item.gold.pricing;
// //       } catch (err) {
// //         console.error("❌ Pricing parse error:", item.gold.pricing);
// //         continue;
// //       }

// //       const quantity = Number(item.gold.quantity) || 1;
// //       const price = Number(pricing.finalPrice) || 0;

// //       if (price > 0 && quantity > 0) {
// //         amount += price * quantity;
// //         items.push({
// //           name: item.name || "Unnamed Product",
// //           quantity,
// //           price
// //         });
// //       }
// //     }

// //     if (items.length === 0 || amount <= 0) {
// //       return res
// //         .status(400)
// //         .json({ success: false, message: "Cart total invalid" });
// //     }

// //     // 3️⃣ Create payment entry in DB
// //     const payment = await Payment.create({
// //       email,
// //       mobileNumber,
// //       whatsappOptIn,
// //       whatsappNumber,
// //       deliveryType: formattedDeliveryType,
// //       recipientName,
// //       recipientMobile: recipientMobile || mobileNumber,
// //       pincode,
// //       houseNo,
// //       street,
// //       locality,
// //       landmark: landmark || "",
// //       gstNumber: gstNumber || "",
// //       cartData: user.cartData,
// //       amount,
// //       status: "PENDING"
// //     });

// //     // 4️⃣ Payoneer Payment API Call (sandbox / real)
// //     let payRes, hostedUrl;
// //     if (PAYONEER_FAKE_TOKEN) {
// //       // Fake testing flow
// //       payRes = {
// //         data: {
// //           payment_id: "FAKE_PAY_" + Date.now(),
// //           status: "PENDING",
// //           checkout_url: `${process.env.FRONTEND_URL}/fake-checkout`
// //         }
// //       };
// //       hostedUrl = payRes.data.checkout_url;
// //     } else {
// //       const token = await getPayoneerToken();

// //       const checkoutRes = await axios.post(
// //         `${PAYONEER_BASE}/${PAYONEER_PROGRAM_ID}/payments`,
// //         {
// //           payee_id: email,
// //           amount,
// //           currency: "INR",
// //           description: `Cart Payment #${payment._id}`,
// //           return_url: `${process.env.FRONTEND_URL}/payment-success`,
// //           cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`
// //         },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       payRes = checkoutRes;
// //       hostedUrl = checkoutRes.data.checkout_url || checkoutRes.data.url;
// //     }

// //     // 5️⃣ Update payment entry
// //     payment.paymentId = payRes.data.payment_id;
// //     payment.status = payRes.data.status === "SUCCESS" ? "SUCCESS" : "PENDING";
// //     payment.providerResponse = payRes.data;
// //     await payment.save();

// //     // 6️⃣ If already successful, create order
// //     if (payment.status === "SUCCESS") {
// //       const order = await Order.create({
// //         userId,
// //         items,
// //         amount: payment.amount,
// //         address: {
// //           deliveryType: formattedDeliveryType,
// //           recipientName,
// //           recipientMobile: recipientMobile || mobileNumber,
// //           pincode,
// //           houseNo,
// //           street,
// //           locality,
// //           landmark: landmark || "",
// //           gstNumber: gstNumber || ""
// //         },
// //         status: "Order Placed",
// //         paymentMethod: "Payoneer",
// //         payment: true,
// //         paymentId: payment._id
// //       });

// //       // clear user cart
// //       user.cartData = {};
// //       await user.save();

// //       return res.json({
// //         success: true,
// //         message: "Payment Success",
// //         payment,
// //         order
// //       });
// //     }

// //     // 7️⃣ Otherwise return checkout url for frontend redirection
// //     return res.json({
// //       success: true,
// //       url: hostedUrl,
// //       paymentId: payment._id,
// //       message: "Redirect to Payoneer Checkout"
// //     });
// //   } catch (err) {
// //     console.error("[createPayment] error:", err.response?.data || err.message);
// //     res
// //       .status(500)
// //       .json({ success: false, message: err.response?.data || err.message });
// //   }
// // }

// import axios from "axios";
// import userModel from "../models/userModel.js";
// import Order from "../models/orderModel.js";
// import { Payment } from "../models/paymentModel.js";
// import Razorpay from "razorpay";
// import crypto from "crypto";


// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // ✅ Create Payment Controller (Razorpay)
// export async function createPayment(req, res) {
//   try {
//     const userId = req.user.id; // from auth middleware
//     const {
//       email,
//       mobileNumber,
//       whatsappOptIn,
//       whatsappNumber,
//       deliveryType,
//       recipientName,
//       recipientMobile,
//       pincode,
//       houseNo,
//       street,
//       locality,
//       landmark,
//       gstNumber,
//     } = req.body;

//     // Normalize deliveryType
//     const formattedDeliveryType =
//       deliveryType?.toLowerCase() === "home" ? "Home Delivery" : "Store Pickup";

//     // 1️⃣ Fetch user and cart
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     if (!user.cartData || Object.keys(user.cartData).length === 0) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     // 2️⃣ Calculate total amount from cart safely
//     let amount = 0;
//     const items = [];

//     for (const key of Object.keys(user.cartData)) {
//       const item = user.cartData[key];

//       if (!item || !item.gold || !item.gold.pricing) continue;

//       let pricing = {};
//       try {
//         pricing =
//           typeof item.gold.pricing === "string"
//             ? JSON.parse(item.gold.pricing)
//             : item.gold.pricing;
//       } catch (err) {
//         console.error("❌ Pricing parse error:", item.gold.pricing);
//         continue;
//       }

//       const quantity = Number(item.gold.quantity) || 1;
//       const price = Number(pricing.finalPrice) || 0;

//       if (price > 0 && quantity > 0) {
//         amount += price * quantity;
//         items.push({
//           name: item.name || "Unnamed Product",
//           quantity,
//           price,
//         });
//       }
//     }

//     if (items.length === 0 || amount <= 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Cart total invalid" });
//     }

//     // 3️⃣ Create payment entry in DB (status pending)
//     const payment = await Payment.create({
//       email,
//       mobileNumber,
//       whatsappOptIn,
//       whatsappNumber,
//       deliveryType: formattedDeliveryType,
//       recipientName,
//       recipientMobile: recipientMobile || mobileNumber,
//       pincode,
//       houseNo,
//       street,
//       locality,
//       landmark: landmark || "",
//       gstNumber: gstNumber || "",
//       cartData: user.cartData,
//       amount,
//       status: "PENDING",
//     });

//     // 4️⃣ Create Razorpay Order
//     const razorOrder = await razorpay.orders.create({
//       amount: amount * 100, // amount in paise
//       currency: "INR",
//       receipt: `receipt_${payment._id}`,
//       notes: {
//         email,
//         userId,
//         paymentId: payment._id.toString(),
//       },
//     });

//     // 5️⃣ Update payment entry with Razorpay orderId
//     payment.paymentId = razorOrder.id;
//     payment.providerResponse = razorOrder;
//     await payment.save();

//     // 6️⃣ Send response to frontend for Razorpay Checkout
//     return res.json({
//       success: true,
//       key: process.env.RAZORPAY_KEY_ID,
//       amount: razorOrder.amount,
//       currency: razorOrder.currency,
//       orderId: razorOrder.id,
//       paymentId: payment._id,
//       message: "Redirect to Razorpay Checkout",
//     });
//   } catch (err) {
//     console.error("[createPayment] error:", err.response?.data || err.message);
//     res
//       .status(500)
//       .json({ success: false, message: err.response?.data || err.message });
//   }
// }

// // export async function verifyPayment(req, res) {
// //   try {
// //     const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId } = req.body;

// //     if (!userId) {
// //       return res.status(400).json({ success: false, message: "userId is required" });
// //     }

// //     if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
// //       return res.status(400).json({ success: false, message: "Missing payment verification fields" });
// //     }

// //     // 🔑 Signature verification
// //     const generatedSignature = crypto
// //       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
// //       .update(razorpay_order_id + "|" + razorpay_payment_id)
// //       .digest("hex");

// //     if (generatedSignature !== razorpay_signature) {
// //       return res.status(400).json({ success: false, message: "Invalid Signature" });
// //     }

// //     // ✅ find existing payment record
// //     const payment = await Payment.findOneAndUpdate(
// //       { paymentId: razorpay_order_id },
// //       {
// //         userId,
// //         status: "SUCCESS",
// //         providerResponse: { razorpay_payment_id, razorpay_order_id, razorpay_signature },
// //       },
// //       { new: true }
// //     );

// //     if (!payment) {
// //       return res.status(404).json({ success: false, message: "Payment record not found" });
// //     }

// //     // ✅ create order using stored payment data
// //     const order = await Order.create({
// //       userId,
// //       items: Object.values(payment.cartData || {}).map((i) => ({
// //         name: i.name || "Unnamed Product",
// //         quantity: i.gold?.quantity || 1,
// //         price: JSON.parse(i.gold?.pricing || "{}").finalPrice || 0,
// //       })),
// //       amount: payment.amount,
// //       address: {
// //         deliveryType: payment.deliveryType,
// //         recipientName: payment.recipientName,
// //         recipientMobile: payment.recipientMobile,
// //         pincode: payment.pincode,
// //         houseNo: payment.houseNo,
// //         street: payment.street,
// //         locality: payment.locality,
// //         landmark: payment.landmark,
// //         gstNumber: payment.gstNumber,
// //       },
// //       status: "Order Placed",
// //       paymentMethod: "Razorpay",
// //       payment: true,
// //       paymentId: payment._id,
// //     });

// //     // ✅ clear user cart
// //     await userModel.findByIdAndUpdate(userId, { cartData: {} });

// //     return res.json({ success: true, message: "Payment Verified", payment, order });
// //   } catch (err) {
// //     console.error("[verifyPayment] error:", err.message);
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // }





// export async function verifyPayment(req, res) {
//   try {
//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId } = req.body;

//     console.log("🟡 Incoming verifyPayment request:", req.body);

//     // 🔒 Required field check
//     if (!userId) {
//       console.error("❌ userId missing");
//       return res.status(400).json({ success: false, message: "userId is required" });
//     }

//     if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
//       console.error("❌ Required fields missing");
//       return res.status(400).json({ success: false, message: "Missing payment verification fields" });
//     }

//     // 🔑 Signature verification
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       console.error("❌ Invalid Signature");
//       return res.status(400).json({ success: false, message: "Invalid Signature" });
//     }

//     // ✅ Find & update existing payment record
//     const payment = await Payment.findOneAndUpdate(
//       { paymentId: razorpay_order_id },
//       {
//         userId,
//         status: "SUCCESS",
//         providerResponse: { razorpay_payment_id, razorpay_order_id, razorpay_signature },
//       },
//       { new: true }
//     );

//     if (!payment) {
//       console.error("❌ Payment record not found for orderId:", razorpay_order_id);
//       return res.status(404).json({ success: false, message: "Payment record not found" });
//     }
//     console.log("✅ Payment updated:", payment._id);

//     // ✅ Create new order from payment data
//     const order = await Order.create({
//       userId,
//       items: Object.values(payment.cartData || {}).map((i) => ({
//         name: i.name || "Unnamed Product",
//         quantity: i.gold?.quantity || 1,
//         price: (() => {
//           try {
//             return JSON.parse(i.gold?.pricing || "{}").finalPrice || 0;
//           } catch {
//             return 0;
//           }
//         })(),
//       })),
//       amount: payment.amount,
//       address: {
//         deliveryType: payment.deliveryType || "",
//         recipientName: payment.recipientName || "",
//         recipientMobile: payment.recipientMobile || "",
//         pincode: payment.pincode || "",
//         houseNo: payment.houseNo || "",
//         street: payment.street || "",
//         locality: payment.locality || "",
//         landmark: payment.landmark || "",
//         gstNumber: payment.gstNumber || "",
//       },
//       status: "Order Placed",
//       paymentMethod: "Razorpay",
//       payment: true,
//       paymentId: payment._id,
//     });

//     console.log("✅ Order created:", order._id);

//     // ✅ Clear cart after order
//     await userModel.findByIdAndUpdate(userId, { cartData: {} });
//     console.log("🧹 Cleared cart for user:", userId);

//     return res.json({
//       success: true,
//       message: "✅ Payment Verified and Order Created",
//       paymentId: payment._id,
//       orderId: order._id,
//       order,
//     });
//   } catch (err) {
//     console.error("[verifyPayment] error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// }


// /**
//  * Get All Payments (Admin / Debugging)
//  */
// export async function getAllPayments(req, res) {
//   try {
//     const payments = await Payment.find().sort({ createdAt: -1 });
//     console.log("📦 All payments fetched:", payments.length);
//     return res.json({ success: true, count: payments.length, payments });
//   } catch (err) {
//     console.error("[getAllPayments] error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// }

// import Razorpay from "razorpay";
// import crypto from "crypto";
// import userModel from "../models/userModel.js";
// import Order from "../models/orderModel.js";
// import { Payment } from "../models/paymentModel.js";
// import connectRedis from "../config/redis.js";

// // 🔹 Initialize Redis
// const redisClient = await connectRedis();

// // 🔹 Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // ================================
// // 🔹 HELPER: Clear cart in Redis + MongoDB
// // ================================
// const clearCart = async (userId) => {
//   await redisClient.del(`cart:${userId}`);
//   await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });
// };

// // ================================
// // 🔹 CREATE PAYMENT
// // ================================
// export const createPayment = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const {
//       email, mobileNumber, whatsappOptIn, whatsappNumber,
//       deliveryType, recipientName, recipientMobile,
//       pincode, houseNo, street, locality, landmark, gstNumber,
//     } = req.body;

//     const user = await userModel.findById(userId);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });
//     if (!user.cartData || Object.keys(user.cartData).length === 0)
//       return res.status(400).json({ success: false, message: "Cart is empty" });

//     // Calculate amount and items
//     let amount = 0;
//     const items = [];

//     for (const key of Object.keys(user.cartData)) {
//       const item = user.cartData[key];
//       if (!item?.gold?.pricing) continue;

//       let pricing = typeof item.gold.pricing === "string"
//         ? JSON.parse(item.gold.pricing)
//         : item.gold.pricing;

//       const quantity = Number(item.gold.quantity) || 1;
//       const price = Number(pricing.finalPrice) || 0;
//       if (price > 0 && quantity > 0) {
//         amount += price * quantity;
//         items.push({ name: item.name || "Unnamed Product", quantity, price });
//       }
//     }

//     if (amount <= 0) return res.status(400).json({ success: false, message: "Invalid cart total" });

//     const formattedDeliveryType = deliveryType?.toLowerCase() === "home" ? "Home Delivery" : "Store Pickup";

//     // Save payment record
//     const payment = await Payment.create({
//       email, mobileNumber, whatsappOptIn, whatsappNumber,
//       deliveryType: formattedDeliveryType, recipientName,
//       recipientMobile: recipientMobile || mobileNumber,
//       pincode, houseNo, street, locality, landmark: landmark || "",
//       gstNumber: gstNumber || "", cartData: user.cartData,
//       amount, status: "PENDING",
//     });

//     // Razorpay order
//     const razorOrder = await razorpay.orders.create({
//       amount: amount * 100, // in paise
//       currency: "INR",
//       receipt: `receipt_${payment._id}`,
//       notes: { email, userId, paymentId: payment._id.toString() },
//     });

//     payment.paymentId = razorOrder.id;
//     payment.providerResponse = razorOrder;
//     await payment.save();

//     res.json({
//       success: true,
//       key: process.env.RAZORPAY_KEY_ID,
//       amount: razorOrder.amount,
//       currency: razorOrder.currency,
//       orderId: razorOrder.id,
//       paymentId: payment._id,
//       message: "Redirect to Razorpay Checkout",
//     });
//   } catch (err) {
//     console.error("[createPayment] error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ================================
// // 🔹 VERIFY PAYMENT
// // ================================
// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

//     if (!userId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
//       return res.status(400).json({ success: false, message: "Missing required fields" });

//     // Verify signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature)
//       return res.status(400).json({ success: false, message: "Invalid signature" });

//     // Update payment
//     const payment = await Payment.findOneAndUpdate(
//       { paymentId: razorpay_order_id },
//       { userId, status: "SUCCESS", providerResponse: { razorpay_payment_id, razorpay_order_id, razorpay_signature } },
//       { new: true }
//     );

//     if (!payment) return res.status(404).json({ success: false, message: "Payment record not found" });

//     // Create order
//     const order = await Order.create({
//       userId,
//       items: Object.values(payment.cartData || {}).map(i => ({
//         name: i.name || "Unnamed Product",
//         quantity: i.gold?.quantity || 1,
//         price: (() => {
//           try { return JSON.parse(i.gold?.pricing || "{}").finalPrice || 0; } catch { return 0; }
//         })(),
//       })),
//       amount: payment.amount,
//       address: {
//         deliveryType: payment.deliveryType || "",
//         recipientName: payment.recipientName || "",
//         recipientMobile: payment.recipientMobile || "",
//         pincode: payment.pincode || "",
//         houseNo: payment.houseNo || "",
//         street: payment.street || "",
//         locality: payment.locality || "",
//         landmark: payment.landmark || "",
//         gstNumber: payment.gstNumber || "",
//       },
//       status: "Order Placed",
//       paymentMethod: "Razorpay",
//       payment: true,
//       paymentId: payment._id,
//     });

//     // Clear cart
//     await clearCart(userId);

//     res.json({
//       success: true,
//       message: "Payment verified and order created",
//       paymentId: payment._id,
//       orderId: order._id,
//       order,
//     });
//   } catch (err) {
//     console.error("[verifyPayment] error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ================================
// // 🔹 GET ALL PAYMENTS
// // ================================
// export const getAllPayments = async (req, res) => {
//   try {
//     const payments = await Payment.find().sort({ createdAt: -1 });
//     res.json({ success: true, count: payments.length, payments });
//   } catch (err) {
//     console.error("[getAllPayments] error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// import Razorpay from "razorpay";
// import crypto from "crypto";
// import userModel from "../models/userModel.js";
// import Order from "../models/orderModel.js";
// import  Payment  from "../models/paymentModel.js";
// import connectRedis from "../config/redis.js";
// import { v4 as uuidv4 } from "uuid";


// // --------------------
// // 🔹 Initialize Redis
// // --------------------
// const redisClient = await connectRedis();

// // --------------------
// // 🔹 Razorpay instance
// // --------------------
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // --------------------
// // 🔹 Helper: Clear cart
// // --------------------
// const clearCart = async (userId) => {
//   if (!userId) return;
//   await redisClient.del(`cart:${userId}`);
//   await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });
// };

// // ================================
// // 🔹 CREATE PAYMENT
// // ================================





// export const createPayment = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId)
//       return res.status(401).json({ success: false, message: "Unauthorized" });

//     const {
//       email,
//       mobileNumber,
//       whatsappOptIn,
//       whatsappNumber,
//       deliveryType,
//       recipientName,
//       recipientMobile,
//       pincode,
//       houseNo,
//       street,
//       locality,
//       landmark,
//       gstNumber,
//     } = req.body;

//     if (!email || !mobileNumber) {
//       return res.status(400).json({ success: false, message: "Email and mobile number are required" });
//     }

//     const user = await userModel.findById(userId);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     const cart = user.cartData || {};
//     if (Object.keys(cart).length === 0) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     let amount = 0;
//     for (const key of Object.keys(cart)) {
//       const item = cart[key];
//       if (!item?.gold?.pricing) continue;

//       const pricing = typeof item.gold.pricing === "string" ? JSON.parse(item.gold.pricing) : item.gold.pricing;
//       const quantity = Number(item.gold.quantity) || 1;
//       const price = Number(pricing.finalPrice) || 0;

//       if (price > 0 && quantity > 0) {
//         amount += price * quantity;
//       }
//     }

//     if (amount <= 0) return res.status(400).json({ success: false, message: "Invalid cart total" });

//     const formattedDeliveryType = deliveryType?.toLowerCase() === "home" ? "Home Delivery" : "Store Pickup";

//     const order_id = uuidv4(); // ✅ generate UUID

//     const payment = await Payment.create({
//       userId,
//       order_id,
//       email,
//       mobileNumber,
//       whatsappOptIn: whatsappOptIn || false,
//       whatsappNumber,
//       deliveryType: formattedDeliveryType,
//       recipientName,
//       recipientMobile: recipientMobile || mobileNumber,
//       pincode,
//       houseNo,
//       street,
//       locality,
//       landmark: landmark || "",
//       gstNumber: gstNumber || "",
//       cartData: cart,
//       amount,
//       status: "PENDING",
//     });

//     // Razorpay order
//     const razorOrder = await razorpay.orders.create({
//       amount: amount * 100,
//       currency: "INR",
//       receipt: `receipt_${payment._id}`,
//       notes: {
//         email,
//         userId,
//         order_id,
//       },
//     });

//     payment.paymentId = razorOrder.id;
//     payment.providerResponse = razorOrder;
//     await payment.save();

//     res.json({
//       success: true,
//       key: process.env.RAZORPAY_KEY_ID,
//       amount: razorOrder.amount,
//       currency: razorOrder.currency,
//       orderId: razorOrder.id,
//       order_id: payment.order_id, // ✅ send custom UUID
//       paymentId: payment._id,
//       message: "Redirect to Razorpay Checkout",
//     });
//   } catch (err) {
//     console.error("[createPayment] error:", err);
//     res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };




// // ================================
// // 🔹 VERIFY PAYMENT
// // ================================
// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

//     if (!userId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     // Verify signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature)
//       return res.status(400).json({ success: false, message: "Invalid signature" });

//     const payment = await Payment.findOneAndUpdate(
//       { paymentId: razorpay_order_id },
//       {
//         userId,
//         status: "SUCCESS",
//         providerResponse: { razorpay_payment_id, razorpay_order_id, razorpay_signature },
//       },
//       { new: true }
//     );

//     if (!payment) return res.status(404).json({ success: false, message: "Payment record not found" });

//     // Create order
//     const orderItems = Object.values(payment.cartData || {}).map(i => {
//       const pricing = typeof i.gold.pricing === "string" ? JSON.parse(i.gold.pricing) : i.gold.pricing;
//       return {
//         name: i.name || "Product",
//         quantity: Number(i.gold?.quantity) || 1,
//         price: Number(pricing?.finalPrice) || 0,
//       };
//     });

//     const order = await Order.create({
//       userId,
//       items: orderItems,
//       amount: payment.amount,
//       address: {
//         deliveryType: payment.deliveryType,
//         recipientName: payment.recipientName,
//         recipientMobile: payment.recipientMobile,
//         pincode: payment.pincode,
//         houseNo: payment.houseNo,
//         street: payment.street,
//         locality: payment.locality,
//         landmark: payment.landmark,
//         gstNumber: payment.gstNumber,
//       },
//       status: "Order Placed",
//       paymentMethod: "Razorpay",
//       payment: true,
//       paymentId: payment._id,
//     });

//     await clearCart(userId);

//     res.json({
//       success: true,
//       message: "Payment verified and order created",
//       paymentId: payment._id,
//       orderId: order._id,
//       order,
//     });

//   } catch (err) {
//     console.error("[verifyPayment] error:", err);
//     res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };

// // ================================
// // 🔹 GET ALL PAYMENTS
// // ================================
// export const getAllPayments = async (req, res) => {
//   try {
//     const payments = await Payment.find().sort({ createdAt: -1 });
//     res.json({ success: true, count: payments.length, payments });
//   } catch (err) {
//     console.error("[getAllPayments] error:", err);
//     res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };

// export const refundPayment = async (req, res) => {
//   const { order_id } = req.body; // custom UUID from your DB

//   if (!order_id) return res.status(400).json({ success: false, message: "Order ID required" });

//   try {
//     const order = await Payment.findOne({ order_id });

//     if (!order) return res.status(404).json({ success: false, message: "Order not found" });

//     const paymentTime = new Date(order.createdAt);
//     const now = new Date();
//     const hoursPassed = (now - paymentTime) / 1000 / 60 / 60;

//     if (hoursPassed > 24)
//       return res.status(400).json({ success: false, message: "Refund period expired" });

//     if (order.status === "refunded")
//       return res.status(400).json({ success: false, message: "Order already refunded." });

//     if (!order.paymentId || !order.paymentId.startsWith("pay_")) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid Razorpay Payment ID missing. Cannot refund.",
//       });
//     }

//     // ✅ Refund using Razorpay Payment ID
//     const refund = await razorpay.payments.refund(order.paymentId, {
//       amount: order.amount * 100, // paise
//     });

//     order.status = "refunded";
//     await order.save();

//     res.json({ success: true, message: "Payment refunded successfully", refund });
//   } catch (err) {
//     console.error("[refundPayment] error:", err);
//     res.status(500).json({ success: false, message: "Refund failed", error: err });
//   }
// };

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

// ================================
// 🔹 CREATE PAYMENT
// ================================
// export const createPayment = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     const {
//       email,
//       mobileNumber,
//       whatsappOptIn,
//       whatsappNumber,
//       deliveryType,
//       recipientName,
//       recipientMobile,
//       pincode,
//       houseNo,
//       street,
//       locality,
//       landmark,
//       gstNumber,
//     } = req.body;

//     if (!email || !mobileNumber) return res.status(400).json({ success: false, message: "Email and mobile number are required" });

//     const user = await userModel.findById(userId);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     const cart = user.cartData || {};
//     if (Object.keys(cart).length === 0) return res.status(400).json({ success: false, message: "Cart is empty" });

//     // Calculate total amount
//     let amount = 0;
//     for (const key of Object.keys(cart)) {
//       const item = cart[key];
//       if (!item?.gold?.pricing) continue;
//       const pricing = typeof item.gold.pricing === "string" ? JSON.parse(item.gold.pricing) : item.gold.pricing;
//       const quantity = Number(item.gold.quantity) || 1;
//       const price = Number(pricing.finalPrice) || 0;
//       amount += price * quantity;
//     }
//     if (amount <= 0) return res.status(400).json({ success: false, message: "Invalid cart total" });

//     const formattedDeliveryType = deliveryType?.toLowerCase() === "home" ? "Home Delivery" : "Store Pickup";
//     const order_id = uuidv4(); // custom UUID

//     // ✅ Create Payment record
//     const payment = await Payment.create({
//       userId,
//       order_id,
//       email,
//       mobileNumber,
//       whatsappOptIn: whatsappOptIn || false,
//       whatsappNumber,
//       deliveryType: formattedDeliveryType,
//       recipientName,
//       recipientMobile: recipientMobile || mobileNumber,
//       pincode,
//       houseNo,
//       street,
//       locality,
//       landmark: landmark || "",
//       gstNumber: gstNumber || "",
//       cartData: cart,
//       amount,
//       status: "PENDING",
//     });

//     // ✅ Create Razorpay order
//     const razorOrder = await razorpay.orders.create({
//       amount: amount * 100, // paise
//       currency: "INR",
//       receipt: `receipt_${payment._id}`,
//       notes: { email, userId, order_id },
//     });

//     payment.razorpayOrderId = razorOrder.id;
//     payment.providerResponse = razorOrder;
//     await payment.save();

//     res.json({
//       success: true,
//       key: process.env.RAZORPAY_KEY_ID,
//       amount: razorOrder.amount,
//       currency: razorOrder.currency,
//       orderId: razorOrder.id,   // razorpay order_xxx
//       order_id: payment.order_id, // custom UUID
//       message: "Redirect to Razorpay Checkout",
//     });

//   } catch (err) {
//     console.error("[createPayment] error:", err);
//     res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };

// export const createPayment = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     const { email, mobileNumber, deliveryType, recipientName, recipientMobile, pincode, houseNo, street, locality, landmark, gstNumber } = req.body;

//     if (!email || !mobileNumber) return res.status(400).json({ success: false, message: "Email and mobile number are required" });

//     const user = await userModel.findById(userId);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     const cart = user.cartData || {};
//     if (Object.keys(cart).length === 0) return res.status(400).json({ success: false, message: "Cart is empty" });

//     // Calculate total amount - Fixed to handle nested color variants
//     let amount = 0;
//     for (const productId of Object.keys(cart)) {
//       const productVariants = cart[productId];
//       if (!productVariants || typeof productVariants !== 'object') continue;

//       // Iterate through each color variant for this product
//       for (const colorKey of Object.keys(productVariants)) {
//         const variant = productVariants[colorKey];
//         if (!variant || typeof variant !== 'object') continue;

//         // Handle both old format (direct pricing) and new format (nested variant structure)
//         let pricing, quantity;
        
//         if (variant.pricing && variant.quantity) {
//           // New format: variant has pricing and quantity properties
//           pricing = typeof variant.pricing === "string" ? JSON.parse(variant.pricing) : variant.pricing;
//           quantity = Number(variant.quantity) || 1;
//         } else if (variant.gold?.pricing) {
//           // Legacy format: pricing nested under gold property
//           pricing = typeof variant.gold.pricing === "string" ? JSON.parse(variant.gold.pricing) : variant.gold.pricing;
//           quantity = Number(variant.gold.quantity) || 1;
//         } else {
//           // Skip invalid variants
//           continue;
//         }

//         const price = Number(pricing?.finalPrice) || 0;
//         if (price > 0 && quantity > 0) {
//           amount += price * quantity;
//         }
//       }
//     }
//     if (amount <= 0) return res.status(400).json({ success: false, message: "Invalid cart total" });

//     const order_id = uuidv4();

//     // Create Payment record
//     const payment = await Payment.create({
//       userId,
//       order_id,
//       email,
//       mobileNumber,
//       deliveryType,
//       recipientName,
//       recipientMobile: recipientMobile || mobileNumber,
//       pincode,
//       houseNo,
//       street,
//       locality,
//       landmark,
//       gstNumber,
//       cartData: cart,
//       amount,
//       status: "PENDING",
//     });

//     // Create Razorpay order
//     const razorOrder = await razorpay.orders.create({
//       amount: amount * 100,
//       currency: "INR",
//       receipt: `receipt_${payment._id}`,
//       notes: { email, userId, order_id },
//     });

//     payment.razorpayOrderId = razorOrder.id;
//     payment.providerResponse = razorOrder;
//     await payment.save();

//     res.json({
//       success: true,
//       key: process.env.RAZORPAY_KEY_ID,
//       amount: razorOrder.amount,
//       currency: razorOrder.currency,
//       orderId: razorOrder.id,
//       order_id: payment.order_id,
//       message: "Redirect to Razorpay Checkout",
//     });

//   } catch (err) {
//     console.error("[createPayment] error:", err);
//     res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };

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







// ================================
// 🔹 VERIFY PAYMENT
// ================================
// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     // Verify signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Invalid signature" });
//     }

//     // Update Payment as SUCCESS
//     const payment = await Payment.findOneAndUpdate(
//       { razorpayOrderId: razorpay_order_id },
//       {
//         paymentId: razorpay_payment_id,
//         status: "SUCCESS",
//         providerResponse: { razorpay_payment_id, razorpay_order_id, razorpay_signature },
//       },
//       { new: true }
//     );

//     if (!payment) {
//       return res.status(404).json({ success: false, message: "Payment record not found" });
//     }

//     // Map order items
//     const orderItems = Object.values(payment.cartData || {}).map((i) => {
//       const pricing = typeof i.gold.pricing === "string" ? JSON.parse(i.gold.pricing) : i.gold.pricing;
//       return {
//         name: i.name || "Product",
//         quantity: Number(i.gold?.quantity) || 1,
//         price: Number(pricing?.finalPrice) || 0,
//         ringSize: i.gold?.ringSize || null,
//         goldCarat: i.gold?.goldCarat || null,
//         sku: i.gold?.sku || null,
//         productId: i.gold?.productId || null,
//       };
//     });

//     // Create Order
//     const order = await Order.create({
//       userId: payment.userId,
//       items: orderItems,
//       amount: payment.amount,
//       address: {
//         deliveryType: payment.deliveryType,
//         recipientName: payment.recipientName,
//         recipientMobile: payment.recipientMobile,
//         pincode: payment.pincode,
//         houseNo: payment.houseNo,
//         street: payment.street,
//         locality: payment.locality,
//         landmark: payment.landmark,
//         gstNumber: payment.gstNumber,
//       },
//       status: "Order Placed",
//       paymentMethod: "Razorpay",
//       payment: true,               // ✅ mark payment completed
//       paymentId: payment._id,      // ✅ link to payment
//     });

//     // Clear user's cart
//     await clearCart(payment.userId);

//     res.json({
//       success: true,
//       message: "Payment verified and order created",
//       paymentId: payment._id,
//       orderId: order._id,
//       order,
//     });
//   } catch (err) {
//     console.error("[verifyPayment] error:", err);
//     res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };




// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
//       return res.status(400).json({ success: false, message: "Missing required fields" });

//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature)
//       return res.status(400).json({ success: false, message: "Invalid signature" });

//     const payment = await Payment.findOneAndUpdate(
//       { razorpayOrderId: razorpay_order_id },
//       { paymentId: razorpay_payment_id, status: "SUCCESS", providerResponse: { razorpay_order_id, razorpay_payment_id, razorpay_signature } },
//       { new: true }
//     );

//     if (!payment)
//       return res.status(404).json({ success: false, message: "Payment record not found" });

//     // Create Order - Fixed to handle nested color variants
//     const items = [];
//     const cartData = payment.cartData || {};
    
//     for (const [productId, productVariants] of Object.entries(cartData)) {
//       if (!productId || !productVariants || typeof productVariants !== 'object') continue;
      
//       // Get product details for image
//       let image = "https://placehold.co/600x600?text=No+Image";
//       try {
//         const product = await productModel.findById(productId).select("image thumbnail name").lean();
//         if (product) {
//           image = (Array.isArray(product.image) && product.image[0]) || product.thumbnail || image;
//         }
//       } catch { }

//       // Process each color variant
//       for (const [colorKey, variant] of Object.entries(productVariants)) {
//         if (!variant || typeof variant !== 'object') continue;

//         let pricing, quantity, name = "Product";
        
//         if (variant.pricing && variant.quantity) {
//           // New format: variant has pricing and quantity properties
//           pricing = typeof variant.pricing === "string" ? JSON.parse(variant.pricing) : variant.pricing;
//           quantity = Number(variant.quantity) || 1;
//           name = variant.name || "Product";
//         } else if (variant.gold?.pricing) {
//           // Legacy format: pricing nested under gold property
//           pricing = typeof variant.gold.pricing === "string" ? JSON.parse(variant.gold.pricing) : variant.gold.pricing;
//           quantity = Number(variant.gold.quantity) || 1;
//           name = variant.name || "Product";
//         } else {
//           continue; // Skip invalid variants
//         }

//         const price = Number(pricing?.finalPrice) || 0;
//         if (price > 0 && quantity > 0) {
//           items.push({
//             productId,
//             name: `${name} - ${colorKey}`,
//             quantity,
//             price,
//             image,
//             color: colorKey,
//             ringSize: variant.ringSize || null,
//             goldCarat: variant.goldCarat || null,
//             sku: variant.sku || null
//           });
//         }
//       }
//     }

//     const order = await Order.create({
//       userId: payment.userId,
//       items: items,
//       amount: payment.amount,
//       address: {
//         deliveryType: payment.deliveryType,
//         recipientName: payment.recipientName,
//         recipientMobile: payment.recipientMobile,
//         pincode: payment.pincode,
//         houseNo: payment.houseNo,
//         street: payment.street,
//         locality: payment.locality,
//         landmark: payment.landmark,
//         gstNumber: payment.gstNumber,
//       },
//       status: "Order Placed",
//       paymentMethod: "Razorpay",
//       payment: true,
//       paymentId: razorpay_payment_id,
//       razorpayPaymentId: razorpay_payment_id,
//       razorpayOrderId: razorpay_order_id,
//       paymentRef: payment._id,
//       order_id: payment.order_id,
//     });

//     // Clear cart
//     await userModel.findByIdAndUpdate(payment.userId, { cartData: {} });

//     res.json({ success: true, message: "Payment verified & order created", orderId: order._id, order_id: order.order_id, payment_id: razorpay_payment_id });

//   } catch (err) {
//     console.error("[verifyPayment] error:", err);
//     res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };

// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     // 🧩 Step 1: Validate Required Fields
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required Razorpay fields.",
//       });
//     }

//     // 🧾 Step 2: Verify Razorpay Signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid signature — payment verification failed.",
//       });
//     }

//     // 💰 Step 3: Find and Update Payment Record
//     const payment = await Payment.findOneAndUpdate(
//       { razorpayOrderId: razorpay_order_id },
//       {
//         paymentId: razorpay_payment_id,
//         status: "SUCCESS",
//         providerResponse: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
//         paymentVerifiedAt: new Date(),
//       },
//       { new: true }
//     );

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment record not found.",
//       });
//     }

//     // 🛒 Step 4: Prepare Items (Handles Nested Variant Structure)
//     const items = [];
//     const cartData = payment.cartData || {};

//     for (const [productId, productVariants] of Object.entries(cartData)) {
//       if (!productId || !productVariants || typeof productVariants !== "object") continue;

//       // 🖼 Get Product Image
//       let image = "https://placehold.co/600x600?text=No+Image";
//       try {
//         const product = await productModel
//           .findById(productId)
//           .select("image thumbnail name")
//           .lean();
//         if (product) {
//           image =
//             (Array.isArray(product.image) && product.image[0]) ||
//             product.thumbnail ||
//             image;
//         }
//       } catch (err) {
//         console.warn(`⚠️ Image fetch failed for product ${productId}:`, err.message);
//       }

//       // 🎨 Iterate Variants (colors, sizes, etc.)
//       for (const [colorKey, variant] of Object.entries(productVariants)) {
//         if (!variant || typeof variant !== "object") continue;

//         let pricing, quantity, name = "Product";

//         // 🧩 Handle multiple variant formats
//         if (variant.pricing && variant.quantity) {
//           pricing = typeof variant.pricing === "string" ? JSON.parse(variant.pricing) : variant.pricing;
//           quantity = Number(variant.quantity) || 1;
//           name = variant.name || "Product";
//         } else if (variant.gold?.pricing) {
//           pricing = typeof variant.gold.pricing === "string" ? JSON.parse(variant.gold.pricing) : variant.gold.pricing;
//           quantity = Number(variant.gold.quantity) || 1;
//           name = variant.name || "Product";
//         } else {
//           continue; // Skip invalid structure
//         }

//         const price = Number(pricing?.finalPrice) || 0;
//         if (price > 0 && quantity > 0) {
//           items.push({
//             productId,
//             name: `${name} - ${colorKey}`,
//             quantity,
//             price,
//             image,
//             color: colorKey,
//             ringSize: variant.ringSize || null,
//             goldCarat: variant.goldCarat || null,
//             sku: variant.sku || null,
//           });
//         }
//       }
//     }

//     // 🧾 Step 5: Create Order Record
//     const order = await Order.create({
//       userId: payment.userId,
//       items,
//       amount: payment.amount,
//       paymentMethod: "Razorpay",
//       payment: true,
//       paymentId: razorpay_payment_id,
//       razorpayPaymentId: razorpay_payment_id,
//       razorpayOrderId: razorpay_order_id,
//       paymentStatus: "SUCCESS",
//       paymentRef: payment._id,
//       order_id: payment.order_id,
//       status: "Order Placed",
//       address: {
//         deliveryType: payment.deliveryType,
//         recipientName: payment.recipientName,
//         recipientMobile: payment.recipientMobile,
//         pincode: payment.pincode,
//         houseNo: payment.houseNo,
//         street: payment.street,
//         locality: payment.locality,
//         landmark: payment.landmark,
//         gstNumber: payment.gstNumber,
//       },
//     });

//     // 🧹 Step 6: Clear Cart after Successful Order
//     await userModel.findByIdAndUpdate(payment.userId, { cartData: {} });

//     // ✅ Step 7: Respond Success
//     return res.json({
//       success: true,
//       message: "✅ Payment verified & order created successfully!",
//       orderId: order._id,
//       order_id: order.order_id,
//       payment_id: razorpay_payment_id,
//     });

//   } catch (err) {
//     console.error("❌ [verifyPayment] error:", err);
//     return res.status(500).json({
//       success: false,
//       message: err.message || "Server error during payment verification.",
//     });
//   }
// };



// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
//       return res.status(400).json({ success: false, message: "Missing required fields" });

//     // Verify Razorpay signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature)
//       return res.status(400).json({ success: false, message: "Invalid signature" });

//     // Find and update Payment
//     const payment = await Payment.findOneAndUpdate(
//       { razorpayOrderId: razorpay_order_id },
//       {
//         paymentId: razorpay_payment_id,
//         status: "SUCCESS",
//         providerResponse: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
//       },
//       { new: true }
//     );

//     if (!payment)
//       return res.status(404).json({ success: false, message: "Payment record not found" });

//     // Prepare order items (with productId, name, quantity, price, image)
//     const orderItems = await Promise.all(
//       Object.entries(payment.cartData || {}).map(async ([productId, item]) => {
//         if (!productId || !item) return null;

//         const pricing =
//           typeof item.gold.pricing === "string"
//             ? JSON.parse(item.gold.pricing)
//             : item.gold.pricing;

//         let image = "https://placehold.co/600x600?text=No+Image";
//         try {
//           const product = await Product.findById(productId).select("image thumbnail").lean();
//           if (product) {
//             image = (Array.isArray(product.image) && product.image[0]) || product.thumbnail || image;
//           }
//         } catch {}

//         return {
//           productId,
//           name: item.name || "Product",
//           quantity: Number(item.gold?.quantity) || 1,
//           price: Number(pricing?.finalPrice) || 0,
//           image,
//         };
//       })
//     );

//     // Remove any null items just in case
//     const validItems = orderItems.filter(Boolean);
//     if (validItems.length === 0)
//       return res.status(400).json({ success: false, message: "No valid items to create order" });

//     // Create Order
//     const order = await Order.create({
//       userId: payment.userId,
//       items: validItems,
//       amount: payment.amount,
//       address: {
//         deliveryType: payment.deliveryType,
//         recipientName: payment.recipientName,
//         recipientMobile: payment.recipientMobile,
//         pincode: payment.pincode,
//         houseNo: payment.houseNo,
//         street: payment.street,
//         locality: payment.locality,
//         landmark: payment.landmark,
//         gstNumber: payment.gstNumber,
//       },
//       status: "Order Placed",
//       paymentMethod: "Razorpay",
//       payment: true,
//       paymentId: razorpay_payment_id,
//       razorpayPaymentId: razorpay_payment_id,
//       razorpayOrderId: razorpay_order_id,
//       paymentRef: payment._id,
//     });

//     // Clear user cart
//     await clearCart(payment.userId);

//     // Generate Razorpay Invoice
//     const invoice = await razorpay.invoices.create({
//       type: "invoice",
//       customer: {
//         name: payment.recipientName || "Customer",
//         contact: payment.recipientMobile,
//         email: payment.email || process.env.TEST_EMAIL,
//       },
//       line_items: validItems.map((item) => ({
//         name: item.name,
//         amount: item.price * 100,
//         currency: "INR",
//         quantity: item.quantity,
//       })),
//       sms_notify: 1,
//       email_notify: 1,
//     });

//     return res.json({
//       success: true,
//       message: "Payment verified, order created & invoice sent",
//       orderId: order._id,
//       order_id: order.order_id || order._id,
//       payment_id: razorpay_payment_id,
//       invoiceUrl: invoice.short_url,
//     });

//   } catch (err) {
//     console.error("[verifyPayment] error:", err);
//     res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };



// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
//       return res.status(400).json({ success: false, message: "Missing required fields" });

//     // ✅ Verify signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature)
//       return res.status(400).json({ success: false, message: "Invalid signature" });

//     // ✅ Update Payment as SUCCESS
//     const payment = await Payment.findOneAndUpdate(
//       { razorpayOrderId: razorpay_order_id },
//       {
//         paymentId: razorpay_payment_id,
//         status: "SUCCESS",
//         providerResponse: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
//       },
//       { new: true }
//     );

//     if (!payment) return res.status(404).json({ success: false, message: "Payment record not found" });

//     // ✅ Create Order
//     const orderItems = Object.values(payment.cartData || {}).map((i) => {
//       const pricing = typeof i.gold.pricing === "string" ? JSON.parse(i.gold.pricing) : i.gold.pricing;
//       return {
//         name: i.name || "Product",
//         quantity: Number(i.gold?.quantity) || 1,
//         price: Number(pricing?.finalPrice) || 0,
//       };
//     });

//     const order = await Order.create({
//       userId: payment.userId,
//       items: orderItems,
//       amount: payment.amount,
//       address: {
//         deliveryType: payment.deliveryType,
//         recipientName: payment.recipientName,
//         recipientMobile: payment.recipientMobile,
//         pincode: payment.pincode,
//         houseNo: payment.houseNo,
//         street: payment.street,
//         locality: payment.locality,
//         landmark: payment.landmark,
//         gstNumber: payment.gstNumber,
//       },
//       status: "Order Placed",
//       paymentMethod: "Razorpay",
//       payment: true,
//       paymentId: payment._id, // Internal reference
//       razorpayPaymentId: razorpay_payment_id, // Store Razorpay payment ID
//       razorpayOrderId: razorpay_order_id,
//     });

//     await clearCart(payment.userId);

//     // ✅ Generate Razorpay Invoice
//     const invoice = await razorpay.invoices.create({
//       type: "invoice",
//       customer: {
//         name: payment.recipientName || "Customer",
//         contact: payment.recipientMobile,
//         email: payment.email || process.env.TEST_EMAIL,
//       },
//       line_items: orderItems.map((item) => ({
//         name: item.name,
//         amount: item.price * 100,
//         currency: "INR",
//         quantity: item.quantity,
//       })),
//       sms_notify: 1,
//       email_notify: 1,
//     });

//     return res.json({
//       success: true,
//       message: "Payment verified, order created & invoice sent",
//       orderId: order._id,
//       order_id: order.order_id || order._id,
//       payment_id: razorpay_payment_id,
//       invoiceUrl: invoice.short_url,
//     });

//   } catch (err) {
//     console.error("[verifyPayment] error:", err);
//     res.status(500).json({ success: false, message: err.message || "Server error" });
//   }
// };


// ================================
// 🔹 REFUND PAYMENT
// ================================
// export const refundPayment = async (req, res) => {
//   try {
//     const { order_id } = req.body;
//     if (!order_id) return res.status(400).json({ success: false, message: "Order ID required" });

//     const payment = await Payment.findOne({ order_id });
//     if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

//     // Already refunded
//     if (payment.status === "REFUNDED")
//       return res.status(400).json({ success: false, message: "Order already refunded" });

//     // Refund period (24h)
//     // const hoursPassed = (Date.now() - new Date(payment.createdAt).getTime()) / 1000 / 60 / 60;
//     // if (hoursPassed > 24) return res.status(400).json({ success: false, message: "Refund period expired" });

//     // Check payment ID
//     if (!payment.paymentId || !payment.paymentId.startsWith("pay_"))
//       return res.status(400).json({ success: false, message: "Valid Razorpay Payment ID missing" });

//     // Refund amount in paise
//     const refundAmount = payment.amount * 100;

//     // Refund payment via Razorpay
//     const refund = await razorpay.payments.refund(payment.paymentId, { amount: refundAmount });

//     // Update payment status in DB
//     payment.status = "REFUNDED";
//     await payment.save();

//     return res.json({
//       success: true,
//       message: "Payment refunded successfully (Test mode compatible)",
//       refund,
//     });
//   } catch (err) {
//     console.error("[refundPayment] error:", err);

//     // Handle Razorpay specific errors
//     if (err?.error?.description) {
//       return res.status(500).json({
//         success: false,
//         message: "Refund failed: " + err.error.description,
//       });
//     }

//     res.status(500).json({ success: false, message: "Refund failed", error: err.message });
//   }
// };

// export const refundPayment = async (req, res) => {
//   try {
//     const { order_id, token } = req.body;

//     if (!order_id) return res.status(400).json({ success: false, message: "Order ID required" });
//     if (!token) return res.status(400).json({ success: false, message: "reCAPTCHA token required" });

//     // Verify reCAPTCHA
//     const secretKey = process.env.RECAPTCHA_SECRET_KEY;
//     if (!secretKey) return res.status(500).json({ success: false, message: "reCAPTCHA secret missing" });

//     const captchaRes = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
//     );

//     if (!captchaRes.data.success) {
//       return res.status(400).json({ success: false, message: "Captcha verification failed" });
//     }

//     // Find payment in DB
//     const payment = await Payment.findOne({ order_id });
//     if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

//     if (payment.status === "refunded") return res.status(400).json({ success: false, message: "Already refunded" });

//     // Check 24h refund period
//     const hoursPassed = (Date.now() - new Date(payment.createdAt).getTime()) / 1000 / 60 / 60;
//     if (hoursPassed > 24) return res.status(400).json({ success: false, message: "Refund period expired (24h)" });

//     const razorpayPaymentId = payment.paymentId || payment.providerResponse?.razorpay_payment_id;
//     if (!razorpayPaymentId) return res.status(400).json({ success: false, message: "Valid Razorpay Payment ID missing" });

//     // Refund via Razorpay
//     let refund;
//     try {
//       refund = await razorpay.payments.refund(razorpayPaymentId, { amount: payment.amount * 100 });
//     } catch (err) {
//       console.error("[Razorpay refund error]", err);
//       return res.status(500).json({ success: false, message: "Razorpay refund failed", error: err.description || err.message });
//     }

//     payment.status = "refunded";
//     await payment.save();

//     return res.json({
//       success: true,
//       message: "Payment refunded successfully",
//       order_id: payment.order_id,
//       payment_id: razorpayPaymentId,
//       refund_id: refund.id,
//       refund_status: refund.status,
//       amount: payment.amount,
//       currency: payment.currency,
//     });

//   } catch (err) {
//     console.error("[refundPayment] error:", err);
//     return res.status(500).json({ success: false, message: "Refund failed", error: err.message });
//   }
// };

// controllers/paymentController.js
// export const refundPayment = async (req, res) => {
//   try {
//     const { order_id, token } = req.body;

//     if (!order_id)
//       return res.status(400).json({ success: false, message: "Order ID required" });
//     if (!token)
//       return res.status(400).json({ success: false, message: "reCAPTCHA token required" });

//     // ✅ Verify reCAPTCHA
//     const secretKey = process.env.RECAPTCHA_SECRET_KEY;
//     if (!secretKey)
//       return res.status(500).json({ success: false, message: "reCAPTCHA secret missing" });

//     const captchaRes = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
//     );
//     if (!captchaRes.data.success) {
//       return res.status(400).json({ success: false, message: "Captcha verification failed" });
//     }

//     // ✅ Find order/payment (use the right field)
//     let payment = await Payment.findOne({
//       $or: [
//         { order_id: order_id }, // if you saved as "order_id"
//         { razorpayOrderId: order_id }, // if saved as "razorpayOrderId"
//       ],
//     });

//     if (!payment)
//       return res.status(404).json({ success: false, message: "Payment not found" });

//     if (payment.status === "refunded") {
//       return res.status(400).json({ success: false, message: "Already refunded" });
//     }

//     // ✅ 24h limit check
//     const hoursPassed =
//       (Date.now() - new Date(payment.createdAt).getTime()) / 1000 / 60 / 60;
//     if (hoursPassed > 24) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Refund period expired (24h)" });
//     }

//     // ✅ Razorpay refund only if paymentId exists
//     let refundInfo = null;
//     if (payment.paymentId) {
//       try {
//         refundInfo = await razorpay.payments.refund(payment.paymentId, {
//           amount: payment.amount * 100, // Razorpay expects paisa
//         });
//       } catch (err) {
//         console.error("[Razorpay refund error]", err.message);
//         return res.status(500).json({
//           success: false,
//           message: "Razorpay refund failed",
//           error: err.message,
//         });
//       }
//     }

//     // ✅ Mark as refunded
//     payment.status = "refunded";
//     await payment.save();

//     return res.json({
//       success: true,
//       message: payment.paymentId
//         ? "Payment refunded successfully"
//         : "Order canceled successfully (no Razorpay refund needed)",
//       order_id: payment.order_id || payment.razorpayOrderId,
//       refund_id: refundInfo?.id || null,
//       refund_status: refundInfo?.status || "refunded",
//       amount: payment.amount,
//       currency: payment.currency,
//     });
//   } catch (err) {
//     console.error("[refundPayment] error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Refund failed",
//       error: err.message,
//     });
//   }
// };



// ================================
// 🔹 GET ALL PAYMENTS
// ================================

// export const refundPayment = async (req, res) => {
//   try {
//     const { order_id, payment_id, token } = req.body;

//     if (!order_id)
//       return res.status(400).json({ success: false, message: "Order ID required" });
//     if (!payment_id)
//       return res.status(400).json({ success: false, message: "Payment ID required" });
//     if (!token)
//       return res.status(400).json({ success: false, message: "reCAPTCHA token required" });

//     // ✅ Verify reCAPTCHA
//     const secretKey = process.env.RECAPTCHA_SECRET_KEY;
//     if (!secretKey)
//       return res.status(500).json({ success: false, message: "reCAPTCHA secret missing" });

//     const captchaRes = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
//     );
//     if (!captchaRes.data.success) {
//       return res.status(400).json({ success: false, message: "Captcha verification failed" });
//     }

//     // ✅ Find payment by MongoDB _id or fallback to razorpayOrderId
//     let payment = await Payment.findOne({
//       $or: [{ _id: payment_id }, { razorpayOrderId: order_id }],
//     });

//     if (!payment)
//       return res.status(404).json({ success: false, message: "Payment not found" });

//     if (payment.status === "refunded") {
//       return res.status(400).json({ success: false, message: "Already refunded" });
//     }

//     // ✅ 24h limit check
//     const hoursPassed =
//       (Date.now() - new Date(payment.createdAt).getTime()) / 1000 / 60 / 60;
//     if (hoursPassed > 24) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Refund period expired (24h)" });
//     }

//     // ✅ Razorpay refund only if paymentId exists
//     let refundInfo = null;
//     if (payment.razorpayPaymentId) {
//       try {
//         refundInfo = await razorpay.payments.refund(payment.razorpayPaymentId, {
//           amount: payment.amount * 100, // Razorpay expects paisa
//         });
//       } catch (err) {
//         console.error("[Razorpay refund error]", err.message);
//         return res.status(500).json({
//           success: false,
//           message: "Razorpay refund failed",
//           error: err.message,
//         });
//       }
//     }

//     // ✅ Mark as refunded
//     payment.status = "refunded";
//     await payment.save();

//     return res.json({
//       success: true,
//       message: payment.razorpayPaymentId
//         ? "Payment refunded successfully"
//         : "Order canceled successfully (no Razorpay refund needed)",
//       order_id: payment.order_id || payment.razorpayOrderId,
//       refund_id: refundInfo?.id || null,
//       refund_status: refundInfo?.status || "refunded",
//       amount: payment.amount,
//       currency: payment.currency,
//     });
//   } catch (err) {
//     console.error("[refundPayment] error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Refund failed",
//       error: err.message,
//     });
//   }
// };


// export const refundPayment = async (req, res) => {
//   try {
//     const { order_id, payment_id } = req.body;

//     if (!order_id)
//       return res.status(400).json({ success: false, message: "Order ID required" });
//     if (!payment_id)
//       return res.status(400).json({ success: false, message: "Payment ID required" });

//     // ✅ Find payment by MongoDB _id or fallback to razorpayOrderId
//     let payment = await Payment.findOne({
//       $or: [{ _id: payment_id }, { razorpayOrderId: order_id }],
//     });

//     if (!payment)
//       return res.status(404).json({ success: false, message: "Payment not found" });

//     if (payment.status === "refunded") {
//       return res.status(400).json({ success: false, message: "Already refunded" });
//     }

//     // ✅ 24h limit check
//     const hoursPassed =
//       (Date.now() - new Date(payment.createdAt).getTime()) / 1000 / 60 / 60;
//     if (hoursPassed > 24) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Refund period expired (24h)" });
//     }

//     // ✅ Razorpay refund only if paymentId exists
//     let refundInfo = null;
//     if (payment.razorpayPaymentId) {
//       try {
//         refundInfo = await razorpay.payments.refund(payment.razorpayPaymentId, {
//           amount: payment.amount * 100, // Razorpay expects paisa
//         });
//       } catch (err) {
//         console.error("[Razorpay refund error]", err.message);
//         return res.status(500).json({
//           success: false,
//           message: "Razorpay refund failed",
//           error: err.message,
//         });
//       }
//     }

//     // ✅ Mark as refunded
//     payment.status = "refunded";
//     await payment.save();

//     return res.json({
//       success: true,
//       message: payment.razorpayPaymentId
//         ? "Payment refunded successfully"
//         : "Order canceled successfully (no Razorpay refund needed)",
//       order_id: payment.order_id || payment.razorpayOrderId,
//       refund_id: refundInfo?.id || null,
//       refund_status: refundInfo?.status || "refunded",
//       amount: payment.amount,
//       currency: payment.currency,
//     });
//   } catch (err) {
//     console.error("[refundPayment] error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Refund failed",
//       error: err.message,
//     });
//   }
// };


// export const refundPayment = async (req, res) => {
//   try {
//     const { order_id, payment_id, token } = req.body;
//     if (!order_id || !payment_id || !token) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Order ID, Payment ID & Captcha token required" });
//     }

//     // ---- CAPTCHA VERIFY ----
//     const secret = process.env.RECAPTCHA_SECRET;
//     const captchaVerify = await axios.post(
//       `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
//     );

//     if (!captchaVerify.data.success) {
//       return res.status(400).json({ success: false, message: "Captcha verification failed" });
//     }

//     // ---- FIND PAYMENT ----
//     const payment = await Payment.findOne({ _id: payment_id, order_id });
//     if (!payment) {
//       return res.status(404).json({ success: false, message: "Payment not found" });
//     }

//     if (payment.status === "refunded") {
//       return res.status(400).json({ success: false, message: "Already refunded" });
//     }

//     // ---- 24h CHECK ----
//     const hoursPassed =
//       (Date.now() - new Date(payment.createdAt).getTime()) / 1000 / 60 / 60;
//     if (hoursPassed > 24) {
//       return res.status(400).json({ success: false, message: "Refund period expired (24h)" });
//     }

//     // ---- REFUND WITH RAZORPAY ----
//     let refundInfo = null;
//     if (payment.razorpayPaymentId) {
//       refundInfo = await razorpay.payments.refund(payment.razorpayPaymentId, {
//         amount: payment.amount * 100,
//       });
//     }

//     // ---- UPDATE PAYMENT ----
//     payment.status = "refunded";
//     await payment.save();

//     // ---- CANCEL ORDER IN DATABASE ----
//     const order = await Order.findById(order_id);
//     if (order) {
//       order.status = "cancelled";
//       await order.save();  // <- DB में update होगा
//     }

//     return res.json({
//       success: true,
//       message: "Payment refunded & order cancelled successfully",
//       order_id: payment.order_id,
//       refund_id: refundInfo?.id || null,
//       refund_status: refundInfo?.status || "refunded",
//       amount: payment.amount,
//       currency: payment.currency,
//       order_status: order?.status || "cancelled",
//     });
//   } catch (err) {
//     console.error("[refundPayment] error:", err);
//     return res
//       .status(500)
//       .json({ success: false, message: "Refund failed", error: err.message });
//   }
// };

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



