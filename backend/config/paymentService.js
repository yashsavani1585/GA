// import Razorpay from "razorpay";
// import crypto from "crypto";
// import Order from "../models/orderModel.js";

// // ✅ Initialize Razorpay Instance (safe globally)
// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_z8VHG8l7lxwyLF",
//   key_secret: process.env.RAZORPAY_KEY_SECRET || "YOUR_RAZORPAY_SECRET_KEY",
// });

// /**
//  * ✅ Generate Razorpay Payment Link (for auctions)
//  * Returns a frontend redirect link that opens the checkout screen.
//  */
// export const generatePaymentLink = async ({ amount, auctionId, userId, productName }) => {
//   try {
//     // --- 🧩 Validation ---
//     if (!amount || !auctionId || !userId || !productName) {
//       throw new Error("amount, auctionId, userId, productName are required");
//     }

//     const amountInPaise = Math.round(amount * 100);
//     const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

//     // --- ⚙️ Mock Mode for Development (No Razorpay Key or in dev) ---
//     if (
//       !process.env.RAZORPAY_KEY_ID ||
//       !process.env.RAZORPAY_KEY_SECRET ||
//       process.env.NODE_ENV === "development"
//     ) {
//       const mockPaymentId = `MOCK_PAY_${Date.now()}`;
//       console.log("⚙️ Mock mode enabled — skipping real Razorpay order creation.");

//       // Save mock order in DB
//        await Order.create({
//       userId,
//       auctionId,
//       isAuctionOrder: true,
//       amount,
//       paymentMethod: "Razorpay",
//       razorpayOrderId: order.id,
//       winnerBidAmount: amount,
//       status: "Order Placed",
//       items: [
//         {
//           productId: auctionId,
//           name: productName,
//           quantity: 1,
//           price: amount,
//         },
//       ],
//     });

//       return `${frontendURL}/mock-payment?paymentId=${mockPaymentId}&amount=${amount}&auctionId=${auctionId}&product=${encodeURIComponent(
//         productName
//       )}`;
//     }

//     // --- 💰 Create Real Razorpay Order ---
//     const order = await razorpayInstance.orders.create({
//       amount: amountInPaise,
//       currency: "INR",
//       receipt: `RCPT_${auctionId}_${userId}_${Date.now()}`.slice(0, 40),
//       notes: { auctionId, userId, productName },
//     });

//     console.log("✅ Razorpay order created:", order.id);

//     // --- 🧾 Save Order in Database ---
//     await Order.create({
//       userId,
//       auctionId,
//       productName,
//       amount,
//       razorpay_order_id: order.id,
//       paymentStatus: "pending",
//       orderStatus: "processing",
//     });

//     // --- 🔗 Return Checkout Redirect Link ---
//     return `${frontendURL}/checkout?order_id=${order.id}&amount=${amount}&product=${encodeURIComponent(
//       productName
//     )}`;
//   } catch (err) {
//     console.error("❌ Error generating Razorpay payment link:", err);

//     const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
//     const fallbackId = `FALLBACK_PAY_${Date.now()}`;

//     // --- 🧩 Save fallback mock order ---
//     await Order.create({
//       userId,
//       auctionId,
//       productName,
//       amount,
//       paymentStatus: "failed",
//       orderStatus: "error",
//     });

//     // --- 🛠️ Redirect to Mock Payment Page ---
//     return `${frontendURL}/mock-payment?paymentId=${fallbackId}&amount=${amount}&auctionId=${auctionId}&product=${encodeURIComponent(
//       productName
//     )}`;
//   }
// };


// /**
//  * ✅ Verify Razorpay Payment Signature
//  * (Called after payment success)
//  */
// export const verifyPayment = async ({
//   razorpay_order_id,
//   razorpay_payment_id,
//   razorpay_signature,
// }) => {
//   try {
//     // --- 🔍 Validate Inputs ---
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       throw new Error("Missing Razorpay payment details");
//     }

