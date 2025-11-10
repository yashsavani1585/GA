

// import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// const orderSchema = new mongoose.Schema(
//   {
//     userId: { type: String, required: true },
//     order_id: { type: String, default: () => uuidv4(), unique: true },
//     items: [
//       {
//         productId: { type: String, required: true },
//         name: { type: String, required: true },
//         quantity: { type: Number, required: true, default: 1 },
//         price: { type: Number, required: true },
//         image: { type: String },
//       },
//     ],
//     amount: { type: Number, required: true },
//     address: {
//       deliveryType: { type: String },
//       recipientName: { type: String },
//       recipientMobile: { type: String },
//       pincode: { type: String },
//       houseNo: { type: String },
//       street: { type: String },
//       locality: { type: String },
//       landmark: { type: String },
//       gstNumber: { type: String },
//     },
//     status: {
//       type: String,
//       enum: [
//         "Order Placed",
//         "Processing",
//         "Quality Check",
//         "Packing",
//         "Shipped",
//         "Out for Delivery",
//         "Delivered",
//         "Canceled" // 🟢 cancel ka option add
//       ],
//       default: "Order Placed",
//     },
//     paymentMethod: { type: String, required: true }, // e.g., 'Razorpay'
//     payment: { type: Boolean, default: false },
//     paymentId: { type: String, index: true }, // internal reference or Razorpay payment ID
//     razorpayPaymentId: { type: String },
//     razorpayOrderId: { type: String },

//     // 🟢 New Fields
//     isCanceled: { type: Boolean, default: false },
//     isRefunded: { type: Boolean, default: false },
//     refundId: { type: String }, // Razorpay Refund ID if available
//   },
//   { timestamps: true }
// );

// const Order = mongoose.models.order || mongoose.model("order", orderSchema);

// export default Order;

// import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// // 🧾 Define Order Schema
// const orderSchema = new mongoose.Schema(
//   {
//     // 🧩 Basic Info
//     userId: { type: String, required: true },
//     order_id: { type: String, default: () => uuidv4(), unique: true },

//     // 🧠 Auction Support
//     auctionId: { type: String }, // related auction ID (if order came from auction)
//     isAuctionOrder: { type: Boolean, default: false },
//     winnerName: { type: String },
//     winnerEmail: { type: String },
//     winnerBidAmount: { type: Number },

//     // 🛒 Items
//     items: [
//       {
//         productId: { type: String, required: true },
//         name: { type: String, required: true },
//         quantity: { type: Number, required: true, default: 1 },
//         price: { type: Number, required: true },
//         image: { type: String },
//       },
//     ],

//     // 💰 Payment / Amount
//     amount: { type: Number, required: true },
//     paymentMethod: { type: String, required: true }, // e.g. Razorpay, COD, etc.
//     payment: { type: Boolean, default: false },
//     paymentId: { type: String, index: true },
//     razorpayPaymentId: { type: String },
//     razorpayOrderId: { type: String },

//     // 📦 Address / Delivery Info
//     address: {
//       deliveryType: { type: String },
//       recipientName: { type: String },
//       recipientMobile: { type: String },
//       pincode: { type: String },
//       houseNo: { type: String },
//       street: { type: String },
//       locality: { type: String },
//       landmark: { type: String },
//       gstNumber: { type: String },
//     },

//     // 🚚 Order Status Tracking
//     status: {
//       type: String,
//       enum: [
//         "Order Placed",
//         "Processing",
//         "Quality Check",
//         "Packing",
//         "Shipped",
//         "Out for Delivery",
//         "Delivered",
//         "Canceled",
//       ],
//       default: "Order Placed",
//     },

//     // 🟢 Cancel / Refund
//     isCanceled: { type: Boolean, default: false },
//     isRefunded: { type: Boolean, default: false },
//     refundId: { type: String },

//     // 🧾 Admin / System Notes
//     adminNote: { type: String },
//     deliveryDate: { type: Date },
//     auctionImage: { type: String }, // image of auction product
//     finalPrice: { type: Number },

//   },
//   { timestamps: true }
// );

// // ✅ Prevent model overwrite errors in development
// const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

// export default Order;

// import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// const orderSchema = new mongoose.Schema(
//   {
//     // 🧩 Basic Info
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     order_id: { type: String, default: () => uuidv4(), unique: true },

//     // 🧠 Auction Support
//     auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
//     isAuctionOrder: { type: Boolean, default: false },
//     winnerName: { type: String },
//     winnerEmail: { type: String },
//     winnerBidAmount: { type: Number },

//     // 🛒 Items
//     items: [
//       {
//         productId: { type: String, required: true },
//         name: { type: String, required: true },
//         quantity: { type: Number, required: true, default: 1 },
//         price: { type: Number, required: true },
//         image: { type: String },
//       },
//     ],

//     // 💰 Payment / Amount
//     amount: { type: Number, required: true },
//     paymentMethod: { type: String, default: "Razorpay" },
//     payment: { type: Boolean, default: false },
//     paymentId: { type: String },
//     razorpayPaymentId: { type: String },
//     razorpayOrderId: { type: String },
//     razorpaySignature: { type: String },
//     paymentStatus: {
//       type: String,
//       enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
//       default: "PENDING",
//     },

//     // 📦 Address / Delivery Info
//     address: {
//       deliveryType: { type: String },
//       recipientName: { type: String },
//       recipientMobile: { type: String },
//       pincode: { type: String },
//       houseNo: { type: String },
//       street: { type: String },
//       locality: { type: String },
//       landmark: { type: String },
//       gstNumber: { type: String },
//     },

