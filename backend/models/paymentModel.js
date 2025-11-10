// import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// /**
//  * =======================================================
//  * 💰 PAYMENT MODEL (Enhanced)
//  * =======================================================
//  * Supports address + Razorpay + dynamic linking with Order.
//  */
// const paymentSchema = new mongoose.Schema(
//   {
//     /**
//      * =======================================================
//      * 🧾 USER & ORDER INFO
//      * =======================================================
//      */
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     // Unique internal order reference
//     order_id: {
//       type: String,
//       default: () => uuidv4(),
//       unique: true,
//       index: true,
//     },

//     // Links to the order (after creation)
//     orderRef: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//       default: null,
//     },

//     /**
//      * =======================================================
//      * 📧 CONTACT / DELIVERY DETAILS
//      * =======================================================
//      */
//     email: { type: String, required: true, trim: true },
//     mobileNumber: { type: String, required: true },
//     whatsappOptIn: { type: Boolean, default: false },
//     whatsappNumber: { type: String },

//     deliveryType: {
//       type: String,
//       enum: ["Home Delivery", "Store Pickup"],
//       required: true,
//     },

//     recipientName: { type: String, required: true },
//     recipientMobile: { type: String },
//     pincode: { type: String, required: true },
//     houseNo: { type: String, required: true },
//     street: { type: String, required: true },
//     locality: { type: String, required: true },
//     landmark: { type: String },
//     gstNumber: { type: String },

//     /**
//      * =======================================================
//      * 🛒 CART & AMOUNT
//      * =======================================================
//      */
//     cartData: { type: Object, required: true },
//     amount: { type: Number, required: true },
//     currency: { type: String, default: "INR" },

//     /**
//      * =======================================================
//      * 💳 PAYMENT DATA
//      * =======================================================
//      */
//     status: {
//       type: String,
//       enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
//       default: "PENDING",
//       index: true,
//     },

//     razorpayOrderId: { type: String, index: true },
//     razorpayPaymentId: { type: String, default: "N/A" },
//     razorpaySignature: { type: String },
//     providerResponse: { type: Object },
//     paymentVerifiedAt: { type: Date },

//     /**
//      * =======================================================
//      * 💸 REFUND / ADMIN FIELDS
//      * =======================================================
//      */
//     isRefunded: { type: Boolean, default: false },
//     refundId: { type: String },
//     refundReason: { type: String },

//     /**
//      * =======================================================
//      * 🔗 DYNAMIC RELATIONSHIP
//      * =======================================================
//      */
//     paymentRef: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: "paymentRefModel",
//       default: null,
//     },
//     paymentRefModel: {
//       type: String,
//       enum: ["Payment", "Payment2"],
//       default: "Payment",
//     },
//   },
//   { timestamps: true }
// );

// /**
//  * =======================================================
//  * ⚙️ INDEXES & PRE-SAVE HOOKS
//  * =======================================================
//  */
// paymentSchema.index({ userId: 1, createdAt: -1 });
// paymentSchema.index({ status: 1, razorpayOrderId: 1 });

// paymentSchema.pre("save", function (next) {
//   if (!this.recipientMobile) this.recipientMobile = this.mobileNumber;
//   next();
// });

// /**
//  * =======================================================
//  * 🔁 POST-SAVE HOOK (auto link with Order)
//  * =======================================================
//  * When payment is created and has a valid orderRef or razorpayOrderId,
//  * automatically link with the corresponding Order document.
//  */
// paymentSchema.post("save", async function (doc, next) {
//   try {
//     const Order = mongoose.model("Order");

//     if (!doc.razorpayOrderId && !doc.orderRef) return next();

//     // Find and link order
//     const order = await Order.findOneAndUpdate(
//       {
//         $or: [
//           { _id: doc.orderRef },
//           { razorpayOrderId: doc.razorpayOrderId },
//           { order_id: doc.order_id },
//         ],
//       },
//       {
//         $set: {
//           razorpayPaymentId: doc.razorpayPaymentId || "N/A",
//           paymentStatus: doc.status,
//           paymentRef: doc._id,
//         },
//       },
//       { new: true }
//     );

//     if (!order) {
//       console.warn("⚠️ No matching order found for payment link.");
//     }
//   } catch (err) {
//     console.error("❌ Error linking payment to order:", err.message);
//   }
//   next();
// });

// const Payment =
//   mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

// export default Payment;

// backend/models/Payment.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    order_id: { type: String, default: () => uuidv4(), unique: true, index: true },

    email: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true },

    deliveryType: { type: String, enum: ["Home Delivery", "Store Pickup"], required: true },
    recipientName: { type: String, required: true },
    recipientMobile: { type: String },
    pincode: { type: String, required: true },
    houseNo: { type: String, required: true },
    street: { type: String, required: true },
    locality: { type: String, required: true },
    landmark: { type: String },
    gstNumber: { type: String },

    cartData: { type: Object, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"], default: "PENDING", index: true },

    razorpayOrderId: { type: String, index: true, default: null },
    razorpayPaymentId: { type: String, index: true, default: "N/A" },
    razorpaySignature: { type: String, default: null },
    providerResponse: { type: Object, default: {} },
    paymentVerifiedAt: { type: Date },

    // link to order (if you want a direct pointer)
    orderRef: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },

    // support dynamic ref naming if you need
    paymentRefModel: { type: String, enum: ["Payment", "Payment2"], default: "Payment" },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.pre("save", function (next) {
  if (!this.recipientMobile) this.recipientMobile = this.mobileNumber;
  next();
});

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
