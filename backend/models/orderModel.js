

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