//     // 🚚 Order Status Tracking
//     status: {
//       type: String,
//       enum: [
//         "Order Placed",
//         "Processing",
//         "Quality Check",
//         "Packing",
//         "Shipped",
//         "Out for Delivery",
//         "Delivered",
//         "Canceled",
//       ],
//       default: "Order Placed",
//     },

//     // 🟢 Cancel / Refund
//     isCanceled: { type: Boolean, default: false },
//     isRefunded: { type: Boolean, default: false },
//     refundId: { type: String },

//     // 🧾 Admin / System Notes
//     adminNote: { type: String },
//     deliveryDate: { type: Date },

//     // 🎨 Product Visuals
//     auctionImage: { type: String },
//     finalPrice: { type: Number },

//     // 🔗 Payment reference (to Payment2)
//     paymentRef: { type: mongoose.Schema.Types.ObjectId, ref: "Payment2" },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
// export default Order;

// import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// /**
//  * ============================================================
//  * 🧾 ORDER MODEL — Supports Auctions, Payments, Addresses, Refunds
//  * ============================================================
//  */
// const orderSchema = new mongoose.Schema(
//   {
//     // 🧩 USER INFO
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },
//     order_id: { type: String, default: () => uuidv4(), unique: true },

//     // 🧠 AUCTION SUPPORT
//     auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
//     isAuctionOrder: { type: Boolean, default: false },
//     winnerName: { type: String },
//     winnerEmail: { type: String },
//     winnerBidAmount: { type: Number },

//     // 🛍️ ORDER ITEMS
//     items: [
//       {
//         productId: { type: String, required: true },
//         name: { type: String, required: true },
//         quantity: { type: Number, default: 1 },
//         price: { type: Number, required: true },
//         image: {
//           type: String,
//           default: "https://placehold.co/600x600?text=No+Image",
//         },
//       },
//     ],

//     // 💰 PAYMENT INFO
//     amount: { type: Number, required: true },
//     paymentMethod: {
//       type: String,
//       enum: ["Razorpay", "COD", "Stripe", "Manual"],
//       default: "Razorpay",
//     },
//     payment: { type: Boolean, default: false },
//     paymentId: { type: String },
//     razorpayPaymentId: { type: String },
//     razorpayOrderId: { type: String },
//     razorpaySignature: { type: String },
//     paymentStatus: {
//       type: String,
//       enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
//       default: "PENDING",
//     },

//     // 🔗 DYNAMIC PAYMENT REFERENCE
//     paymentRef: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: "paymentRefModel",
//     },
//     paymentRefModel: {
//       type: String,
//       enum: ["Payment", "Payment2"],
//       default: "Payment2",
//     },

//     // 🏠 DELIVERY ADDRESS
//     address: {
//       fullName: { type: String },
//       mobile: { type: String },
//       pincode: { type: String },
//       houseNo: { type: String },
//       street: { type: String },
//       locality: { type: String },
//       city: { type: String },
//       state: { type: String },
//       landmark: { type: String },
//       gstNumber: { type: String },
//       deliveryType: {
//         type: String,
//         enum: ["Home Delivery", "Pickup", "Courier"],
//         default: "Home Delivery",
//       },
//     },

//     // 🚚 DELIVERY STATUS
//     status: {
//       type: String,
//       enum: [
//         "Order Placed",
//         "Processing",
//         "Quality Check",
//         "Packing",
//         "Shipped",
//         "Out for Delivery",
//         "Delivered",
//         "Canceled",
//       ],
//       default: "Order Placed",
//     },
//     deliveryStatus: { type: String, default: "Order Placed" },
//     deliveryDate: { type: Date },

//     // ❌ CANCEL / REFUND
//     isCanceled: { type: Boolean, default: false },
//     isRefunded: { type: Boolean, default: false },
//     refundId: { type: String },

//     // 🧾 ADMIN NOTES
//     adminNote: { type: String },

//     // 🖼️ PRODUCT VISUALS
//     auctionImage: { type: String },
//     productImage: { type: String },
//     finalPrice: { type: Number },
//   },
//   { timestamps: true }
// );

// /**
//  * ✅ INDEXES for Faster Queries
//  */
// orderSchema.index({ userId: 1, createdAt: -1 });
// orderSchema.index({ order_id: 1 });
// orderSchema.index({ razorpayOrderId: 1 });
// orderSchema.index({ paymentStatus: 1 });

// /**
//  * ✅ AUTO-POPULATE PAYMENT REF
//  */
// orderSchema.pre(/^find/, function (next) {
//   this.populate("paymentRef");
//   next();
// });

// /**
//  * ✅ MODEL EXPORT (safe for hot reload)
//  */
// const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
// export default Order;

// backend/models/Order.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const orderSchema = new mongoose.Schema(
  {
    order_id: { type: String, default: () => uuidv4(), unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String, default: "N/A", index: true },

    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    deliveryStatus: {
      type: String,
      enum: ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Order Placed",
    },

    address: {
      pincode: String,
      houseNo: String,
      street: String,
      locality: String,
      landmark: String,
      gstNumber: String,
      deliveryType: { type: String, enum: ["Home Delivery", "Store Pickup"] },
    },

    items: [
      {
        productId: { type: String },
        name: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],

    // dynamic ref — can point to Payment or Payment2
    paymentRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "paymentRefModel",
      default: null,
    },
    paymentRefModel: {
      type: String,
      enum: ["Payment", "Payment2"],
      default: "Payment",
    },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