//     // --- ⚙️ Dev Mode Shortcut ---
//     if (process.env.NODE_ENV === "development") {
//       console.log("⚙️ Mock verification success (dev mode)");
//       return {
//         success: true,
//         status: "captured",
//         paymentId: razorpay_payment_id,
//       };
//     }

//     // --- ✅ Verify HMAC Signature ---
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (generatedSignature === razorpay_signature) {
//       console.log("✅ Payment verified successfully!");
//       return {
//         success: true,
//         status: "verified",
//         paymentId: razorpay_payment_id,
//       };
//     } else {
//       console.warn("❌ Invalid payment signature!");
//       return {
//         success: false,
//         status: "invalid_signature",
//       };
//     }
//   } catch (error) {
//     console.error("❌ Error verifying Razorpay payment:", error);

//       const updatedOrder = await Order.findOneAndUpdate(
//       { razorpayOrderId: razorpay_order_id },
//       {
//         payment: true,
//         paymentId: razorpay_payment_id,
//         status: "Processing",
//       },
//       { new: true }
//     );

//     console.log("✅ Payment verified and order updated:", updatedOrder._id);

//     return {
//       success: true,
//       status: "verified",
//       order: updatedOrder,
//     };

//     if (process.env.NODE_ENV === "development") {
//       return {
//         success: true,
//         status: "mock_verified",
//         paymentId: razorpay_payment_id,
//       };
//     }

//     throw error;
//   }
// };

// controllers/paymentController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from '../models/orderModel.js';
import { v4 as uuidv4 } from "uuid";
import Auction from "../models/auctionModel.js";
import Payment2 from "../models/Payment2.js"; // ✅ for reference

// const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, FRONTEND_URL } = process.env;

// // Initialize Razorpay
// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_z8VHG8l7lxwyLF",
//   key_secret: process.env.RAZORPAY_KEY_SECRET || "YOUR_RAZORPAY_SECRET_KEY",
// });

/**
 * Generate Razorpay payment link / order for an auction winner.
 * Returns an object { success, checkoutUrl, orderDb }
 *
 * - amount: number (INR, e.g. 1250.5)
 * - auctionId: string
 * - userId: string
 * - productName: string
 */
// export const generatePaymentLink = async ({
//   amount,
//   auctionId,
//   userId,
//   productName,
//   productImage,
//   userName,
//   userEmail,
// }) => {
//   try {
//     // 🧠 Validate required data
//     if (!amount || !auctionId || !userId || !productName) {
//       return { success: false, error: "amount, auctionId, userId, productName are required" };
//     }

//     const amountNum = Number(amount);
//     if (Number.isNaN(amountNum) || amountNum <= 0) {
//       return { success: false, error: "Invalid amount" };
//     }

//     const amountInPaise = Math.round(amountNum * 100);
//     const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

//     // 🧩 Common order data
//     const baseOrderData = {
//       userId,
//       auctionId,
//       isAuctionOrder: true,
//       winnerName: userName || "Unknown Winner",
//       winnerEmail: userEmail || "",
//       winnerBidAmount: amountNum,
//       amount: amountNum,
//       auctionImage: productImage || "/assets/images/default-auction.jpg",
//       payment: false,
//       status: "Order Placed",
//       paymentMethod: "Razorpay",
//       items: [
//         {
//           productId: auctionId,
//           name: productName,
//           quantity: 1,
//           price: amountNum,
//           image: productImage || "/assets/images/default-auction.jpg",
//         },
//       ],
//     };

//     // --------------------------------------------------------
//     // 🔹 1. MOCK MODE (No Razorpay API / Dev)
//     // --------------------------------------------------------
//     if (
//       !process.env.RAZORPAY_KEY_ID ||
//       !process.env.RAZORPAY_KEY_SECRET ||
//       process.env.NODE_ENV === "development"
//     ) {
//       const mockPaymentId = `MOCK_PAY_${uuidv4()}`;

//       const mockOrderDoc = await Order.create({
//         ...baseOrderData,
//         paymentMethod: "Mock",
//         razorpayOrderId: null,
//       });

//       const checkoutUrl = `${frontendURL}/mock-payment?paymentId=${mockPaymentId}&orderDbId=${
//         mockOrderDoc._id
//       }&amount=${amountNum}&auctionId=${auctionId}&product=${encodeURIComponent(
//         productName
//       )}`;

//       return {
//         success: true,
//         mode: "mock",
//         checkoutUrl,
//         orderDb: mockOrderDoc,
//       };
//     }

//     // --------------------------------------------------------
//     // 🔹 2. REAL RAZORPAY MODE
//     // --------------------------------------------------------
//     const rzpOrder = await razorpayInstance.orders.create({
//       amount: amountInPaise,
//       currency: "INR",
//       receipt: `RCPT_${auctionId}_${userId}_${Date.now()}`.slice(0, 40),
//       notes: { auctionId, userId, productName },
//     });

//     const orderDoc = await Order.create({
//       ...baseOrderData,
//       razorpayOrderId: rzpOrder.id,
//     });

//     const checkoutUrl = `${frontendURL}/checkout?order_id=${encodeURIComponent(
//       rzpOrder.id
//     )}&orderDbId=${orderDoc._id}&amount=${amountNum}&product=${encodeURIComponent(
//       productName
//     )}`;

//     return {
//       success: true,
//       mode: "razorpay",
//       checkoutUrl,
//       rzpOrder,
//       orderDb: orderDoc,
//     };
//   } catch (err) {
//     console.error("❌ generatePaymentLink error:", err);

//     // fallback record in DB for failed creation
//     try {
//       const fallback = await Order.create({
//         userId: userId || "unknown",
//         auctionId: auctionId || null,
//         isAuctionOrder: true,
//         amount: amount || 0,
//         paymentMethod: "Razorpay",
//         payment: false,
//         status: "Canceled",
//         items: [
//           {
//             productId: auctionId || "unknown",
//             name: productName || "unknown",
//             quantity: 1,
//             price: amount || 0,
//             image: productImage || "/assets/images/default-auction.jpg",
//           },
//         ],
//       });

//       const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
//       const fallbackUrl = `${frontendURL}/mock-payment?paymentId=FALLBACK_${Date.now()}&orderDbId=${fallback._id}`;

//       return {
//         success: false,
//         error: err.message || "Failed to create payment link",
//         fallbackUrl,
//         fallbackOrder: fallback,
//       };
//     } catch (innerErr) {
//       console.error("❌ Fallback creation failed:", innerErr);
//       return { success: false, error: err.message || "Critical error" };
//     }
//   }
// };

// export const generatePaymentLink = async ({
//   amount,
//   auctionId,
//   userId,
//   productName,
//   productImage,
//   userName,
//   userEmail,
// }) => {
//   try {
//     if (!amount || !auctionId || !userId || !productName) {
//       return { success: false, error: "Missing required fields" };
//     }

//     const amountNum = Number(amount);
//     if (Number.isNaN(amountNum) || amountNum <= 0) {
//       return { success: false, error: "Invalid amount" };
//     }

//     const amountInPaise = Math.round(amountNum * 100);
//     const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

//     const items = [
//       {
//         productId: auctionId,
//         name: productName,
//         quantity: 1,
//         price: amountNum,
//         image: productImage || "/assets/images/default-auction.jpg",
//       },
//     ];

//     const baseOrderData = {
//       userId,
//       auctionId,
//       order_id: `ORDER_${Date.now()}`, // ✅ FIX ADDED
//       isAuctionOrder: true,
//       winnerName: userName || "Unknown User",
//       winnerEmail: userEmail || "",
//       winnerBidAmount: amountNum,
//       amount: amountNum,
//       auctionImage: productImage,
//       payment: false,
//       status: "Order Placed",
//       paymentMethod: "Razorpay",
//       items,
//     };

//     if (
//       !process.env.RAZORPAY_KEY_ID ||
//       !process.env.RAZORPAY_KEY_SECRET ||
//       process.env.NODE_ENV === "development"
//     ) {
//       const mockPaymentId = `MOCK_${Date.now()}`;

//       const mockOrderDoc = await Order.create({
//         ...baseOrderData,
//         paymentMethod: "Mock",
//         razorpayOrderId: null,
//       });

//       const checkoutUrl = `${frontendURL}/mock-payment?paymentId=${mockPaymentId}&orderDbId=${mockOrderDoc._id}`;

//       return {
//         success: true,
//         mode: "mock",
//         checkoutUrl,
//         orderDb: mockOrderDoc,
//       };
//     }

//     // ✅ REAL RAZORPAY
//     const rzpOrder = await razorpayInstance.orders.create({
//       amount: amountInPaise,
//       currency: "INR",
//       receipt: `RCPT_${auctionId}_${userId}_${Date.now()}`.slice(0, 40),
//       notes: { auctionId, userId, productName },
//     });

//     const orderDoc = await Order.create({
//       ...baseOrderData,
//       razorpayOrderId: rzpOrder.id,
//     });

//     const checkoutUrl = `${frontendURL}/checkout?order_id=${rzpOrder.id}&orderDbId=${orderDoc._id}`;

//     return {
//       success: true,
//       mode: "razorpay",
//       checkoutUrl,
//       rzpOrder,
//       orderDb: orderDoc,
//     };
//   } catch (err) {
//     console.error("generatePaymentLink error:", err);
//     return { success: false, error: err.message };
//   }
// };

// export const generatePaymentLink = async ({
//   amount,
//   auctionId,
//   userId,
//   productName,
//   productImage,
//   userName,
//   userEmail,
// }) => {
//   try {
//     if (!amount || !auctionId || !userId || !productName) {
//       return { success: false, error: "Missing required fields" };
//     }

//     const amountNum = Number(amount);
//     if (isNaN(amountNum) || amountNum <= 0) {
//       return { success: false, error: "Invalid amount" };
//     }

//     const amountInPaise = Math.round(amountNum * 100);
//     const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

//     // ✅ Try to fetch image from Auction model if productImage missing
//     let auctionImage = productImage;
//     if (!auctionImage) {
//       const auction = await Auction.findById(auctionId).select("image productImage mainImage");
//       auctionImage =
//         auction?.image ||
//         auction?.productImage ||
//         auction?.mainImage ||
//         "https://placehold.co/600x600?text=No+Image";
//     }

//     // ✅ Order Base data
//     const orderBase = {
//       userId,
//       auctionId,
//       order_id: `ORDER_${Date.now()}`,
//       productName,
//       winnerName: userName || "Unknown User",
//       winnerEmail: userEmail || "",
//       amount: amountNum,
//       winnerBidAmount: amountNum,
//       auctionImage, // ✅ fixed image source
//       payment: false,
//       paymentStatus: "PENDING",
//       deliveryStatus: "Order Placed",
//       paymentMethod: "Razorpay",
//       isAuctionOrder: true,
//       items: [
//         {
//           productId: auctionId,
//           name: productName,
//           quantity: 1,
//           price: amountNum,
//           image: auctionImage, // ✅ ensure every item has image
//         },
//       ],
//     };

//     // ✅ Create Razorpay Order
//     const rzpOrder = await razorpayInstance.orders.create({
//       amount: amountInPaise,
//       currency: "INR",
//       receipt: `RCPT_${Date.now().toString().slice(-8)}`,
//       notes: { auctionId, userId, productName },
//     });

//     // ✅ Save to DB
//     const orderDb = await Order.create({
//       ...orderBase,
//       razorpayOrderId: rzpOrder.id,
//     });

//     const checkoutUrl = `${frontendURL}/checkout?order_id=${rzpOrder.id}&amount=${amountNum}&product=${encodeURIComponent(
//       productName
//     )}`;

//     return {
//       success: true,
//       mode: "razorpay",
//       checkoutUrl,
//       rzpOrder,
//       orderDb,
//     };
//   } catch (err) {
//     console.error("generatePaymentLink error:", err);
//     return { success: false, error: err.message };
//   }
// };

// export const generatePaymentLink = async ({
//   amount,
//   auctionId,
//   userId,
//   productName,
//   productImage,
//   userName,
//   userEmail,
//   address, // ✅ new object { fullName, line1, city, state, pincode, mobile }
// }) => {
//   try {
//     // 🔹 Validate required fields
//     if (!amount || !auctionId || !userId || !productName) {
//       return { success: false, error: "Missing required fields" };
//     }

//     const amountNum = Number(amount);
//     if (isNaN(amountNum) || amountNum <= 0) {
//       return { success: false, error: "Invalid amount" };
//     }

//     const amountInPaise = Math.round(amountNum * 100);
//     const frontendURL = FRONTEND_URL || "http://localhost:5173";

//     // 🔹 Try to get product image if missing
//     let finalImage = productImage;
//     if (!finalImage) {
//       const auction = await Auction.findById(auctionId).select("image productImage mainImage");
//       finalImage =
//         auction?.image ||
//         auction?.productImage ||
//         auction?.mainImage ||
//         "https://placehold.co/600x600?text=No+Image";
//     }

//     // 🔹 Create Razorpay Order
//     const rzpOrder = await razorpayInstance.orders.create({
//       amount: amountInPaise,
//       currency: "INR",
//       receipt: `RCPT_${Date.now()}`,
//       notes: {
//         auctionId,
//         userId,
//         productName,
//         userEmail,
//         userName,
//       },
//     });

//     // 🔹 Create Payment2 entry
//     const paymentDoc = await Payment2.create({
//       userId,
//       order_id: `ORDER_${Date.now()}`,
//       razorpayOrderId: rzpOrder.id,
//       amount: amountNum,
//       currency: "INR",
//       status: "PENDING",
//       auctionImage: finalImage,
//       productImage: finalImage,
//       items: [
//         {
//           productId: auctionId,
//           name: productName,
//           quantity: 1,
//           price: amountNum,
//           image: finalImage,
//         },
//       ],
//       address: {
//         fullName: address?.fullName || userName,
//         line1: address?.line1 || "",
//         city: address?.city || "",
//         state: address?.state || "",
//         pincode: address?.pincode || "",
//       },
//       mobile: address?.mobile || "",
//       providerResponse: rzpOrder,
//     });

//     // 🔹 Checkout URL for frontend
//     const checkoutUrl = `${frontendURL}/checkout?order_id=${rzpOrder.id}&amount=${amountNum}&auction=${auctionId}`;

//     return {
//       success: true,
//       mode: "razorpay",
//       checkoutUrl,
//       razorpayOrder: rzpOrder,
//       paymentDoc,
//     };
//   } catch (err) {
//     console.error("❌ generatePaymentLink error:", err);
//     return { success: false, error: err.message };
//   }
// };

const {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  FRONTEND_URL,
} = process.env;

// ✅ Validate envs
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error("❌ Missing Razorpay credentials in .env file");
}

// ✅ Initialize Razorpay instance
export const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID || "rzp_test_z8VHG8l7lxwyLF",
  key_secret: RAZORPAY_KEY_SECRET || "YOUR_RAZORPAY_SECRET_KEY",
});

/**
 * =======================================================
 * 💳 GENERATE PAYMENT LINK (WITH ADDRESS SUPPORT)
 * =======================================================
 */
export const generatePaymentLink = async ({
  auctionId,
  userId,
  address,
}) => {
  try {
    if (!auctionId || !userId) {
      return { success: false, error: "Missing auctionId or userId" };
    }

    // 🔹 Get auction & user info
    const auction = await Auction.findById(auctionId)
      .populate("highestBidder", "name email _id")
      .lean();
    if (!auction) return { success: false, error: "Auction not found" };

    const amountNum = Number(auction.currentPrice);
    if (isNaN(amountNum) || amountNum <= 0)
      return { success: false, error: "Invalid auction amount" };

    const productName = auction.productName || "Auction Item";
    const productImage =
      auction.image ||
      auction.productImage ||
      auction.mainImage ||
      "https://placehold.co/600x600?text=No+Image";

    const user =
      auction.highestBidder ||
      (await User.findById(userId).select("name email").lean());

    const userName = user?.name || "Auction User";
    const userEmail = user?.email || "user@example.com";

    // 🔹 Razorpay order
    const rzpOrder = await razorpayInstance.orders.create({
      amount: Math.round(amountNum * 100),
      currency: "INR",
      receipt: `RCPT_${Date.now()}`,
      notes: { auctionId, userId, productName, userEmail, userName },
    });

    // 🔹 Save Payment2 entry
    const paymentDoc = await Payment2.create({
      userId,
      order_id: `ORDER_${Date.now()}`,
      razorpayOrderId: rzpOrder.id,
      amount: amountNum,
      currency: "INR",
      status: "PENDING",
      auctionImage: productImage,
      items: [
        {
          productId: auctionId,
          name: productName,
          quantity: 1,
          price: amountNum,
          image: productImage,
        },
      ],
      address: {
        fullName: address?.fullName || userName,
        line1: address?.line1 || "",
        city: address?.city || "",
        state: address?.state || "",
        pincode: address?.pincode || "",
      },
      mobile: address?.mobile || "",
      providerResponse: rzpOrder,
    });

    const checkoutUrl = `${FRONTEND_URL}/checkout?order_id=${rzpOrder.id}&auction=${auctionId}&product=${encodeURIComponent(
      productName
    )}&amount=${amountNum}`;

    return {
      success: true,
      message: "Payment link generated successfully",
      checkoutUrl,
      orderDb: paymentDoc,
      amount: amountNum,
      productName,
      userName,
      userEmail,
    };
  } catch (err) {
    console.error("❌ generatePaymentLink error:", err);
    return { success: false, error: err.message };
  }
};







/**
 * Verify Razorpay payment signature and update order in DB.
 * Accepts an object with:
 *  - razorpay_order_id
 *  - razorpay_payment_id
 *  - razorpay_signature
 *  - (optional) orderDbId  <-- recommended: pass DB id returned when creating order
 *
 * Returns { success: boolean, message?, order? }
 */
export const verifyPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  orderDbId,
}) => {
  try {
    // 🧩 Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return { success: false, error: "Missing Razorpay payment details" };
    }

    // ⚙️ Dev mode: skip signature verification
    if (process.env.NODE_ENV === "development") {
      let devOrder = null;

      if (orderDbId) {
        devOrder = await Order.findByIdAndUpdate(
          orderDbId,
          {
            payment: true,
            paymentId: razorpay_payment_id,
            razorpayPaymentId: razorpay_payment_id,
            status: "Processing",
          },
          { new: true }
        );
      } else {
        devOrder = await Order.findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id },
          {
            payment: true,
            paymentId: razorpay_payment_id,
            razorpayPaymentId: razorpay_payment_id,
            status: "Processing",
          },
          { new: true }
        );
      }

      console.log("✅ Dev payment verified:", devOrder?._id || "not found");
      return { success: true, message: "Dev: payment accepted", order: devOrder };
    }

    // 🧾 Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("❌ Invalid signature for payment", { razorpay_order_id });
      return { success: false, error: "Invalid payment signature" };
    }

    // ✅ Signature valid: update order
    let updatedOrder = null;

    if (orderDbId) {
      updatedOrder = await Order.findByIdAndUpdate(
        orderDbId,
        {
          payment: true,
          paymentId: razorpay_payment_id,
          razorpayPaymentId: razorpay_payment_id,
          status: "Processing",
        },
        { new: true }
      );
    } else {
      updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          payment: true,
          paymentId: razorpay_payment_id,
          razorpayPaymentId: razorpay_payment_id,
          status: "Processing",
        },
        { new: true }
      );
    }

    if (!updatedOrder) {
      console.warn("⚠️ Payment verified but order not found:", { razorpay_order_id });
      return {
        success: true,
        message: "Signature valid but order not found in DB",
        order: null,
      };
    }

    console.log("✅ Payment verified and order updated:", updatedOrder._id);
    return { success: true, message: "Payment verified", order: updatedOrder };
  } catch (err) {
    console.error("❌ verifyPayment error:", err);
    return { success: false, error: err.message || "Verification failed" };
  }
};


// export default { , verifyPayment };
